import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, ToggleControl, __experimentalSpacer as Spacer } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { addFilter } from '@wordpress/hooks';
import { useState, useEffect } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

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
    const { imgUrl, imgAltText, useImg, enlargeable, bgColor } = attributes;
    const [tempUrl, setTempUrl] = useState('');
    const [tempAltTxt, setTempAltTxt] = useState('');
    const [hasError, setHasError] = useState(false);

    const cardBgColor = context[XCLSR_BTSTRP_EDITOR_PREFIX+'/cardBgColor'] ? context[XCLSR_BTSTRP_EDITOR_PREFIX+'/cardBgColor'] : '';

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
    }, [cardBgColor, bgColor, setAttributes]);

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
                    <TextControl
                        label="Image Alt Text"
                        help="Replace the alt text for the image. Leave it blank if image is for decoration."
                        value={imgAltText}
                        onChange={(value) => {
                            setAttributes( { imgAltText: value } );
                            setHasError( false );
                        } }
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
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
                            <div class="figure w-full enlargeable mb-0">
                                <img class="card-img-top" src={imgUrl} alt={imgAltText} onError={handleImageError} />
                            </div>
                        ) : (
                            <img class="card-img-top" src={imgUrl} alt={imgAltText} onError={handleImageError} />
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
                                    <TextControl label="Image Alt Text" value={tempAltTxt} onChange={(newAlt) => setTempAltTxt(newAlt)} __next40pxDefaultSize __nextHasNoMarginBottom />
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
