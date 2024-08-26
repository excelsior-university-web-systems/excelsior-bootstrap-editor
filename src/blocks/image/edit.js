import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { BaseControl, PanelBody, Button, TextControl, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit ( { attributes, setAttributes } ) {

    const { url, alignment, caption, altText, mobileResponsive } = attributes;
    const [tempUrl, setTempUrl] = useState('');
    const [tempAltText, setTempAltText] = useState('');
    const [tempCaption, setTempCaption] = useState('');
    const [hasError, setHasError] = useState(false);

    const onInsertUrl = () => {
        if ( tempUrl ) {
            setAttributes({ url: tempUrl.trim(), altText: tempAltText.trim(), caption: tempCaption.trim() });
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
                        setAttributes( { url: value.trim() } );
                        setHasError( false );
                    } }
                />
                <BaseControl help="Alt text describes the image for those who cannot see it, while the caption adds context. Together, they enhance accessibility and provide complete information about the image.">
                    <TextControl
                            label="Image Alt Text"
                            help="Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration."
                            value={altText}
                            onChange={(value) => {
                                setAttributes( { altText: value } );
                                setHasError( false );
                            } }
                        />
                    <TextControl
                        label="Image Caption"
                        help="Displays a caption or description for the entire image. Can be left blank if not needed."
                        value={caption}
                        onChange={(value) => {
                            setAttributes( { caption: value } );
                        } }
                    />
                </BaseControl>

                
                <ToggleControl
                    label="Mobile Responsive"
                    help="Scale image to size of the container width. Responsive image will never scale bigger than its actual size."
                    checked={mobileResponsive}
                    onChange={(value) => setAttributes({ mobileResponsive: value })}
                />
            </PanelBody>
        </InspectorControls>
        { url && !hasError ? 
        
            altText.length || caption.length ? (

                <figure {...useBlockProps({className: "figure"})}>
                    <img className={`figure-img${ mobileResponsive ? " img-fluid" : "" }`} src={url} alt={altText || ''} onError={handleImageError} />
                    { caption && <figcaption className='figure-caption'>{caption}</figcaption> }
                </figure>

            ) : (

                <img {...useBlockProps( {className: mobileResponsive ? "img-fluid" : ""} )} src={url} alt="" role="presentation" onError={handleImageError} />

            ) 
        
        : (

            <div {...useBlockProps()}>
                { hasError ? (
                    <div className="excelsior-image-error">
                        <div className="alert alert-warning my-0"><p className='my-0'><strong>Failed to load image.</strong> The image at <a href={url} target='_blank'>{url}</a> cannot be displayed. Please check the URL in Settings. If the image is from a website requiring authentication (like Canvas LMS), sign in first, then reload the editor.</p></div>
                    </div>
                ) : (
                    <div className="excelsior-image-url-insert">
                        <TextControl label="Image URL" value={tempUrl} onChange={(newUrl) => setTempUrl(newUrl)} />
                        <TextControl label="Image Alt Text" value={tempAltText} onChange={(newAltText) => setTempAltText(newAltText)} placeholder='Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration.' />
                        <TextControl label="Image Caption" value={tempCaption} onChange={(newCaption) => setTempCaption(newCaption)} placeholder='Displays a caption or description for the entire image. Can be left blank if not needed.' />
                        <ToggleControl
                            label="Mobile Responsive"
                            checked={mobileResponsive}
                            onChange={(value) => setAttributes({ mobileResponsive: value })}
                        />
                        <Button onClick={onInsertUrl} variant="primary">Insert</Button>
                    </div>
                ) }
            </div>
            
        ) }
        </>

    );
}