import { InnerBlocks, useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';

export default function Edit ({ attributes, setAttributes }) {

    const TEMPLATE = [
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]
    ];

    const { narrowWidth, hasSource, source, cover } = attributes;

    const blockProps = useBlockProps( {
        className: `${narrowWidth ? 'w-75 mx-auto' : ''}`,
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
                    label="Has Author / Source"
                    help="Toggle on to set an author or a source."
                    checked={hasSource}
                    onChange={(value) => setAttributes({ hasSource: value })}
                    __nextHasNoMarginBottom
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
        <figure {...blockProps}>
            <blockquote className='excelsior-blockquote'>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={TEMPLATE}
                    templateLock={false}
                    renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                />
            </blockquote>
            { hasSource && 
                <RichText
                    tagName="figcaption"
                    className='excelsior-blockquote-footer'
                    value={source}
                    placeholder='Enter Author / Source'
                    onChange={(value) => setAttributes({ source: value.trim() })}
                />
            }
        </figure>
        </>
        
    );
}