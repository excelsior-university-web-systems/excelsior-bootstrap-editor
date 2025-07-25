import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, __experimentalSpacer as Spacer } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit ( { attributes, setAttributes } ) {

    const { url, cover } = attributes;
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

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
    }

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
                    __nextHasNoMarginBottom
                />
            </PanelBody>
        </InspectorControls>
        { url && !hasError ? (

            <img {...blockProps} src={url} alt="" role="presentation" onError={handleImageError} />

        ) : (

            <div {...blockProps}>
                { hasError ? (
                    <div className="excelsior-image-error">
                        <div className="alert alert-warning my-0"><p className='my-0'><strong>Failed to load image.</strong> The image at <a href={url} target='_blank'>{url}</a> cannot be displayed. If it's from Canvas, sign in to Canvas first and refresh the editor. If the image still doesn't load, try signing out and back in to refresh the Canvas session. Canvas image URL should follow this format: <code>https://excelsior.instructure.com/courses/[<em>course_id</em>]/files/[<em>image_id</em>]/preview</code>.</p></div>
                    </div>
                ) : (
                    <div className="excelsior-image-url-insert">
                        <TextControl
                            label="Image URL"
                            value={tempUrl}
                            onChange={(newUrl) => setTempUrl(newUrl)}
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom />
                        <Spacer />
                        <Button onClick={onInsertUrl} variant="primary" __next40pxDefaultSize>Insert</Button>
                    </div>
                ) }
            </div>
            
        ) }
        </>

    );
}