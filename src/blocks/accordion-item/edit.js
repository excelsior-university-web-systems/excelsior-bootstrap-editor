import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { useEffect } from '@wordpress/element';

function generateHtmlId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const chars = letters + '0123456789';
    const timestamp = Date.now().toString(36);
    const randomLength = 6;
    let randomPart = '';
  
    // Generate random characters from valid set for the rest of the ID
    for (let i = 0; i < randomLength; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    // Ensure the first character is a letter
    const firstChar = letters.charAt(Math.floor(Math.random() * letters.length));
  
    return firstChar + timestamp + randomPart;
}

export default function Edit({ attributes, setAttributes }) {

    const { title, uniqueId, open } = attributes;
    const blockProps = useBlockProps({
        className: 'accordion-item',
    });

    useEffect(() => {
        if (!uniqueId) {
            setAttributes({ uniqueId: generateHtmlId() });
        }
    }, [uniqueId]);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Accordion Item Settings">
                    <ToggleControl
                        label="Open when page loads"
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
