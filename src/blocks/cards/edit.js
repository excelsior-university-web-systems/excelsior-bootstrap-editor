import { InnerBlocks, InspectorControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

export default function Edit( {attributes, setAttributes} ) {

    const TEMPLATE = [
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/card', {}, []],
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/card', {}, []],
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/card', {}, []]
    ];

    const { colSize, bgColor } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
  
    const blockProps = useBlockProps( {
        className: '',
    } );

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: `row row-cols-1 row-cols-sm-2 row-cols-md-${colSize} g-3`,
        },
        {
            allowedBlocks: [XCLSR_BTSTRP_EDITOR_PREFIX + '/card'],
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
