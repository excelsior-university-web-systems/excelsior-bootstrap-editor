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

wp.domReady(() => {

    wp.richText.unregisterFormatType('core/image');        // Remove inline image
    wp.richText.unregisterFormatType('core/text-color');   // Remove text color/highlight
    wp.richText.unregisterFormatType('core/language');     // Remove language button
    wp.richText.unregisterFormatType('core/keyboard');     // Remove keyboard input button
    wp.richText.unregisterFormatType('core/footnote');   // Remove footnote button

    // Make the post title not editable and change the placeholder to an instruction
    observeElement( '.editor-post-title', ( element ) => {
        element.setAttribute( 'contenteditable', false );
    } );
  
});

/* ADD COURSE META FIELDS FOR "TITLE" */

const CourseMetaFields = () => {

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

const validateFields = () => {

    const { getEditedPostAttribute } = select('core/editor');
    const meta = getEditedPostAttribute('meta') || {};
    const courseNumber = meta[XCLSR_BTSTRP_POST_TYPE+'_post_course_number'] || '';
    const pageTitle = meta[XCLSR_BTSTRP_POST_TYPE+'_post_page_title'] || '';
    const year = meta[XCLSR_BTSTRP_POST_TYPE+'_post_year'] || '';

    return courseNumber && pageTitle && year;

};

let isSavingLocked = false;
let isPostTypeAvailable = false;

subscribe( () => {
    const { isSavingPost, hasChangedContent, getCurrentPostType, isPublishSidebarEnabled } = select('core/editor');
    const { lockPostSaving, unlockPostSaving, lockPostAutosaving, unlockPostAutosaving, disablePublishSidebar } = dispatch('core/editor');
    const isSaving = isSavingPost();
    const contentChanged = hasChangedContent();
    const isValid = validateFields();
    const postType = getCurrentPostType();

    if ( !isPostTypeAvailable && postType ) {
        const prePublishSidebarEnabled = isPublishSidebarEnabled();
        if ( postType === XCLSR_BTSTRP_POST_TYPE && prePublishSidebarEnabled ) {
            disablePublishSidebar();
        }
        isPostTypeAvailable = true;
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

/* GET CODE BUTTON */

// Define the button component
const GetCodeButton = () => {

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

// Register the plugin to display the button in the editor's sidebar
registerPlugin (XCLSR_BTSTRP_EDITOR_PREFIX + '-get-code-button', {
    render: GetCodeButton,
    icon: 'smiley',
});

/* ADD SIZE AND STYLE SETTINGS TO CORE/HEADING BLOCK */

addFilter( 'blocks.registerBlockType', XCLSR_BTSTRP_EDITOR_PREFIX + '/heading-block-size-settings', (settings, name) => {
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
            }
        };
    }
    return settings;
});

// Ensure the class is reflected in the editor preview
addFilter('editor.BlockListBlock', XCLSR_BTSTRP_EDITOR_PREFIX + '/heading-block-size-preview-class', (BlockListBlock) => {
    return (props) => {
        if (props.name === 'core/heading') {
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
});

// Inject the size class into the block's save props to apply on the front-end
addFilter('blocks.getSaveContent.extraProps', XCLSR_BTSTRP_EDITOR_PREFIX + '/heading-block-size-class', (extraProps, blockType, attributes) => {
    if (blockType.name === 'core/heading') {
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
});

// Add the custom control to the block's inspector
const addHeadingSizeControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {

        if (props.name !== 'core/heading') {
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
            { label: 'Underline', value: 'fw-semibold pb-1 mb-3 border-bottom border-2 border-dark' }
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