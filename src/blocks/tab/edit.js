import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

function generateHtmlId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const chars = letters + '0123456789';
    const timestamp = Date.now().toString(36);
    const randomLength = 6;
    let randomPart = '';

    for (let i = 0; i < randomLength; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const firstChar = letters.charAt(Math.floor(Math.random() * letters.length));
    return firstChar + timestamp + randomPart;
}

export default function Edit({ attributes, setAttributes }) {
    const { title, uniqueId } = attributes;
    const blockProps = useBlockProps( {
        className: "tab-pane",
        role: "tabpanel"
    } );

    useEffect(() => {
        if (!uniqueId) {
            setAttributes({ uniqueId: generateHtmlId() });
        }
    }, [uniqueId]);

    return (
        <div {...blockProps} id={`${uniqueId}-pane`} aria-labelledby={`${uniqueId}-tab`}>
            <RichText
                tagName="h2"
                placeholder="Tab Title"
                className='h4'
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                allowedFormats={['core/bold', 'core/italic']}
            />
            <InnerBlocks template={[['core/paragraph']]} templateLock={false} />
        </div>
    );
}
