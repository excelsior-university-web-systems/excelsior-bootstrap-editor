import { addFilter } from '@wordpress/hooks';
import { XCLSR_BTSTRP_EDITOR_PREFIX, XCLSR_BTSTRP_POST_TYPE } from '../constants';
import { registerPlugin } from '@wordpress/plugins';
import { PluginPostStatusInfo } from '@wordpress/editor';
import { InspectorControls } from '@wordpress/block-editor';
import { Button, Modal, TextControl, Notice, __experimentalText as Text, PanelBody, SelectControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select, dispatch, useSelect, useDispatch, subscribe } from '@wordpress/data';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { observeElement } from '../commons';
import beautify from 'js-beautify';

window.Prism = window.Prism || {};
Prism.manual = true;

const NAMESPACE_BLOCK = `${XCLSR_BTSTRP_EDITOR_PREFIX}/namespace`;
const CORE_TABLE_BLOCK = 'core/table';
const BOOTSTRAP_TABLE_VARIATION_ATTRIBUTES = {
    isBootstrapTableVariant: true,
    isCompact: false,
    isStriped: false,
    border: 'table-bordered',
};

/**
 * Recursively checks whether a block tree contains the Excelsior namespace block.
 *
 * @param {Array<Object>} [blocks=[]] Registered editor blocks to scan.
 * @returns {boolean} True when the namespace block exists anywhere in the tree.
 */
const blockTreeHasExcelsiorBootstrapNamespace = ( blocks = [] ) => {
    return blocks.some( ( block ) => {
        if ( block.name === NAMESPACE_BLOCK ) {
            return true;
        }

        return blockTreeHasExcelsiorBootstrapNamespace( block.innerBlocks || [] );
    } );
};

/**
 * Determines whether the current editor session contains the namespace block.
 *
 * @returns {boolean} True when the block editor currently contains the namespace block.
 */
const hasExcelsiorBootstrapNamespaceBlockInEditor = () => {
    const blockEditorStore = select( 'core/block-editor' );

    if ( ! blockEditorStore || ! blockEditorStore.getBlocks ) {
        return false;
    }

    return blockTreeHasExcelsiorBootstrapNamespace( blockEditorStore.getBlocks() );
};

/**
 * Checks whether the current editor is loading the Excelsior custom post type.
 *
 * @returns {boolean} True when the current post type matches `excelsior_bootstrap`.
 */
const isExcelsiorBootstrapPostType = () => {
    const editorStore = select( 'core/editor' );

    if ( ! editorStore || ! editorStore.getCurrentPostType ) {
        return false;
    }

    return editorStore.getCurrentPostType() === XCLSR_BTSTRP_POST_TYPE;
};

/**
 * Determines whether Excelsior editor enhancements should be active at all.
 *
 * @returns {boolean} True for the Excelsior post type or when the namespace block exists in the editor.
 */
const isBootstrapEditorActive = () => {
    return isExcelsiorBootstrapPostType() || hasExcelsiorBootstrapNamespaceBlockInEditor();
};

const useIsExcelsiorBootstrapPostType = () => useSelect( () => isExcelsiorBootstrapPostType(), [] );

/**
 * Checks whether a block is nested anywhere inside the namespace block.
 *
 * @param {string} clientId Gutenberg client ID for the block being inspected.
 * @returns {boolean} True when one of the block's parents is the namespace block.
 */
const isBlockInsideNamespace = ( clientId ) => {
    if ( ! clientId ) {
        return false;
    }

    const blockEditorStore = select( 'core/block-editor' );

    if ( ! blockEditorStore || ! blockEditorStore.getBlockParents || ! blockEditorStore.getBlockName ) {
        return false;
    }

    const parentClientIds = blockEditorStore.getBlockParents( clientId );

    return parentClientIds.some( ( parentClientId ) => {
        return blockEditorStore.getBlockName( parentClientId ) === NAMESPACE_BLOCK;
    } );
};

/**
 * Recursively collects core table blocks nested within the Excelsior namespace block.
 *
 * @param {Array<Object>} [blocks=[]] Block tree to scan.
 * @param {boolean} [isInsideNamespace=false] Whether the current recursion branch is inside the namespace.
 * @returns {Array<Object>} Matching table blocks that should use the Bootstrap variation.
 */
const getNamespaceTableBlocks = ( blocks = [], isInsideNamespace = false ) => {
    return blocks.flatMap( ( block ) => {
        const nextIsInsideNamespace =
            isInsideNamespace || block.name === NAMESPACE_BLOCK;
        const matchingBlocks =
            nextIsInsideNamespace && block.name === CORE_TABLE_BLOCK ? [ block ] : [];

        return [
            ...matchingBlocks,
            ...getNamespaceTableBlocks( block.innerBlocks || [], nextIsInsideNamespace ),
        ];
    } );
};

/**
 * Converts namespace-scoped core table blocks to the Bootstrap table variation once.
 *
 * @returns {void}
 */
const convertNamespaceTablesToBootstrapVariation = () => {
    if ( ! isExcelsiorBootstrapPostType() ) {
        return;
    }

    const blockEditorStore = select( 'core/block-editor' );

    if ( ! blockEditorStore?.getBlocks ) {
        return;
    }

    const namespaceTableBlocks = getNamespaceTableBlocks( blockEditorStore.getBlocks() );
    const blocksNeedingConversion = namespaceTableBlocks.filter( ( block ) => {
        return block.attributes?.isBootstrapTableVariant !== true;
    } );

    if ( ! blocksNeedingConversion.length ) {
        return;
    }

    dispatch( 'core/block-editor' ).updateBlockAttributes(
        blocksNeedingConversion.map( ( block ) => block.clientId ),
        BOOTSTRAP_TABLE_VARIATION_ATTRIBUTES
    );
};

let hasActivatedNamespaceEnhancements = false;
let hasActivatedPostTypeEnhancements = false;

/**
 * Applies editor-wide namespace enhancements once per editor session.
 *
 * These APIs unregister editor features globally, so they cannot be scoped to an
 * individual block instance after they run.
 *
 * @returns {void}
 */
const activateNamespaceEnhancements = () => {
    if ( hasActivatedNamespaceEnhancements ) {
        return;
    }

    hasActivatedNamespaceEnhancements = true;

    wp.richText.unregisterFormatType('core/image');        // Remove inline image
    wp.richText.unregisterFormatType('core/text-color');   // Remove text color/highlight
    wp.richText.unregisterFormatType('core/language');     // Remove language button
    wp.richText.unregisterFormatType('core/keyboard');     // Remove keyboard input button
    wp.richText.unregisterFormatType('core/footnote');   // Remove footnote button

    wp.blocks.unregisterBlockVariation( 'core/paragraph', 'stretchy-paragraph' ); // Remove stretchy paragraph
    wp.blocks.unregisterBlockVariation( 'core/heading', 'stretchy-heading' ); // Remove stretchy heading
};

/**
 * Applies Excelsior post-type-only editor changes once per editor session.
 *
 * @returns {void}
 */
const activatePostTypeEnhancements = () => {
    if ( hasActivatedPostTypeEnhancements ) {
        return;
    }

    hasActivatedPostTypeEnhancements = true;

    // Make the post title not editable and change the placeholder to an instruction
    observeElement( '.editor-post-title', ( element ) => {
        element.setAttribute( 'contenteditable', false );
    } );
};

wp.domReady(() => {
    const maybeActivateEditorEnhancements = () => {
        if ( isBootstrapEditorActive() ) {
            activateNamespaceEnhancements();
        }

        if ( isExcelsiorBootstrapPostType() ) {
            activatePostTypeEnhancements();
            convertNamespaceTablesToBootstrapVariation();
        }
    };

    maybeActivateEditorEnhancements();
    subscribe( maybeActivateEditorEnhancements );
});

/**
 * Renders the Excelsior course metadata sidebar panel.
 *
 * @returns {JSX.Element|null} The sidebar panel for the Excelsior post type only.
 */
const CourseMetaFields = () => {
    const isExcelsiorBootstrap = useIsExcelsiorBootstrapPostType();

    if ( ! isExcelsiorBootstrap ) {
        return null;
    }

    const { unlockPostSaving, lockPostSaving } = dispatch('core/editor');
    const meta = useSelect( (select) => select('core/editor').getEditedPostAttribute('meta') );
    const currentTitle = useSelect((select) => select('core/editor').getEditedPostAttribute('title'));
    const { editPost } = useDispatch('core/editor');
    const courseNumber = meta[XCLSR_BTSTRP_POST_TYPE+'_post_course_number'] || '';
    const pageTitle = meta[XCLSR_BTSTRP_POST_TYPE+'_post_page_title'] || '';
    let year = meta[XCLSR_BTSTRP_POST_TYPE+'_post_year'];

    if ( year == '' ) {
        year = new Date().getFullYear().toString();
        editPost({ meta: { ...meta, excelsior_bootstrap_post_year: year } });
    }

    const combinedTitle = `${courseNumber} - ${pageTitle} - ${year}`;

    // Removes spaces and makes uppercase
    const formatCourseNumber = (value) => {
        return value.replace(/\s+/g, '').toUpperCase(); 
    };

    // Clear the post title if all fields are empty
    if ( (!courseNumber || !pageTitle || !year) && currentTitle ) {
        editPost({ title: '' });
        lockPostSaving('required-fields');
    }

    // Otherwise, update the title if the fields are filled 
    else if ( courseNumber && pageTitle && year && combinedTitle !== currentTitle ) {
        editPost({ title: combinedTitle });
        unlockPostSaving('required-fields');
    }

    return (
        <>
        <PluginPostStatusInfo>
            <PanelBody className='course-meta-panel'>
                <TextControl
                    isBlock
                    label="Course Number"
                    className='required'
                    help="Example: EGR290, NUR104, etc."
                    value={courseNumber}
                    onChange={(value) => editPost({ meta: { ...meta, excelsior_bootstrap_post_course_number: formatCourseNumber(value) } })}
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                />
                <TextControl
                    isBlock
                    label="Page Title"
                    className='required'
                    help="Example: M1.1 - Exploring Computer Science Career Paths"
                    value={pageTitle}
                    onChange={(value) => editPost({ meta: { ...meta, excelsior_bootstrap_post_page_title: value } })}
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                />
                <TextControl
                    isBlock
                    label="Year"
                    className='required'
                    type='number'
                    value={year}
                    onChange={(value) => editPost({ meta: { ...meta, excelsior_bootstrap_post_year: value } })}
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                />
            </PanelBody>
        </PluginPostStatusInfo>
        </>
    );
};

/**
 * Validates the required Excelsior metadata fields used to construct the title.
 *
 * @returns {boolean} True when the required fields are complete or the post type does not apply.
 */
const validateFields = () => {
    if ( ! isExcelsiorBootstrapPostType() ) {
        return true;
    }

    const { getEditedPostAttribute } = select('core/editor');
    const meta = getEditedPostAttribute('meta') || {};
    const courseNumber = meta[XCLSR_BTSTRP_POST_TYPE+'_post_course_number'] || '';
    const pageTitle = meta[XCLSR_BTSTRP_POST_TYPE+'_post_page_title'] || '';
    const year = meta[XCLSR_BTSTRP_POST_TYPE+'_post_year'] || '';

    return courseNumber && pageTitle && year;

};

let isSavingLocked = false;

subscribe( () => {
    const { isSavingPost, hasChangedContent, getCurrentPostType, isPublishSidebarEnabled } = select('core/editor');
    const { lockPostSaving, unlockPostSaving, lockPostAutosaving, unlockPostAutosaving, disablePublishSidebar } = dispatch('core/editor');
    const isSaving = isSavingPost();
    const contentChanged = hasChangedContent();
    const postType = getCurrentPostType();
    const isExcelsiorBootstrap = postType === XCLSR_BTSTRP_POST_TYPE;
    const isValid = validateFields();

    if ( ! isExcelsiorBootstrap ) {
        if ( isSavingLocked ) {
            isSavingLocked = false;
            unlockPostSaving('required-fields');
            unlockPostAutosaving('required-fields');
            dispatch('core/notices').removeNotice('required-fields');
        }

        return;
    }

    // The custom publish flow replaces the default pre-publish sidebar for this post type.
    if ( isPublishSidebarEnabled() ) {
        disablePublishSidebar();
    }

    if ((isSaving && !isValid) || (contentChanged && !isValid)) {
        if (!isSavingLocked) {
            isSavingLocked = true;
            lockPostSaving('required-fields');
            lockPostAutosaving('required-fields');
            dispatch('core/notices').createNotice(
                'error',
                'Please fill in all required fields: Course Number, Page Title, and Year.',
                { id: 'required-fields', isDismissible: true }
            );
        }
    } else if (isValid && isSavingLocked) {
        isSavingLocked = false;
        unlockPostSaving('required-fields');
        unlockPostAutosaving('required-fields');
        dispatch('core/notices').removeNotice('required-fields');
    }
} );

registerPlugin( XCLSR_BTSTRP_EDITOR_PREFIX + '-course-meta-fields', {
    render: CourseMetaFields,
    icon: null,
} );

/**
 * Renders the "Get Code" sidebar action for published Excelsior posts.
 *
 * @returns {JSX.Element|null} Sidebar UI for published Excelsior posts only.
 */
const GetCodeButton = () => {
    const isExcelsiorBootstrap = useIsExcelsiorBootstrapPostType();

    if ( ! isExcelsiorBootstrap ) {
        return null;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [renderedHTML, setRenderedHTML] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const { isSaving, hasUnsavedChanges, unsavedMeta, postStatus } = useSelect((select) => {
        const editorStore = select('core/editor');
        return {
            isSaving: editorStore.isSavingPost(),
            unsavedMeta: editorStore.getPostEdits().meta !== undefined,
            hasUnsavedChanges: editorStore.hasChangedContent(),
            postStatus: editorStore.getEditedPostAttribute('status'),
        };
    });
    const isDisabled = isSaving || hasUnsavedChanges || unsavedMeta || postStatus !== 'publish';

    // Define the function that will execute when the button is clicked
    const getRenderedHTML = () => {
        const postId = select('core/editor').getCurrentPostId();
        const restUrl = `${wpApiSettings.root}wp/v2/excelsior_bootstrap/${postId}?context=edit&t=${new Date().getTime()}`;
    
        // Fetch the raw content via REST API
        fetch(restUrl, {
            headers: {
                'X-WP-Nonce': wpApiSettings.nonce,
            },
        })
            .then((response) => response.json())
            .then((post) => {
                const rawContent = post.content.rendered.replace(/<!--\s*\/?wp:[^>]+-->/g, '');
                const htmlCode = rawContent.replace(
                    /<i([^>]*)>(.*?)<\/i>/g,
                    (match, attrs, innerText) => {
                        // Preserve icon spacing when rendered HTML is copied out of the editor.
                        const nonBreakingText = innerText.replace(/ /g, '&nbsp;');
                        return `<i${attrs}>${nonBreakingText}</i>`;
                    }
                );
    
                setRenderedHTML(beautify.html(htmlCode, { preserve_newlines: false }));
                setIsModalOpen(true);
            })
            .catch((error) => {
                console.error('Error fetching the post content:', error);
            });
    };    

    const copyToClipboard = () => {
        navigator.clipboard.writeText(renderedHTML)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 6000);
            })
            .catch(err => {
                console.error('Failed to copy code: ', err);
            });
    };

    useEffect(() => {
        if (isModalOpen) {
            const codeElement = document.querySelector('.get-code-modal');
            if (codeElement) {
                Prism.highlightAllUnder(codeElement);
            }
        }
    }, [isModalOpen]);

    return (
        <>
        <PluginPostStatusInfo>
            <PanelBody className='get-code-btn-panel'>
            <Button className='get-code-btn' onClick={getRenderedHTML} disabled={isDisabled} __next40pxDefaultSize>
                Get Code
            </Button>
            {isDisabled && (
                <Text as='p' variant='muted' isBlock style={{marginTop: '8px'}}>
                    The Get Code button will be enabled when all changes are saved or published.
                </Text>
            )}
            </PanelBody>
        </PluginPostStatusInfo>
        {isModalOpen && (
            <Modal
                title="HTML Code"
                className='get-code-modal'
                onRequestClose={() => setIsModalOpen(false)}
                shouldCloseOnClickOutside={false}
                size='fill'
            >
                {copySuccess && (
                    <Notice status="success" isDismissible={true}>
                        HTML code copied to clipboard!
                    </Notice>
                )}
                <div className='cta-wrapper'>
                    <Button
                        variant="primary"
                        onClick={copyToClipboard}
                        style={{ marginTop: '15px' }}
                        __next40pxDefaultSize
                    >
                        Copy Code
                    </Button>
                </div>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    <code class="language-html line-numbers">{renderedHTML}</code>
                </pre>
            </Modal>
        )}
        </>
    );
};

registerPlugin (XCLSR_BTSTRP_EDITOR_PREFIX + '-get-code-button', {
    render: GetCodeButton,
    icon: null,
});

/**
 * Extends `core/heading` with Excelsior-only styling attributes.
 *
 * The attributes are registered globally so first-time insertion inside the
 * namespace works immediately, but the UI and saved classes are still gated
 * to headings nested under the namespace block.
 *
 * @param {Object} settings Block settings being registered.
 * @param {string} name Block name being registered.
 * @returns {Object} Updated block settings.
 */
const addingBlockSizeAndStyle = (settings, name) => {
    if (name === 'core/heading') {
        settings.attributes = {
            ...settings.attributes,
            headingSizeClass: {
                type: 'string',
                default: ''
            },
            headingStyleClasses: {
                type: 'string',
                default: ''
            },
            isInExcelsiorNamespace: {
                type: 'boolean',
                default: false
            }
        };
    }

    return settings;
};

addFilter( 'blocks.registerBlockType', XCLSR_BTSTRP_EDITOR_PREFIX + '/heading-block-size-settings', addingBlockSizeAndStyle);

/**
 * Mirrors heading style classes in the editor preview only for namespace headings.
 *
 * @param {Function} BlockListBlock Original editor block list component.
 * @returns {Function} Wrapped component with conditional preview classes.
 */
const addBlockSizePreviewClass = (BlockListBlock) => {
    return (props) => {
        const isInsideNamespace = useSelect( (select) => {
            if ( props.name !== 'core/heading' ) {
                return false;
            }

            const blockEditorStore = select( 'core/block-editor' );

            if ( ! blockEditorStore || ! blockEditorStore.getBlockParents || ! blockEditorStore.getBlockName ) {
                return false;
            }

            const parentClientIds = blockEditorStore.getBlockParents( props.clientId );

            // A heading is eligible only when one of its ancestors is the namespace block.
            return parentClientIds.some( ( parentClientId ) => {
                return blockEditorStore.getBlockName( parentClientId ) === NAMESPACE_BLOCK;
            } );
        }, [ props.clientId, props.name ] );

        if (isInsideNamespace && props.name === 'core/heading') {
            let additionalClasses = [];

            if (props.attributes.headingSizeClass && props.attributes.headingSizeClass.trim().length) {
                additionalClasses.push(props.attributes.headingSizeClass);
            }

            if (props.attributes.headingStyleClasses && props.attributes.headingStyleClasses.trim().length) {
                additionalClasses.push(props.attributes.headingStyleClasses);
            }

            return <BlockListBlock {...props} className={`${props.className} ${additionalClasses.join(' ')}`} />;
        }

        return <BlockListBlock {...props} />;
    };
};

addFilter('editor.BlockListBlock', XCLSR_BTSTRP_EDITOR_PREFIX + '/heading-block-size-preview-class', addBlockSizePreviewClass);

/**
 * Applies saved heading classes only when the heading was nested in the namespace.
 *
 * @param {Object} extraProps Save props generated for the block.
 * @param {Object} blockType Registered block type object.
 * @param {Object} attributes Block attributes being saved.
 * @returns {Object} Updated save props.
 */
const saveBlockSizeAndStyle = (extraProps, blockType, attributes) => {
    if (attributes.isInExcelsiorNamespace && blockType.name === 'core/heading') {
        let additionalClasses = [];

        if (attributes.headingSizeClass && attributes.headingSizeClass.trim().length) {
            additionalClasses.push(attributes.headingSizeClass);
        }

        if (attributes.headingStyleClasses && attributes.headingStyleClasses.trim().length) {
            additionalClasses.push(attributes.headingStyleClasses);
        }

        extraProps.className = `${extraProps.className || ''} ${additionalClasses.join(' ')}`.trim();
    }

    return extraProps;
};

addFilter('blocks.getSaveContent.extraProps', XCLSR_BTSTRP_EDITOR_PREFIX + '/heading-block-size-class', saveBlockSizeAndStyle);

/**
 * Adds the heading inspector controls only when the heading lives inside the namespace.
 *
 * @param {Function} BlockEdit Original block edit component.
 * @returns {Function} Wrapped block edit component.
 */
const addHeadingSizeControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const isInsideNamespace = useSelect( () => {
            if ( props.name !== 'core/heading' ) {
                return false;
            }

            return isBlockInsideNamespace( props.clientId );
        }, [ props.clientId, props.name ] );

        useEffect( () => {
            if ( props.name !== 'core/heading' ) {
                return;
            }

            // Persist namespace ancestry so save-time filters can stay context-aware.
            if ( props.attributes.isInExcelsiorNamespace !== isInsideNamespace ) {
                props.setAttributes( { isInExcelsiorNamespace: isInsideNamespace } );
            }
        }, [ isInsideNamespace, props ] );

        if (props.name !== 'core/heading' || ! isInsideNamespace) {
            return <BlockEdit {...props} />;
        }

        const headingLevelSizeOptions = [
            { label: 'Default', value: '' },
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
            { label: 'H5', value: 'h5' },
            { label: 'H6', value: 'h6' }
        ];

        const headingStyleOptions = [
            { label: 'Default', value: '' },
            { label: 'Underline', value: 'fw-semibold pb-1 mb-3 border-bottom border-2 border-secondary-subtle' }
        ];

        const { attributes, setAttributes } = props;
        const { headingSizeClass, headingStyleClasses } = attributes;
        
        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title="Settings" initialOpen={true}>
                        <SelectControl
                            label="Heading Level Size"
                            help="Set the font size of the heading to use the size of a different heading level."
                            value={headingSizeClass}
                            options={headingLevelSizeOptions}
                            onChange={(value) => setAttributes({ headingSizeClass: value })}
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                        />
                        <SelectControl
                            label="Heading Style"
                            value={headingStyleClasses}
                            options={headingStyleOptions}
                            onChange={(value) => setAttributes({ headingStyleClasses: value })}
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'addHeadingSizeControl');

addFilter('editor.BlockEdit', XCLSR_BTSTRP_EDITOR_PREFIX + '/heading-block-size-inspector-control', addHeadingSizeControl);
