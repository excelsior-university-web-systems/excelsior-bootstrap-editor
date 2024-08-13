import { useBlockProps } from '@wordpress/block-editor';
import { Button, TextControl  } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit ({ attributes, setAttributes }) {
    const { url } = attributes;
    const [tempUrl, setTempUrl] = useState('');

    const blockProps = useBlockProps();
    const onInsertUrl = () => {
        if (tempUrl) {
            setAttributes({ url: tempUrl });
        }
    };

    return (
        <div {...blockProps}>

            {url ? (
                <img src={url} alt="" role="presentation" />
            ) : (
                <div class="excelsior-image-url-insert">
                    <TextControl label='Image URL' value={tempUrl} onChange={(newUrl) => setTempUrl(newUrl)} />
                    <Button onClick={onInsertUrl} variant="primary" >Insert</Button>
                </div>
            )}
            
        </div>
    );
}