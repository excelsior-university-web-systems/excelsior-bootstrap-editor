import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { generateHtmlId, getBlocksOfType } from '../../commons';

export default function Edit({ attributes, setAttributes, clientId }) {

    const { cover, uniqueId, animation, slides, activeSlide } = attributes;

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

    // carousel/edit.js
    const childSlides = useSelect(
        ( select ) => {
            const { getBlockOrder, getBlockAttributes } = select( 'core/block-editor' );
            const innerBlockIds = getBlockOrder( clientId ) || []; // guard
            return innerBlockIds.map( ( id ) => getBlockAttributes( id ) || { uniqueId: '' } );
        },
        [ clientId ]
    );


    // Initialize slides if not present
   useEffect( () => {
        if ( ! Array.isArray( slides ) ) {
            setAttributes( { slides: [] } );
        }
    }, [] );

    useEffect(() => {
        
        // Compare current childSlides with attributes.slides
        if ( JSON.stringify( childSlides ) !== JSON.stringify( slides ) ) {
            setAttributes({ slides: childSlides });
        }

        // The first tab is always active
        if ( childSlides.length > 0 && ( !activeSlide || activeSlide !== childSlides[0].uniqueId ) ) {
            setAttributes({ activeSlide: childSlides[0].uniqueId });
        }

    }, [childSlides] );

    useEffect( () => {
        // Check if uniqueId already exists in other blocks of the same type
        const isDuplicate = sameTypeBlocks.some(
            ( block ) => block.clientId !== clientId && block.attributes.uniqueId === uniqueId
        );
        
        // If duplicate found or no uniqueId, generate a new one
        if ( !uniqueId || isDuplicate ) {
            setAttributes( { uniqueId: generateHtmlId() } );
        }
    }, [] );

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
