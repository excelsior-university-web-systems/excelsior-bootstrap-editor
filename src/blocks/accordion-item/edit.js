import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { useEffect } from '@wordpress/element';

function generateUniqueID() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return timestamp + randomPart;
}

export default function Edit({ attributes, setAttributes }) {

    const { title, uniqueId, open } = attributes;
    const blockProps = useBlockProps({
        className: 'accordion-item',
    });

    useEffect(() => {
        if (!uniqueId) {
            setAttributes({ uniqueId: generateUniqueID() });
        }
    }, [uniqueId]);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Accordion Item Settings">
                    <ToggleControl
                        label="Shown when page loads"
                        help="Content is displayed immediately upon page load."
                        checked={open}
                        onChange={(value) => setAttributes({ open: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <h2 class="accordion-header">
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
                </h2>
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
