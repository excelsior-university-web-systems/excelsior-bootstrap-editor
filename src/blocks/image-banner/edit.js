import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit ({ attributes, setAttributes }) {
    const { url } = attributes;
    const [tempUrl, setTempUrl] = useState('');
    const blockProps = useBlockProps( {
        className: 'decorative-banner'
    } );
    const onInsertUrl = () => {
        if (tempUrl) {
            setAttributes({ url: tempUrl });
        }
    };

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <TextControl
                    label="Image URL"
                    help="Replace the image URL to update the image."
                    value={url}
                    onChange={(value) => setAttributes({ url: value })}
                />
            </PanelBody>
        </InspectorControls>
        { url ? (

            <img {...blockProps} src={url} alt="" role="presentation" />

        ) : (

            <div {...blockProps}>

                <div class="excelsior-image-url-insert">
                    <TextControl label="Image URL" value={tempUrl} onChange={(newUrl) => setTempUrl(newUrl)} />
                    <Button onClick={onInsertUrl} variant="primary" >Insert</Button>
                </div>
            
            </div>
            
        ) }
        </>

        
    );
}