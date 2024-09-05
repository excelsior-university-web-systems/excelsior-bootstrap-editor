import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
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

    const { title, uniqueId } = attributes;
    const blockProps = useBlockProps();

    useEffect(() => {
        if (!uniqueId) {
            setAttributes({ uniqueId: generateHtmlId() });
        }
    }, [uniqueId]);

    return (
        <div {...blockProps}>
            <RichText
                tagName="h2"
                placeholder="Accordion Item Title"
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                allowedFormats={['core/bold', 'core/italic', XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
            />
            <div id={uniqueId}>
                <div>
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={[['core/paragraph']]}
                        templateLock={false}
                        renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                    />
                </div>
            </div>
        </div>
    );
}
