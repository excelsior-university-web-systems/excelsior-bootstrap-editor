import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

const ACCORDION_ITEM_BLOCK = XCLSR_BTSTRP_EDITOR_PREFIX + '/accordion-item';
const MIN_ACCORDION_ITEMS = 2;
const TEMPLATE = [
    [ACCORDION_ITEM_BLOCK],
    [ACCORDION_ITEM_BLOCK],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
    
    const { accordionHeadingLevel, accordionHeadingSize } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const blockProps = useBlockProps({
        className: 'accordion',
    });
    const childBlocks = useSelect(
        ( select ) => select( 'core/block-editor' ).getBlocks( clientId ) || [],
        [ clientId ]
    );
    const { insertBlocks, updateBlockAttributes } = useDispatch( 'core/block-editor' );
    const accordionItemBlocks = childBlocks.filter(
        ( block ) => block.name === ACCORDION_ITEM_BLOCK
    );

    useEffect( () => {
        if ( isPreview ) {
            return;
        }

        const missingItemCount = MIN_ACCORDION_ITEMS - accordionItemBlocks.length;

        if ( missingItemCount > 0 ) {
            insertBlocks(
                Array.from(
                    { length: missingItemCount },
                    () => createBlock( ACCORDION_ITEM_BLOCK )
                ),
                childBlocks.length,
                clientId
            );
            return;
        }

        const lockRemove = accordionItemBlocks.length <= MIN_ACCORDION_ITEMS;

        accordionItemBlocks.forEach( ( block ) => {
            const currentLock = block.attributes?.lock || {};

            if ( currentLock.remove === lockRemove ) {
                return;
            }

            updateBlockAttributes( block.clientId, {
                lock: {
                    ...currentLock,
                    remove: lockRemove,
                },
            } );
        } );
    }, [
        accordionItemBlocks,
        childBlocks.length,
        clientId,
        insertBlocks,
        isPreview,
        updateBlockAttributes,
    ] );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title='Settings'>
                <SelectControl
                    label="Heading Level"
                    help="The heading level of the accordion item."
                    value={accordionHeadingLevel}
                    options={[
                        { label: 'H2', value: 'h2' },
                        { label: 'H3', value: 'h3' },
                        { label: 'H4', value: 'h4' },
                        { label: 'H5', value: 'h5' },
                        { label: 'H6', value: 'h6' },
                    ]}
                    onChange={(value) => setAttributes({ accordionHeadingLevel: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
                <SelectControl
                    label="Heading Level Size"
                    help="Set the font size of the heading to use the size of a different heading level."
                    value={accordionHeadingSize}
                    options={[
                        { label: 'H1', value: 'h1' },
                        { label: 'H2', value: 'h2' },
                        { label: 'H3', value: 'h3' },
                        { label: 'H4', value: 'h4' },
                        { label: 'H5', value: 'h5' },
                        { label: 'H6', value: 'h6' },
                    ]}
                    onChange={(value) => setAttributes({ accordionHeadingSize: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={[ACCORDION_ITEM_BLOCK]}
                template={TEMPLATE}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
        
    );
}
