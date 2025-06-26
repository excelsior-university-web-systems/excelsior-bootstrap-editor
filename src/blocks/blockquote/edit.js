import { InnerBlocks, useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';

export default function Edit ({ attributes, setAttributes }) {

    const TEMPLATE = [
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]
    ];

    const { narrowWidth, cover } = attributes;
    const blockProps = useBlockProps( {
        className: `excelsior-blockquote ${narrowWidth ? 'w-75 mx-auto' : ''}`,
    } );

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