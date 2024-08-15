import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit ( { attributes, setAttributes } ) {

    const { url } = attributes;
    const [tempUrl, setTempUrl] = useState('');
    const [hasError, setHasError] = useState(false);

    const blockProps = useBlockProps( {
        className: 'decorative-banner'
    } );

    const onInsertUrl = () => {
        if ( tempUrl ) {
            setAttributes({ url: tempUrl });
        }
    };

    const handleImageError = () => {
        setHasError(true); 
    };

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <TextControl
                    label="Image URL"
                    help="Replace the image URL to update the image."
                    value={url}
                    onChange={(value) => {
                        setAttributes( { url: value } );
                        setHasError( false );
                    } }
                />
            </PanelBody>
        </InspectorControls>
        { url && !hasError ? (

            <img {...blockProps} src={url} alt="" role="presentation" onError={handleImageError} />

        ) : (

            <div {...blockProps}>
                { hasError ? (
                    <div className="excelsior-image-error">
                        <div className="alert alert-warning my-0"><p className='my-0'><strong>Failed to load image.</strong> The image at <a href={url} target='_blank'>{url}</a> cannot be displayed. Please check the URL in Settings. If the image is from a website requiring authentication (like Canvas LMS), sign in first, then reload the editor.</p></div>
                    </div>
                ) : (
                    <div className="excelsior-image-url-insert">
                        <TextControl label="Image URL" value={tempUrl} onChange={(newUrl) => setTempUrl(newUrl)} />
                        <Button onClick={onInsertUrl} variant="primary">Insert</Button>
                    </div>
                ) }
            </div>
            
        ) }
        </>

    );
}