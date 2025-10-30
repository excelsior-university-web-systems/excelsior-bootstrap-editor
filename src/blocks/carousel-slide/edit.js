import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { generateHtmlId, getBlocksOfType } from '../../commons';

const IMAGE_BLOCK   = 'excelsior-bootstrap-editor/image';
const CAPTION_BLOCK = 'excelsior-bootstrap-editor/carousel-caption';

export default function Edit( { attributes, setAttributes, context, clientId } ) {
	const { isActive, uniqueId } = attributes;
	const activeSlide = context?.[ `${ XCLSR_BTSTRP_EDITOR_PREFIX }/activeSlide` ];

	const blockProps = useBlockProps( { className: 'carousel-item' } );

	// Keep only our two block types allowed inside the slide.
	const ALLOWED = [ IMAGE_BLOCK, CAPTION_BLOCK ];

	// Collect all other carousel-slide blocks (for uniqueId generation).
	const sameTypeBlocks = useSelect( ( select ) => {
		const allBlocks = select( 'core/block-editor' ).getBlocks();
		return getBlocksOfType( allBlocks, 'excelsior-bootstrap-editor/carousel-slide' );
	}, [] );

	// Current children of this slide.
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ) || [],
		[ clientId ]
	);

	// Partition children once (stable arrays).
	const { imageBlocks, captionBlocks } = useMemo( () => {
		const imgs = [];
		const caps = [];
		for ( const b of innerBlocks ) {
			if ( b.name === IMAGE_BLOCK ) imgs.push( b );
			else if ( b.name === CAPTION_BLOCK ) caps.push( b );
		}
		return { imageBlocks: imgs, captionBlocks: caps };
	}, [ innerBlocks ] );

	const firstImageId = imageBlocks?.[0]?.clientId || null;

    // Read the current lock from the store so we can bail early if already set
    const firstImageLock = useSelect(
        ( select ) => {
            if ( ! firstImageId ) return null;
            const attrs = select( 'core/block-editor' ).getBlockAttributes( firstImageId ) || {};
            return attrs.lock || null;
        },
        [ firstImageId ]
    );

	const { insertBlocks, removeBlock, updateBlockAttributes } =
		useDispatch( 'core/block-editor' );

	// --- Basic slide state ---
	useEffect( () => {
		setAttributes( { isActive: activeSlide === uniqueId } );
	}, [ activeSlide, uniqueId ] );

	useEffect( () => {
		const isDuplicate = sameTypeBlocks.some(
			( block ) => block.clientId !== clientId && block.attributes.uniqueId === uniqueId
		);

		if ( ! uniqueId || isDuplicate ) {
			setAttributes( { uniqueId: generateHtmlId() } );
		}
	}, [] );

	// --- Enforce exactly one image ---
	// Run once per “shape” change; guard to avoid loops.
	const enforcingRef = useRef( false );

	useEffect( () => {
		if ( enforcingRef.current ) return;
		enforcingRef.current = true;

		// Ensure an image exists.
		if ( imageBlocks.length === 0 ) {
			insertBlocks( createBlock( IMAGE_BLOCK ), 0, clientId );
			enforcingRef.current = false;
			return;
		}

		// If multiple images slipped in (paste), remove extras.
		if ( imageBlocks.length > 1 ) {
			for ( const b of imageBlocks.slice( 1 ) ) {
				removeBlock( b.clientId );
			}
			enforcingRef.current = false;
			return;
		}

		// Cap captions to one (0 or 1 allowed).
		if ( captionBlocks.length > 1 ) {
			for ( const b of captionBlocks.slice( 1 ) ) {
				removeBlock( b.clientId );
			}
			enforcingRef.current = false;
			return;
		}

		enforcingRef.current = false;
	}, [ imageBlocks.length, captionBlocks.length, clientId, insertBlocks, removeBlock ] );

	// --- Lock the single image against removal (after it exists) ---
	useEffect( () => {
        if ( ! firstImageId ) return;

        const isLocked =
            !!firstImageLock &&
            firstImageLock.remove === true &&
            firstImageLock.move === false;

        if ( isLocked ) return;

        updateBlockAttributes( firstImageId, {
            lock: { remove: true, move: false },
        } );
    }, [ firstImageId, firstImageLock, updateBlockAttributes ]);

	// Initial template
	const TEMPLATE = useMemo(
		() => [
			[ IMAGE_BLOCK, { lock: { remove: true, move: false } } ],
			[ CAPTION_BLOCK ],
		],
		[]
	);

	return (
		<div { ...blockProps }>
			<InnerBlocks
				template={ TEMPLATE }
				allowedBlocks={ ALLOWED }
				templateLock={false}
			/>
		</div>
	);
}
