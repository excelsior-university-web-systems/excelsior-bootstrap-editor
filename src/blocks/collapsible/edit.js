import { InnerBlocks, useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
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
        className: `excelsior-collapsible mb-3 ${styleType}`,
    } );

    const sameTypeBlocks = useSelect((select) => {
        const allBlocks = select('core/block-editor').getBlocks();
        return getBlocksOfType(allBlocks, 'excelsior-bootstrap-editor/collapsible');
    }, []);

    const { innerBlocks } = useSelect((select) => {
        const block = select('core/block-editor').getBlock(clientId);
        return {
            innerBlocks: block?.innerBlocks || []
        };
    }, [clientId]);

    const { insertBlocks } = useDispatch('core/block-editor');
    const { createNotice } = useDispatch('core/notices');

    // Ensure an unique ID is assigned
    useEffect(() => {
    
        const isDuplicate = sameTypeBlocks.some(
            ( block ) => block.clientId !== clientId && block.attributes.uniqueId === uniqueId
        );

        if ( !uniqueId || isDuplicate ) {
            setAttributes( { uniqueId: generateHtmlId() } );
        }

    }, []);

    // Track and save collapsible-content's inner blocks
    useEffect(() => {
        const collapsibleContentBlocks = innerBlocks.filter(
            block => block.name === 'excelsior-bootstrap-editor/collapsible-content'
        );
        
        if (collapsibleContentBlocks.length === 1) {
            const contentBlock = collapsibleContentBlocks[0];
            // Save the inner blocks of collapsible-content to parent attributes
            if (contentBlock.innerBlocks.length > 0) {
                setAttributes({ 
                    _collapsibleContentInnerBlocks: contentBlock.innerBlocks 
                });
            }
        }
    }, [innerBlocks]);

    // Ensure collapsible-content block always exists
    useEffect(() => {
        const collapsibleContentBlocks = innerBlocks.filter(
            block => block.name === 'excelsior-bootstrap-editor/collapsible-content'
        );

        // If no collapsible-content block, add one with saved content
        if (collapsibleContentBlocks.length === 0) {
            createNotice(
                'warning',
                'A Collapsible block must contains one Collapsible Content block.',
                {
                    isDismissible: true,
                    type: 'snackbar'
                }
            );
            const wp = window.wp;
            const block = wp.blocks.createBlock(
                'excelsior-bootstrap-editor/collapsible-content',
                {},
                attributes._collapsibleContentInnerBlocks || []
            );
            insertBlocks(block, innerBlocks.length, clientId);
            // Store this block's ID
            setAttributes({ _collapsibleContentId: block.clientId });
        }
        
        // If more than one collapsible-content block, remove the duplicates but keep the original
        if (collapsibleContentBlocks.length > 1) {
            createNotice(
                'warning',
                'Only one Collapsible Content block is allowed per Collapsible block.',
                {
                    isDismissible: true,
                    type: 'snackbar'
                }
            );
            const { removeBlock } = window.wp.data.dispatch('core/block-editor');
            const keepBlockId = attributes._collapsibleContentId || collapsibleContentBlocks[0].clientId;
            
            collapsibleContentBlocks.forEach(block => {
                if (block.clientId !== keepBlockId) {
                    removeBlock(block.clientId);
                }
            });
        }
    }, [innerBlocks, clientId, insertBlocks, createNotice, attributes]);

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