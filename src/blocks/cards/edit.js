import { InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Notice, __experimentalSpacer as Spacer } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMinimumChildBlocks } from '../../commons';
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

    const { colSize, bgColor, aspectRatio } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
  
    const blockProps = useBlockProps( {
        className: '',
    } );

    useMinimumChildBlocks( {
        clientId,
        blockName: CARD_BLOCK,
        minimum: MIN_CARDS,
        isPreview,
    } );

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
                <Spacer />
                <SelectControl
                        label="Image Aspect Ratio"
                        help="Choose a consistent aspect ratio for card images. Images are automatically cropped to fit the selected ratio."
                        value={aspectRatio}
                        options={[
                            { label: '1:1', value: '1x1' },
                            { label: '4:3', value: '4x3' },
                            { label: '16:9', value: '16x9' },
                            { label: '21:9', value: '21x9' },
                        ]}
                        onChange={(value) => setAttributes({ aspectRatio: value })}
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <div {...innerBlocksProps} />
        </div>
        </>
    );
}
