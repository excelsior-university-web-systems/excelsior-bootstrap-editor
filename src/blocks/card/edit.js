import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { addFilter } from '@wordpress/hooks';
import { useState } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';

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

export default function Edit( {attributes, setAttributes} ) {
   
    const TEMPLATE = [
        ['core/heading', { placeholder: "Card Title", level: 4, className: "h5 card-title" }],
        ['core/paragraph', { placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }]
    ];
    const { imgUrl, imgAltText, useImg } = attributes;
    const [tempUrl, setTempUrl] = useState('');
    const [tempAltTxt, setTempAltTxt] = useState('');
    const [hasError, setHasError] = useState(false);
    const blockProps = useBlockProps( {
        className: 'col'
    } );

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
                    />
                    <TextControl
                        label="Image Alt Text"
                        help="Replace the alt text for the image. Leave it blank if image is for decoration."
                        value={imgAltText}
                        onChange={(value) => {
                            setAttributes( { imgAltText: value } );
                            setHasError( false );
                        } }
                    />
                    </>
                ) : '' }
                
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <div class="card h-100">
                { useImg ? (
                    imgUrl && !hasError ? (

                        <img class="card-img-top" src={imgUrl} alt={imgAltText} onError={handleImageError} role={imgAltText.length ? undefined : 'presentation' } />
        
                        ) : (
        
                        <div>
                            { hasError ? (
                                <div className="excelsior-image-error">
                                    <div className="alert alert-warning my-0"><p className='my-0'><strong>Failed to load image.</strong> The image at <a href={imgUrl} target='_blank'>{imgUrl}</a> cannot be displayed. Please check the URL in Settings. If the image is from a website requiring authentication (like Canvas LMS), sign in first, then reload the editor.</p></div>
                                </div>
                            ) : (
                                <div className="excelsior-image-url-insert">
                                    <TextControl label="Image URL" value={tempUrl} onChange={(newUrl) => setTempUrl(newUrl)} />
                                    <TextControl label="Image Alt Text" value={tempAltTxt} onChange={(newAlt) => setTempAltTxt(newAlt)} />
                                    <Button onClick={onInsertUrl} variant="primary">Insert</Button>
                                    <Button onClick={onNoImg} className="ms-1" variant="secondary">Omit Image</Button>
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
