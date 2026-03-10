import { InnerBlocks, useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { generateHtmlId, getBlocksOfType } from '../../commons';

export default function Edit ({ attributes, setAttributes, clientId }) {

    const TEMPLATE = [
        ['core/heading', {headingSizeClass: 'h5', level: 3, placeholder: 'Heading'}],
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}],
        ['excelsior-bootstrap-editor/collapsible-content']
    ];
    
    const { buttonText, uniqueId, styleType, cover } = attributes;

    const blockProps = useBlockProps( {
        className: `excelsior-collapsible ${styleType}`,
    } );

    const sameTypeBlocks = useSelect((select) => {
        const allBlocks = select('core/block-editor').getBlocks();
        return getBlocksOfType(allBlocks, 'excelsior-bootstrap-editor/collapsible');
    }, []);

    useEffect(() => {
    
        const isDuplicate = sameTypeBlocks.some(
            ( block ) => block.clientId !== clientId && block.attributes.uniqueId === uniqueId
        );

        if ( !uniqueId || isDuplicate ) {
            setAttributes( { uniqueId: generateHtmlId() } );
        }

    }, []);

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
            <SelectControl
                label="Styles"
                help="Please refer to the style guide for each style's use case."
                value={styleType}
                options={[
                    { label: 'Default', value: '' },
                    { label: 'Purple', value: 'purple' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Green', value: 'green' },
                    { label: 'Red', value: 'red' },
                ]}
                onChange={(value) => setAttributes({ styleType: value })}
                __nextHasNoMarginBottom
                __next40pxDefaultSize
            />
            </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
            <div className='content'>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={TEMPLATE}
                    templateLock={false}
                    renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                />
            </div>
            <RichText
                className="btn"
                tagName="a"
                href={'#'+uniqueId}
                value={buttonText}
                role="button"
                onChange={(value) => setAttributes({ buttonText: value })}
            />
        </div>
        </>
    );
}