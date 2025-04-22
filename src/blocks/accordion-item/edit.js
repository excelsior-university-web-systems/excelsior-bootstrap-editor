import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { generateHtmlId, getBlocksOfType } from '../../commons';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes, clientId, context }) {

    const { title, uniqueId, open, openForEditing, HeadingLevel, headingSize } = attributes;
    const accordionHeadingLevel = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/accordionHeadingLevel'];
    const accordionHeadingSize = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/accordionHeadingSize'];
    const blockProps = useBlockProps({
        className: 'accordion-item',
    });

    const sameTypeBlocks = useSelect((select) => {
        const allBlocks = select('core/block-editor').getBlocks();
        return getBlocksOfType(allBlocks, 'excelsior-bootstrap-editor/accordion-item');
    }, []);

    useEffect(() => {

        const isDuplicate = sameTypeBlocks.some(
            ( block ) => block.clientId !== clientId && block.attributes.uniqueId === uniqueId
        );

        if ( !uniqueId || isDuplicate ) {
            setAttributes( { uniqueId: generateHtmlId() } );
        }

    }, []);

    useEffect(() => {

        if ( HeadingLevel != accordionHeadingLevel ) {
            setAttributes( {HeadingLevel: accordionHeadingLevel} );
        }

    }, [accordionHeadingLevel]);

    useEffect(() => {

        if ( headingSize != accordionHeadingSize ) {
            setAttributes( {headingSize: accordionHeadingSize} );
        }

    }, [accordionHeadingSize]);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Accordion Item Settings">
                <ToggleControl
                        label="Open on page loads"
                        help="Content is expanded immediately upon page load."
                        checked={open}
                        onChange={(value) => setAttributes({ open: value })}
                        __nextHasNoMarginBottom
                />
                <ToggleControl
                    label="Open for editing"
                    help="Editor only — content is expanded during editing."
                    checked={openForEditing}
                    onChange={(value) => setAttributes({ openForEditing: value })}
                    __nextHasNoMarginBottom
                />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <HeadingLevel className={`accordion-header ${accordionHeadingSize}`}>
                    <RichText
                        tagName="a"
                        placeholder="Accordion Item Title"
                        value={title}
                        className={openForEditing ? 'accordion-button' : 'accordion-button collapsed'}
                        role='button'
                        aria-controls={uniqueId}
                        aria-expanded={openForEditing}
                        data-bs-toggle="collapse"
                        data-bs-target={'#' + uniqueId}
                        onChange={(value) => setAttributes({ title: value })}
                        allowedFormats={['core/bold', 'core/italic', XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
                    />
                </HeadingLevel>
                <div id={uniqueId} class={`accordion-collapse collapse ${openForEditing ? 'show' : ''}`}>
                    <div class="accordion-body">
                        <InnerBlocks
                            allowedBlocks={ALLOWED_BLOCKS}
                            template={[['core/paragraph']]}
                            templateLock={false}
                            renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
