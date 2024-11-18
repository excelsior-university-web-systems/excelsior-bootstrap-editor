import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { generateHtmlId } from '../../commons';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, context }) {

    const { title, uniqueId, open, HeadingLevel } = attributes;
    const accordionHeadingLevel = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/accordionHeadingLevel'];
    const blockProps = useBlockProps({
        className: 'accordion-item',
    });

    useEffect(() => {
        if (!uniqueId) {
            setAttributes({ uniqueId: generateHtmlId() });
        }
    }, [uniqueId]);

    useEffect(() => {

        if ( HeadingLevel != accordionHeadingLevel ) {
            setAttributes( {HeadingLevel: accordionHeadingLevel} );
        }

    }, [accordionHeadingLevel]);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Accordion Item Settings">
                    <ToggleControl
                        label="Open when page loads"
                        help="Content is displayed immediately upon page load."
                        checked={open}
                        onChange={(value) => setAttributes({ open: value })}
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <HeadingLevel class="accordion-header">
                    <RichText
                        tagName="a"
                        placeholder="Accordion Item Title"
                        value={title}
                        className={`accordion-button${open ? '' : ' collapsed'}`}
                        role='button'
                        aria-controls={uniqueId}
                        aria-expanded={open}
                        data-bs-toggle="collapse"
                        data-bs-target={'#' + uniqueId}
                        onChange={(value) => setAttributes({ title: value })}
                        allowedFormats={['core/bold', 'core/italic', XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
                    />
                </HeadingLevel>
                <div id={uniqueId} class={`accordion-collapse collapse${open ? ' show' : ''}`}>
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
