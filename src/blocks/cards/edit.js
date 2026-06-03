import { InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Notice } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

const CARD_BLOCK = XCLSR_BTSTRP_EDITOR_PREFIX + '/card';
const MIN_CARDS = 2;
const TEMPLATE = [
    [CARD_BLOCK, {}, []],
    [CARD_BLOCK, {}, []],
    [CARD_BLOCK, {}, []]
];

export default function Edit( {attributes, setAttributes, clientId} ) {

    const { colSize, bgColor } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
  
    const blockProps = useBlockProps( {
        className: '',
    } );
    const childBlocks = useSelect(
        ( select ) => select( 'core/block-editor' ).getBlocks( clientId ) || [],
        [ clientId ]
    );
    const { insertBlocks, updateBlockAttributes } = useDispatch( 'core/block-editor' );
    const cardBlocks = childBlocks.filter(
        ( block ) => block.name === CARD_BLOCK
    );

    useEffect( () => {
        if ( isPreview ) {
            return;
        }

        const missingCardCount = MIN_CARDS - cardBlocks.length;

        if ( missingCardCount > 0 ) {
            insertBlocks(
                Array.from(
                    { length: missingCardCount },
                    () => createBlock( CARD_BLOCK )
                ),
                childBlocks.length,
                clientId
            );
            return;
        }

        const lockRemove = cardBlocks.length <= MIN_CARDS;

        cardBlocks.forEach( ( block ) => {
            const currentLock = block.attributes?.lock || {};

            if ( currentLock.remove === lockRemove ) {
                return;
            }

            updateBlockAttributes( block.clientId, {
                lock: {
                    ...currentLock,
                    remove: lockRemove,
                },
            } );
        } );
    }, [
        cardBlocks,
        childBlocks.length,
        clientId,
        insertBlocks,
        isPreview,
        updateBlockAttributes,
    ] );

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `row row-cols-1 row-cols-sm-2 row-cols-md-${colSize} g-3 mb-3`,
        },
        {
            allowedBlocks: [CARD_BLOCK],
            template: TEMPLATE,
            templateLock: false,
            orientation: 'horizontal',
            renderAppender: InnerBlocks.DefaultBlockAppender,
        }
    );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }
    
    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <ToggleGroupControl
                    label="Number of cards per row"
                    help="Select the maximum number of cards per row on a wide screen."
                    value={colSize}
                    onChange={(value) => setAttributes({ colSize: value })}
                    isBlock
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                >
                    <ToggleGroupControlOption value="2" label="2" />
                    <ToggleGroupControlOption value="3" label="3" />
                    <ToggleGroupControlOption value="4" label="4" />
                </ToggleGroupControl>
                <SelectControl
                className="deprecated"
                    label="Background Color"
                    value={bgColor}
                    options={[
                        { label: 'None', value: '' },
                        { label: 'Light Subtle (DEPRECATED)', value: 'bg-light-subtle' },
                        { label: 'Light', value: 'bg-light' },
                        { label: 'Secondary (DEPRECATED)', value: 'bg-body-secondary' },
                        { label: 'Dark Subtle (DEPRECATED)', value: 'bg-dark-subtle' },
                    ]}
                    onChange={(value) => setAttributes({ bgColor: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
                <Notice status="warning" isDismissible={false}>All color choices, except Light, are deprecated. Do not use. They will be removed in the near future.</Notice>
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <div {...innerBlocksProps} />
        </div>
        </>
    );
}
