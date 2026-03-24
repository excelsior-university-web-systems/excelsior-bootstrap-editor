import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import metadata from './block.json';

export default function Edit ({ attributes, setAttributes }) {

    const TEMPLATE = [
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]
    ];

    const { narrowWidth } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const blockProps = useBlockProps( {
        className: `excelsior-blockquote ${narrowWidth ? 'w-75 mx-auto' : ''}`,
    } );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <ToggleControl
                    label="Narrow Width"
                    help="Toggle on to make the width shorter and center aligned."
                    checked={narrowWidth}
                    onChange={(value) => setAttributes({ narrowWidth: value })}
                    __nextHasNoMarginBottom
                />
            </PanelBody>
        </InspectorControls>
        <blockquote {...blockProps}>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={TEMPLATE}
                    templateLock={false}
                    renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                />
        </blockquote>
        </>
        
    );
}
