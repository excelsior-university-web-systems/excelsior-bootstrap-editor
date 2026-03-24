import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import metadata from './block.json';

export default function Edit ({ attributes, setAttributes }) {

    const TEMPLATE = [
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]
    ];

    const { styleType, narrowWidth } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps( {
        className: `tip${styleType.length ? ' ' + styleType : ''}${narrowWidth ? ' w-75 mx-auto' : ''}`,
        role: 'alert'
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
                    help="Tip is purple. Reminder is red. Note is blue. Please refer to the style guide for each style's use case."
                    value={styleType}
                    options={[
                        { label: 'Tip', value: '' },
                        { label: 'Reminder', value: 'tip-reminder' },
                        { label: 'Note', value: 'tip-note' },
                    ]}
                    onChange={(value) => setAttributes({ styleType: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
                <ToggleControl
                    label="Narrow Width"
                    help="Toggle on to make the width shorter and center aligned."
                    checked={narrowWidth}
                    onChange={(value) => setAttributes({ narrowWidth: value })}
                    __nextHasNoMarginBottom
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
