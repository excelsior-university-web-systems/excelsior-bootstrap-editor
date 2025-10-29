import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { BaseControl, PanelBody, Button, TextControl, ToggleControl, __experimentalSpacer as Spacer } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit ( { attributes, setAttributes, context } ) {

    const { url, alignmentEnabled, alignment, alignmentSize, centerAlignment, caption, altText, mobileResponsive, cover, useDiv, enlargeable } = attributes;
    const inAlignmentEnabledEl = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/alignmentEnabled'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/alignmentEnabled'] : false;
    const inBlockqoute = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/inBlockqoute'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/inBlockqoute'] : false;
    const inCarousel = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/inCarousel'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/inCarousel'] : false;
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

    if ( inAlignmentEnabledEl ) {
        setAttributes( {alignmentEnabled: true} );
    } else {
        setAttributes( {alignmentEnabled: false} );
    }

    if ( inBlockqoute ) {
        setAttributes( {useDiv: true} );
    }

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
                        setAttributes( { url: value.trim() } );
                        setHasError( false );
                    } }
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
                <BaseControl help={ ( !inBlockqoute && !inCarousel ) ? "Alt text describes the image for those who cannot see it, while the caption adds context. Together, they enhance accessibility and provide complete information about the image." : ""}
                 __nextHasNoMarginBottom>
                    <TextControl
                        label="Image Alt Text"
                        help="Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration."
                        value={altText}
                        onChange={(value) => {
                            setAttributes( { altText: value } );
                            setHasError( false );
                        } }
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
                    { (!inBlockqoute && !inCarousel) && (
                        <>
                        <TextControl
                            label="Image Caption"
                            help="Displays a caption or description for the entire image. Can be left blank if not needed."
                            value={caption}
                            onChange={(value) => {
                                setAttributes( { caption: value } );
                            } }
                            __nextHasNoMarginBottom
                            __next40pxDefaultSize
                        />
                        </>
                    )}

                </BaseControl>

                { inAlignmentEnabledEl && (
                    <>
                    <ToggleGroupControl
                        label="Align"
                        help="Align image to the left of right and allows texts to be wrapped."
                        value={alignment}
                        onChange={(value) => setAttributes({ alignment: value, mobileResponsive: false })}
                        isBlock
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                        >
                        <ToggleGroupControlOption value="float-start me-3" label="Left" />
                        <ToggleGroupControlOption value="float-end ms-3" label="Right" />
                    </ToggleGroupControl>
                    <ToggleGroupControl
                        label="Image Size"
                        help="An image won't scale beyond its original size. For instance, a 200-pixel-wide image won't exceed 200 pixels, even at 50% scale."
                        value={alignmentSize}
                        onChange={(value) => setAttributes({ alignmentSize: value })}
                        isBlock
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                        >
                        <ToggleGroupControlOption value="img-fluid" label="Actual" />
                        <ToggleGroupControlOption value="w-25" label="25%" />
                        <ToggleGroupControlOption value="w-50" label="50%" />
                    </ToggleGroupControl>
                    </>

                )}
                { (!inBlockqoute && !inCarousel && !inAlignmentEnabledEl) && (
                    <>
                    <ToggleControl
                    label="Center Align"
                    help="Horizontally center align the image."
                    checked={centerAlignment}
                    onChange={(value) => setAttributes({ centerAlignment: value })}
                    __nextHasNoMarginBottom
                    />
                    <ToggleControl
                        label="Mobile Responsive"
                        help="Scale image to size of the container width. Responsive image will never scale bigger than its actual size."
                        checked={mobileResponsive}
                        onChange={(value) => setAttributes({ mobileResponsive: value })}
                        __nextHasNoMarginBottom
                    />
                    </>

                )}
                <ToggleControl
                    label="Enlargeable"
                    help="Enable a button to expand the image to its actual width, scaling down if it exceeds the browser width."
                    checked={enlargeable}
                    onChange={(value) => setAttributes({ enlargeable: value })}
                    __nextHasNoMarginBottom
                />
                
            </PanelBody>
        </InspectorControls>
        { url && !hasError ? 
        
            altText.length || caption.length || enlargeable ? (

                 useDiv ? (
                    <div {...useBlockProps({className: `figure ${!useDiv ? 'mb-3' : ''} ${centerAlignment ? 'center-aligned' : ''} ${ alignmentEnabled ? alignment + ' ' + alignmentSize : ''} ${ enlargeable ? 'enlargeable' : '' }`})}>
                        <img className={`figure-img ${ mobileResponsive ? 'img-fluid' : '' }`} src={url} alt={altText || ''} onError={handleImageError} />
                    </div>
                ) : (
                    <figure {...useBlockProps({className: `figure ${!useDiv ? 'mb-3' : ''} ${centerAlignment ? 'center-aligned' : ''} ${ alignmentEnabled ? alignment + ' ' + alignmentSize : ''} ${enlargeable ? 'enlargeable' : ''}`})}>
                        <img className={`figure-img ${ mobileResponsive ? 'img-fluid' : '' }`} src={url} alt={altText || ''} onError={handleImageError} />
                        { caption && <figcaption className='figure-caption'>{caption}</figcaption> }
                    </figure>
                )

            ) : (

                <img {...useBlockProps( {className: `${!useDiv ? 'mb-3' : ''} ${mobileResponsive ? 'img-fluid' : ''} ${centerAlignment ? 'center-aligned' : ''} ${ alignmentEnabled ? alignment + ' ' + alignmentSize : ''}`} )} src={url} alt="" role="presentation" onError={handleImageError} />

            ) 
        
        : (

            <div {...useBlockProps({className: `${ alignmentEnabled ? alignment : ""}`})}>
                { hasError ? (
                    <div className="excelsior-image-error">
                        <div className="alert alert-warning my-0">
                            <p className='my-0'><strong>Failed to load image.</strong> The image at <a href={url} target='_blank'>{url}</a> cannot be displayed. If it's from Canvas, sign in to Canvas first and refresh the editor. If the image still doesn't load, try signing out and back in to refresh the Canvas session. Canvas image URL should follow this format: <code>https://excelsior.instructure.com/courses/[<em>course_id</em>]/files/[<em>image_id</em>]/preview</code>.</p>
                        </div>
                    </div>
                ) : (
                    <div className="excelsior-image-url-insert mb-3">
                        <TextControl label="Image URL" value={tempUrl} onChange={(newUrl) => setTempUrl(newUrl)} __next40pxDefaultSize __nextHasNoMarginBottom />
                        <Spacer />
                        <TextControl label="Image Alt Text" value={tempAltText} onChange={(newAltText) => setTempAltText(newAltText)} placeholder='Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration.' __next40pxDefaultSize __nextHasNoMarginBottom />
                        <Spacer />
                        { (!inBlockqoute && !inCarousel) && (
                            <>
                            <TextControl label="Image Caption" value={tempCaption} onChange={(newCaption) => setTempCaption(newCaption)} placeholder='Displays a caption or description for the entire image. Can be left blank if not needed.' __next40pxDefaultSize __nextHasNoMarginBottom />
                            </>
                        )}
                        { (!inAlignmentEnabledEl && !inBlockqoute && !inCarousel) && (
                            <>
                            <Spacer />
                            <ToggleControl
                                label="Mobile Responsive"
                                checked={mobileResponsive}
                                onChange={(value) => setAttributes({ mobileResponsive: value })}
                                __nextHasNoMarginBottom
                            />
                            </>
                        ) }
                        <Spacer />
                        <ToggleControl
                            label="Enlargeable"
                            checked={enlargeable}
                            onChange={(value) => setAttributes({ enlargeable: value })}
                            __nextHasNoMarginBottom
                        />
                        <Spacer />
                        <Button onClick={onInsertUrl} variant="primary" __next40pxDefaultSize __nextHasNoMarginBottom>Insert</Button>
                    </div>
                ) }
            </div>
            
        ) }
        </>

    );
}