import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';

export default function Edit ({ attributes, setAttributes }) {

    const TEMPLATE = [
        ['core/heading', {headingSizeClass: 'h5', level: 3, placeholder: 'Heading'}],
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]
    ];
    
    const { styleType } = attributes;

    const blockProps = useBlockProps( {
        className: `callout callout-${styleType}`,
        role: 'complementary'
    } );

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