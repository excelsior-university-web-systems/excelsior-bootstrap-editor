import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { generateHtmlId, getBlocksOfType } from '../../commons';
import metadata from './block.json';

export default function Edit({ attributes, setAttributes, clientId }) {

    const { uniqueId, animation, slides, activeSlide } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';

    const blockProps = useBlockProps({
        className: 'carousel',
        id: uniqueId,
        role: "region",
        "aria-roledescription": "carousel"
    });

    // Fetch all blocks of the specific type
    const sameTypeBlocks = useSelect((select) => {
        const allBlocks = select('core/block-editor').getBlocks();
        return getBlocksOfType(allBlocks, 'excelsior-bootstrap-editor/carousel');
    }, []);
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    // carousel/edit.js
    const childSlideIds = useSelect(
        ( select ) => {
            const { getBlockOrder, getBlockAttributes } = select( 'core/block-editor' );
            const innerBlockIds = getBlockOrder( clientId ) || []; // guard
            return innerBlockIds.map(
                ( id ) => getBlockAttributes( id )?.uniqueId || ''
            );
        },
        [ clientId ]
    );


    // Initialize slides if not present
   useEffect( () => {
        if ( isPreview ) {
            return;
        }

        if ( ! Array.isArray( slides ) ) {
            setAttributes( { slides: [] } );
        }
    }, [ isPreview, slides ] );

    useEffect( () => {
        if ( isPreview ) {
            return;
        }

        const nextSlides = childSlideIds.map( ( id ) => ( { uniqueId: id } ) );
        const nextActiveSlide = childSlideIds[0] || '';

        if (
            JSON.stringify( slides ) !== JSON.stringify( nextSlides ) ||
            activeSlide !== nextActiveSlide
        ) {
            setAttributes( {
                slides: nextSlides,
                activeSlide: nextActiveSlide
            } );
        }
    }, [ isPreview, childSlideIds, slides, activeSlide ] );

    useEffect( () => {
        if ( isPreview ) {
            return;
        }

        // Check if uniqueId already exists in other blocks of the same type
        const isDuplicate = sameTypeBlocks.some(
            ( block ) => block.clientId !== clientId && block.attributes.uniqueId === uniqueId
        );
        
        // If duplicate found or no uniqueId, generate a new one
        if ( !uniqueId || isDuplicate ) {
            setAttributes( { uniqueId: generateHtmlId() } );
        }
    }, [ isPreview, sameTypeBlocks, clientId, uniqueId ] );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title='Settings'>
                <SelectControl
                    label="Animation Style"
                    value={animation}
                    options={[
                        { label: 'Slide', value: 'slide' },
                        { label: 'Crossfade', value: 'carousel-fade' }
                    ]}
                    onChange={(value) => setAttributes({ animation: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps} >
            <div className="carousel-inner" aria-live="polite">
                <InnerBlocks
                    allowedBlocks={['excelsior-bootstrap-editor/carousel-slide']}
                    template={[['excelsior-bootstrap-editor/carousel-slide']]}
                    templateLock={false}
                />
            </div>
        </div>
        </>
    );
}
