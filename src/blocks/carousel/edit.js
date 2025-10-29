import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { generateHtmlId, getBlocksOfType } from '../../commons';

export default function Edit({ attributes, setAttributes, clientId }) {

    const { cover, uniqueId, animation } = attributes;

    const blockProps = useBlockProps({
        className: '',
    });

    // Fetch all blocks of the specific type
    const sameTypeBlocks = useSelect((select) => {
        const allBlocks = select('core/block-editor').getBlocks();
        return getBlocksOfType(allBlocks, 'excelsior-bootstrap-editor/carousel');
    }, []);

    const childSlides = useSelect(
        (select) => {
            const { getBlocks } = select('core/block-editor');
            return getBlocks(clientId) || [];
        },
        [ clientId ]
    );

    // Initialize slides if not present
    useEffect(() => {
        if (!attributes.slides) {
            setAttributes({ slides: [] });
        }
    }, []);

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
        <div {...blockProps} id={uniqueId} role="region" aria-roledescription="carousel">
            {/* <div className="carousel-indicators">
                {childSlides.map((_slide, index) => (
                    <a 
                        href={`#${uniqueId}`}
                        role="button"
                        data-bs-target={`#${uniqueId || ''}`}
                        data-bs-slide-to={index}
                        className={`${index === 0 ? 'active' : ''}`}
                        aria-current={`${index === 0 ? 'true' : ''}`}>
                        <span className="visually-hidden">Slide {index + 1}</span>
                    </a>
                ))}
            </div> */}

            <div>
                <InnerBlocks
                    allowedBlocks={['excelsior-bootstrap-editor/carousel-slide']}
                    template={[['excelsior-bootstrap-editor/carousel-slide']]}
                    templateLock={false}
                />
            </div>
            {/* <a href={`#${uniqueId}`} className="carousel-control-prev" role="button" data-bs-target={`#${uniqueId}`}
                data-bs-slide="prev" aria-label="Previous slide">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous Slide</span>
            </a>
            <a href={`#${uniqueId}`} className="carousel-control-next" role="button" data-bs-target={`#${uniqueId}`}
                data-bs-slide="next" aria-label="Next slide">
                <span className="carousel-control-next-icon" aria-hidden="true">&nbsp;</span>
                <span className="visually-hidden">Next Slide</span>
            </a> */}
        </div>
        </>
    );
}
