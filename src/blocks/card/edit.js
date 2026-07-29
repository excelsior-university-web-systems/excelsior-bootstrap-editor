import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, TextareaControl, ToggleControl, __experimentalSpacer as Spacer } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { addFilter } from '@wordpress/hooks';
import { useState, useEffect } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { ALT_TEXT_LIMIT, CAPTION_LIMIT, getCharacterCount, getCharacterLimitLabel, CharacterLimitFeedback } from '../../commons';

const withCustomClasses = createHigherOrderComponent((BlockEdit) => {
    return (props) => {

        const { name, clientId, attributes, setAttributes } = props;
        const { className = '' } = attributes;

        if (name !== 'core/paragraph') {
            return <BlockEdit {...props} />;
        }
        
        const parentBlockId = wp.data.select('core/block-editor').getBlockParents(clientId).slice(-1)[0];
        const parentBlockName = parentBlockId ? wp.data.select('core/block-editor').getBlockName(parentBlockId) : null;

        if (parentBlockName === 'excelsior-bootstrap-editor/card' && !className.includes('card-text')) {
            setAttributes({
                className: `${className ? className + ' ' : ''}card-text`,
            });
        }

        return <BlockEdit {...props} />;
    };
}, 'withCustomClasses');

addFilter(
    'editor.BlockEdit',
    'excelsior-bootstrap-editor/with-custom-classes',
    withCustomClasses
);

export default function Edit( {attributes, setAttributes, context} ) {
   
    const TEMPLATE = [
        ['core/heading', { placeholder: "Card Title", level: 4, headingSizeClass: "h5", className: "card-title" }],
        ['core/paragraph', { placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }]
    ];
    const { imgUrl, imgAltText, useImg, enlargeable, bgColor, aspectRatio } = attributes;
    const [tempUrl, setTempUrl] = useState('');
    const [tempAltTxt, setTempAltTxt] = useState('');
    const [hasError, setHasError] = useState(false);

    const cardBgColor = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/cardBgColor'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/cardBgColor'] : '';
    const cardAspectRatio = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/cardAspectRatio'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/cardAspectRatio'] : '16x9';

    const blockProps = useBlockProps( {
        className: 'col'
    } );

    useEffect(() => {
        if (cardBgColor && cardBgColor.length > 0) {
            if (bgColor !== cardBgColor) {
                setAttributes({ bgColor: cardBgColor });
            }
        } else if (bgColor !== '') {
            setAttributes({ bgColor: '' });
        }
    }, [cardBgColor, bgColor]);

    useEffect(() => {
        if (cardAspectRatio) {
            if (aspectRatio !== cardAspectRatio) {
                setAttributes({ aspectRatio: cardAspectRatio });
            }
        }
    }, [cardAspectRatio, aspectRatio]);

    const onInsertUrl = () => {
        if ( tempUrl ) {
            setAttributes({ imgUrl: tempUrl.trim(), imgAltText: tempAltTxt.trim() });
        }
    };

    const onNoImg = () => {
        setAttributes({ imgUrl: '', imgAltText: '', useImg: false });
    };

    const handleImageError = () => {
        setHasError(true); 
    };

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <ToggleControl
                    label="Include a Top Image"
                    help="Toggle on to include an image on top. Toggle off will remove the image."
                    checked={useImg}
                    onChange={(value) => setAttributes({ imgUrl: '', imgAltText: '', useImg: value })}
                    __nextHasNoMarginBottom
                />
                { useImg ? (
                    <>
                    <TextControl
                        label="Image URL"
                        help="Replace the image URL to update the image."
                        value={imgUrl}
                        onChange={(value) => {
                            setAttributes( { imgUrl: value } );
                            setHasError( false );
                        } }
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
                    <TextareaControl
                        label="Image Alt Text"
                        help={getCharacterLimitLabel( imgAltText, ALT_TEXT_LIMIT )}
                        placeholder="Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration."
                        value={imgAltText}
                        onChange={(value) => {
                            setAttributes( { imgAltText: value } );
                            setHasError( false );
                        } }
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
                    <CharacterLimitFeedback value={imgAltText} limit={ALT_TEXT_LIMIT} message="Keep it under 150 characters so screen reader users get a concise description without unnecessary detail." showCount={false} />
                    <ToggleControl
                        label="Enlargeable"
                        help="Enable a button to expand the image to its actual width, scaling down if it exceeds the browser width."
                        checked={enlargeable}
                        disabled={!imgUrl}
                        onChange={(value) => setAttributes({ enlargeable: value })}
                        __nextHasNoMarginBottom
                    />
                    </>
                ) : '' }
                
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <div class={`card h-100 ${bgColor ? bgColor : ''}`}>
                { useImg ? (
                    imgUrl && !hasError ? (

                        <>
                        { enlargeable ? (
                            <div className="figure w-full enlargeable mb-0">
                                <div className={`ratio ratio-${aspectRatio}`}>
                                    <img className="card-img-top object-fit-cover" src={imgUrl} alt={imgAltText} onError={handleImageError} />
                                </div>
                            </div>
                        ) : (
                            <div className={`ratio ratio-${aspectRatio}`}>
                                <img className="card-img-top object-fit-cover" src={imgUrl} alt={imgAltText} onError={handleImageError} />
                            </div>
                            
                        )}
                        </>
                        
                        ) : (
        
                        <div>
                            { hasError ? (
                                <div className="excelsior-image-error">
                                    <div className="alert alert-warning my-0"><p className='my-0'><strong>Failed to load image.</strong> The image at <a href={imgUrl} target='_blank'>{imgUrl}</a> cannot be displayed. If it's from Canvas, sign in to Canvas first and refresh the editor. If the image still doesn't load, try signing out and back in to refresh the Canvas session. Canvas image URL should follow this format: <code>https://excelsior.instructure.com/courses/[<em>course_id</em>]/files/[<em>image_id</em>]/preview</code>.</p></div>
                                </div>
                            ) : (
                                <div className="excelsior-image-url-insert">
                                    <TextControl label="Image URL" value={tempUrl} onChange={(newUrl) => setTempUrl(newUrl)} __next40pxDefaultSize __nextHasNoMarginBottom />
                                    <Spacer />
                                    <TextareaControl label="Image Alt Text" placeholder="Provides alternative text for screen readers and users with visual impairments. Leave it blank if image is for decoration." value={tempAltTxt} onChange={(newAlt) => setTempAltTxt(newAlt)} __next40pxDefaultSize __nextHasNoMarginBottom />
                                    <CharacterLimitFeedback value={tempAltTxt} limit={ALT_TEXT_LIMIT} message="Keep it under 150 characters so screen reader users get a concise description without unnecessary detail." />
                                    <Spacer />
                                    <ToggleControl
                                        label="Enlargeable"
                                        checked={enlargeable}
                                        disabled={(tempUrl || '').trim().length === 0}
                                        onChange={(value) => setAttributes({ enlargeable: value })}
                                        __nextHasNoMarginBottom
                                    />
                                    <Spacer />
                                    <Button onClick={onInsertUrl} variant="primary" __next40pxDefaultSize>Insert</Button>
                                    <Button onClick={onNoImg} className="ms-1" variant="secondary" __next40pxDefaultSize>Omit Image</Button>
                                </div>
                            ) }
                        </div>
                        )
                ) : '' }
                <div class="card-body">
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        templateLock={false}
                        renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                    />
                </div>
            </div>
        </div>
        </>
    );
}
