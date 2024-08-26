import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { BaseControl, PanelBody, Button, TextControl, ToggleControl } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit ( { attributes, setAttributes, context } ) {

    const { url, alignment, alignmentSize, caption, altText, mobileResponsive } = attributes;
    const alignmentEnabled = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/alignmentEnabled'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/alignmentEnabled'] : false;
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

    if ( alignmentEnabled && alignment.length <= 0 ) {
        setAttributes( {alignment: "float-start me-3 mb-1"} );
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

                { alignmentEnabled ? (
                    <>
                    <ToggleGroupControl
                        label="Align"
                        help="Align image to the left of right and allows texts to be wrapped."
                        value={alignment}
                        onChange={(value) => setAttributes({ alignment: value, mobileResponsive: false })}
                        isBlock
                        >
                        <ToggleGroupControlOption value="float-start me-3 mb-1" label="Left" />
                        <ToggleGroupControlOption value="float-end ms-3 mb-1" label="Right" />
                    </ToggleGroupControl>

                    <ToggleGroupControl
                        label="Image Size"
                        help="An image won't scale beyond its original size. For instance, a 200-pixel-wide image won't exceed 200 pixels, even at 50% scale."
                        value={alignmentSize}
                        onChange={(value) => setAttributes({ alignmentSize: value })}
                        isBlock
                        >
                        <ToggleGroupControlOption value="" label="Actual" />
                        <ToggleGroupControlOption value="w-25" label="25%" />
                        <ToggleGroupControlOption value="w-50" label="50%" />
                    </ToggleGroupControl>
                    </>

                ) : (

                    <ToggleControl
                        label="Mobile Responsive"
                        help="Scale image to size of the container width. Responsive image will never scale bigger than its actual size."
                        checked={mobileResponsive}
                        onChange={(value) => setAttributes({ mobileResponsive: value })}
                    />

                )}
                
            </PanelBody>
        </InspectorControls>
        { url && !hasError ? 
        
            altText.length || caption.length ? (

                <figure {...useBlockProps({className: `figure${ alignmentEnabled ? " " + alignment + " " + alignmentSize : ""}`})}>
                    <img className={`figure-img${ mobileResponsive ? " img-fluid" : "" }`} src={url} alt={altText || ''} onError={handleImageError} />
                    { caption && <figcaption className='figure-caption'>{caption}</figcaption> }
                </figure>

            ) : (

                <img {...useBlockProps( {className: `${mobileResponsive ? "img-fluid" : ""}${ alignmentEnabled ? " " + alignment + " " + alignmentSize : ""}`} )} src={url} alt="" role="presentation" onError={handleImageError} />

            ) 
        
        : (

            <div {...useBlockProps({className: `${ alignmentEnabled ? alignment : ""}`})}>
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