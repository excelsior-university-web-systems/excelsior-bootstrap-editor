import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { BaseControl, PanelBody, Button, TextControl, TextareaControl, ToggleControl, Notice, 
    __experimentalSpacer as Spacer,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption, } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';
import { ALT_TEXT_LIMIT, CAPTION_LIMIT, getCharacterCount, getCharacterLimitLabel, CharacterLimitFeedback, isValidUrl } from '../../commons';

export default function Edit ( { attributes, setAttributes, context } ) {

    const { url, alignmentEnabled, alignment, alignmentSize, centerAlignment, caption, altText, sourceUrl, mobileResponsive, useDiv, enlargeable } = attributes;
    const inAlignmentEnabledEl = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/alignmentEnabled'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/alignmentEnabled'] : false;
    const inBlockqoute = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/inBlockqoute'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/inBlockqoute'] : false;
    const inCarousel = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/inCarousel'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/inCarousel'] : false;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const [tempUrl, setTempUrl] = useState('');
    const [tempAltText, setTempAltText] = useState('');
    const [tempCaption, setTempCaption] = useState('');
    const [tempSourceUrl, setTempSourceUrl] = useState('');
    const [hasError, setHasError] = useState(false);

    const onInsertUrl = () => {
        if ( tempUrl ) {
            setAttributes({ url: tempUrl.trim(), altText: tempAltText.trim(), caption: tempCaption.trim(), sourceUrl: tempSourceUrl.trim() });
        }
    };

    const handleImageError = () => {
        setHasError(true); 
    };

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    if ( inAlignmentEnabledEl ) {
        setAttributes( {alignmentEnabled: true} );
        setAttributes( {mobileResponsive: false} );
    } else {
        setAttributes( {alignmentEnabled: false} );
    }

    if ( inBlockqoute || inCarousel ) {
        setAttributes( {useDiv: true} );
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
                <BaseControl __nextHasNoMarginBottom>
                    <TextareaControl
                        label='Image Alt Text'
                        help={getCharacterLimitLabel( altText, ALT_TEXT_LIMIT )}
                        placeholder="Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration."
                        value={altText}
                        onChange={(value) => {
                            setAttributes( { altText: value } );
                            setHasError( false );
                        } }
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
                    <CharacterLimitFeedback value={altText} limit={ALT_TEXT_LIMIT} message="Keep it under 150 characters so screen reader users get a concise description without unnecessary detail." showCount={false} />
                    
                    { (!inBlockqoute && !inCarousel) && (
                        <>
                        <TextareaControl
                            label='Image Caption'
                            help={getCharacterLimitLabel( caption, CAPTION_LIMIT )}
                            placeholder="Displays a caption or description for the entire image. Can be left blank if not needed."
                            value={caption}
                            onChange={(value) => {
                                setAttributes( { caption: value } );
                            } }
                            __nextHasNoMarginBottom
                            __next40pxDefaultSize
                        />
                        <CharacterLimitFeedback value={caption} limit={CAPTION_LIMIT} message="Keep it under 250 characters so the caption stays easy to scan and does not overwhelm the image." showCount={false} />
                        <TextControl
                            label = 'Source URL'
                            help = 'Enter the URL where the image was originally published or sourced. Include http:// or https://.'
                            value={sourceUrl}
                            onChange={(value) => {
                                setAttributes( { sourceUrl: value } );
                            }}
                            __nextHasNoMarginBottom
                            __next40pxDefaultSize
                        />
                        { !!sourceUrl && !isValidUrl(sourceUrl) && 
                            <Notice status="error" isDismissible={false}>
                                The source URL does not appear to be a valid URL.
                            </Notice>
                        }
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
        
            altText.length || caption.length || sourceUrl.length || enlargeable ? (

                 useDiv ? (
                    <div {...useBlockProps({className: `figure ${!useDiv ? 'mb-3' : ''} ${centerAlignment ? 'center-aligned' : ''} ${ alignmentEnabled ? alignment + ' ' + alignmentSize : ''} ${ enlargeable ? 'enlargeable' : '' }`})}>
                        <img className={`figure-img ${ mobileResponsive ? 'img-fluid' : '' }`} src={url} alt={altText || ''} onError={handleImageError} />
                    </div>
                ) : (
                    <figure {...useBlockProps({className: `figure ${!useDiv ? 'mb-3' : ''} ${centerAlignment ? 'center-aligned' : ''} ${ alignmentEnabled ? alignment + ' ' + alignmentSize : ''} ${enlargeable ? 'enlargeable' : ''}`})}>
                        <img className={`figure-img ${ mobileResponsive ? 'img-fluid' : '' }`} src={url} alt={altText || ''} onError={handleImageError} />
                        { ( caption || sourceUrl ) && <figcaption className='figure-caption'>
                            {caption && <p>{caption}</p>}
                            {sourceUrl && <p>Source: <cite>
                                 {isValidUrl(sourceUrl) ? (
                                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                                    {sourceUrl}
                                    </a>
                                ) : (
                                    sourceUrl
                                )}    
                            </cite></p>}
                        </figcaption> }
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
                        <TextareaControl label="Image Alt Text" value={tempAltText} onChange={(newAltText) => setTempAltText(newAltText)} placeholder='Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration.' __next40pxDefaultSize __nextHasNoMarginBottom />
                        <CharacterLimitFeedback value={tempAltText} limit={ALT_TEXT_LIMIT} message="Keep it under 150 characters so screen reader users get a concise description without unnecessary detail." />
                        <Spacer />
                        { (!inBlockqoute && !inCarousel) && (
                            <>
                            <TextareaControl label="Image Caption" value={tempCaption} onChange={(newCaption) => setTempCaption(newCaption)} placeholder='Displays a caption or description for the entire image. Can be left blank if not needed.' __next40pxDefaultSize __nextHasNoMarginBottom />
                            <CharacterLimitFeedback value={tempCaption} limit={CAPTION_LIMIT} message="Keep it under 250 characters so the caption stays easy to scan and does not overwhelm the image." />
                            <TextControl
                                label = 'Source URL'
                                help = 'Enter the URL where the image was originally published or sourced. Include http:// or https://.'
                                value={tempSourceUrl}
                                onChange={(newSourceUrl) => setTempSourceUrl(newSourceUrl)}
                                __nextHasNoMarginBottom
                                __next40pxDefaultSize
                            />
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
