import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import metadata from './block.json';

export default function Edit ({ attributes, setAttributes }) {

    const TEMPLATE = [
        ['core/heading', {headingSizeClass: 'h5', level: 3, placeholder: 'Heading'}],
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]
    ];
    
    const { styleType } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps( {
        className: `callout callout-${styleType}`,
        role: 'complementary'
    } );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
            <SelectControl
                label="Styles"
                help="Guide is purple. Quote is blue. Skills are green. Please refer to the style guide for each style's use case."
                value={styleType}
                options={[
                    { label: 'Guide', value: 'guide' },
                    { label: 'Quote', value: 'quote' },
                    { label: 'Skills', value: 'skills' },
                ]}
                onChange={(value) => setAttributes({ styleType: value })}
                __nextHasNoMarginBottom
                __next40pxDefaultSize
            />
            </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
        
    );
}
