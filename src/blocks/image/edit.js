import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { BaseControl, PanelBody, Button, TextControl, TextareaControl, ToggleControl, Notice,
    __experimentalSpacer as Spacer,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption, } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';
import { ALT_TEXT_LIMIT, CAPTION_LIMIT, getCharacterLimitLabel, CharacterLimitFeedback, isValidUrl } from '../../commons';

const ALT_TEXT_PLACEHOLDER = 'Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration.';
const ALT_TEXT_LIMIT_MESSAGE = 'Keep it under 150 characters so screen reader users get a concise description without unnecessary detail.';
const CAPTION_PLACEHOLDER = 'Displays a caption or description for the entire image. Can be left blank if not needed.';
const CAPTION_LIMIT_MESSAGE = 'Keep it under 250 characters so the caption stays easy to scan and does not overwhelm the image.';
const SOURCE_URL_HELP = 'Enter the URL where the image was originally published or sourced. Include http:// or https://.';

export default function Edit ( { attributes, setAttributes, context, clientId } ) {

    const { url, alignmentEnabled, alignment, alignmentSize, centerAlignment, repositioned, order, caption, altText, sourceUrl, mobileResponsive, useDiv, enlargeable } = attributes;
    const inAlignmentEnabledEl = !!context?.[ `${ XCLSR_BTSTRP_EDITOR_PREFIX }/alignmentEnabled` ];
    const inBlockqoute = !!context?.[ `${ XCLSR_BTSTRP_EDITOR_PREFIX }/inBlockqoute` ];
    const inCarousel = !!context?.[ `${ XCLSR_BTSTRP_EDITOR_PREFIX }/inCarousel` ];
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

    const parentClientId = useSelect( ( select ) => {
        if ( inAlignmentEnabledEl ) {
            return select( 'core/block-editor' ).getBlockRootClientId( clientId );
        }
        return false;
    }, [clientId] );

    const { updateBlockAttributes } = useDispatch ( 'core/block-editor' );

    const sendDataToParent = ( newValue ) => {
        if ( inAlignmentEnabledEl && parentClientId ) {
            console.log(parentClientId);
            updateBlockAttributes( parentClientId, {repositioned: newValue} );
        }
    };

    const handleRepositioned = ( value ) => {
        setAttributes( { repositioned: value } );
        sendDataToParent( value );
    };

    // A floated image sizes itself through the alignment classes, so mobile
    // responsiveness is cleared alongside enabling alignment.
    useEffect(() => {
        if ( inAlignmentEnabledEl ) {
            if ( !alignmentEnabled || mobileResponsive ) {
                setAttributes( { alignmentEnabled: true, mobileResponsive: false } );
            }
        } else if ( alignmentEnabled ) {
            setAttributes( { alignmentEnabled: false } );
        }
    }, [inAlignmentEnabledEl, alignmentEnabled, mobileResponsive, setAttributes]);

    useEffect(() => {
        if ( ( inBlockqoute || inCarousel ) && !useDiv ) {
            setAttributes( { useDiv: true } );
        }
    }, [inBlockqoute, inCarousel, useDiv, setAttributes]);

    const onInsertUrl = () => {
        if ( tempUrl ) {
            setAttributes({ url: tempUrl.trim(), altText: tempAltText.trim(), caption: tempCaption.trim(), sourceUrl: tempSourceUrl.trim() });
        }
    };

    const handleImageError = () => setHasError(true);

    const showImage = !!url && !hasError;
    const hasFigureContent = !!( altText || caption || sourceUrl || enlargeable );

    const alignmentClass = alignmentEnabled && alignment && alignmentSize ? `${alignment} ${alignmentSize}` : '';
    const orderClass = alignmentEnabled && repositioned ? `order-${order}` : '';
    const fluidClass = mobileResponsive ? 'img-fluid' : '';
    const baseClasses = [ !useDiv && 'mb-3', alignmentClass, orderClass, centerAlignment && 'center-aligned' ].filter( Boolean ).join( ' ' );
    const figureClasses = [ 'figure', baseClasses, enlargeable && 'enlargeable' ].filter( Boolean ).join( ' ' );
    const imgClasses = [ 'figure-img', fluidClass ].filter( Boolean ).join( ' ' );
    const bareImgClasses = [ fluidClass, baseClasses ].filter( Boolean ).join( ' ' );

    // The wrapper element differs per branch, so its classes are resolved before
    // useBlockProps to keep the hook out of the conditional markup below.
    const wrapperClasses = showImage
        ? ( hasFigureContent ? figureClasses : bareImgClasses )
        : ( alignmentEnabled ? alignment : '' );
    const blockProps = useBlockProps( { className: wrapperClasses } );

    // Kept below the hooks above so they are never skipped by this early return.
    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
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
                        placeholder={ALT_TEXT_PLACEHOLDER}
                        value={altText}
                        onChange={(value) => {
                            setAttributes( { altText: value } );
                            setHasError( false );
                        } }
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
                    <CharacterLimitFeedback value={altText} limit={ALT_TEXT_LIMIT} message={ALT_TEXT_LIMIT_MESSAGE} showCount={false} />

                    { (!inBlockqoute && !inCarousel) && (
                        <>
                        <TextareaControl
                            label='Image Caption'
                            help={getCharacterLimitLabel( caption, CAPTION_LIMIT )}
                            placeholder={CAPTION_PLACEHOLDER}
                            value={caption}
                            onChange={(value) => setAttributes( { caption: value } )}
                            __nextHasNoMarginBottom
                            __next40pxDefaultSize
                        />
                        <CharacterLimitFeedback value={caption} limit={CAPTION_LIMIT} message={CAPTION_LIMIT_MESSAGE} showCount={false} />
                        <TextControl
                            label='Source URL'
                            help={SOURCE_URL_HELP}
                            value={sourceUrl}
                            onChange={(value) => setAttributes( { sourceUrl: value } )}
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
                    <ToggleControl
                        label="Reposition Image"
                        help="Position the floated image first or last on devices with narrow screens."
                        checked={repositioned}
                        onChange={(value) => handleRepositioned(value)}
                        __nextHasNoMarginBottom
                    />
                    { repositioned && (
                        <ToggleGroupControl
                            label="Order"
                            value={order}
                            onChange={(value) => setAttributes({ order: value })}
                            isBlock
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                        >
                            <ToggleGroupControlOption value="first" label="First" />
                            <ToggleGroupControlOption value="last" label="Last" />
                        </ToggleGroupControl>
                    ) }
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
        { showImage ?

            hasFigureContent ? (

                 useDiv ? (
                    <div {...blockProps}>
                        <img className={imgClasses} src={url} alt={altText || ''} onError={handleImageError} />
                    </div>
                ) : (
                    <figure {...blockProps}>
                        <img className={imgClasses} src={url} alt={altText || ''} onError={handleImageError} />
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

                <img {...blockProps} src={url} alt="" role="presentation" onError={handleImageError} />

            )

        : (

            <div {...blockProps}>
                { hasError ? (
                    <div className="excelsior-image-error">
                        <div className="alert alert-warning my-0">
                            <p className='my-0'><strong>Failed to load image.</strong> The image at <a href={url} target='_blank' rel='noopener noreferrer'>{url}</a> cannot be displayed. If it's from Canvas, sign in to Canvas first and refresh the editor. If the image still doesn't load, try signing out and back in to refresh the Canvas session. Canvas image URL should follow this format: <code>https://excelsior.instructure.com/courses/[<em>course_id</em>]/files/[<em>image_id</em>]/preview</code>.</p>
                        </div>
                    </div>
                ) : (
                    <div className="excelsior-image-url-insert mb-3">
                        <TextControl label="Image URL" value={tempUrl} onChange={setTempUrl} __next40pxDefaultSize __nextHasNoMarginBottom />
                        <Spacer />
                        <TextareaControl label="Image Alt Text" value={tempAltText} onChange={setTempAltText} placeholder={ALT_TEXT_PLACEHOLDER} __next40pxDefaultSize __nextHasNoMarginBottom />
                        <CharacterLimitFeedback value={tempAltText} limit={ALT_TEXT_LIMIT} message={ALT_TEXT_LIMIT_MESSAGE} />
                        <Spacer />
                        { (!inBlockqoute && !inCarousel) && (
                            <>
                            <TextareaControl label="Image Caption" value={tempCaption} onChange={setTempCaption} placeholder={CAPTION_PLACEHOLDER} __next40pxDefaultSize __nextHasNoMarginBottom />
                            <CharacterLimitFeedback value={tempCaption} limit={CAPTION_LIMIT} message={CAPTION_LIMIT_MESSAGE} />
                            <TextControl
                                label='Source URL'
                                help={SOURCE_URL_HELP}
                                value={tempSourceUrl}
                                onChange={setTempSourceUrl}
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
