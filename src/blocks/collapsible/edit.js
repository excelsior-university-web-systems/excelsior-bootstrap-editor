import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { generateHtmlId, getBlocksOfType } from '../../commons';

export default function Edit ({ attributes, setAttributes, clientId }) {

    const TEMPLATE = [
        ['core/heading', {headingSizeClass: 'h5', level: 3, placeholder: 'Heading'}],
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}],
        ['excelsior-bootstrap-editor/collapsible-content', { lock: { remove: true, move: false } }]
    ];
    
    const { uniqueId, styleType, cover } = attributes;
    const isPreview = !!cover;

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

    const { insertBlocks, updateBlockAttributes, replaceInnerBlocks } = useDispatch('core/block-editor');
    const { createNotice } = useDispatch('core/notices');
    const collapsibleContentBlocks = innerBlocks.filter(
        ( block ) => block.name === 'excelsior-bootstrap-editor/collapsible-content'
    );
    const firstCollapsibleContentId = collapsibleContentBlocks?.[0]?.clientId || null;
    const firstCollapsibleContentLock = useSelect(
        ( select ) => {
            if ( ! firstCollapsibleContentId ) {
                return null;
            }

            const blockAttributes = select( 'core/block-editor' ).getBlockAttributes( firstCollapsibleContentId ) || {};
            return blockAttributes.lock || null;
        },
        [ firstCollapsibleContentId ]
    );
    const hasCollapsibleContentBlock = collapsibleContentBlocks.length > 0;
    const allowedBlocks = hasCollapsibleContentBlock
        ? ALLOWED_BLOCKS.filter(
            ( blockName ) => blockName !== 'excelsior-bootstrap-editor/collapsible-content'
        )
        : ALLOWED_BLOCKS;
    const enforcingContentRef = useRef( false );
    const primaryContentIdRef = useRef( null );
    const knownContentIdsRef = useRef( [] );

    // Ensure an unique ID is assigned
    useEffect(() => {
        if ( isPreview ) {
            return;
        }
    
        const isDuplicate = sameTypeBlocks.some(
            ( block ) => block.clientId !== clientId && block.attributes.uniqueId === uniqueId
        );

        if ( !uniqueId || isDuplicate ) {
            setAttributes( { uniqueId: generateHtmlId() } );
        }

    }, [ isPreview ]);

    // Ensure collapsible-content block always exists
    useEffect(() => {
        if ( isPreview ) {
            return;
        }

        if ( enforcingContentRef.current ) {
            return;
        }

        enforcingContentRef.current = true;

        // If no collapsible-content block, add one with saved content
        if (collapsibleContentBlocks.length === 0) {
            if ( innerBlocks.length > 0 ) {
                createNotice(
                    'warning',
                    'A Collapsible block must contains one Collapsible Content block.',
                    {
                        isDismissible: true,
                        type: 'snackbar'
                    }
                );
            }
            const wp = window.wp;
            const block = wp.blocks.createBlock(
                'excelsior-bootstrap-editor/collapsible-content',
                { lock: { remove: true, move: false } }
            );
            primaryContentIdRef.current = block.clientId;
            knownContentIdsRef.current = [ block.clientId ];
            insertBlocks(block, innerBlocks.length, clientId);
            enforcingContentRef.current = false;
            return;
        }

        if (
            ! primaryContentIdRef.current ||
            ! collapsibleContentBlocks.some( ( block ) => block.clientId === primaryContentIdRef.current )
        ) {
            primaryContentIdRef.current = collapsibleContentBlocks[0].clientId;
        }

        if ( collapsibleContentBlocks.length === 1 ) {
            knownContentIdsRef.current = [ collapsibleContentBlocks[0].clientId ];
        }
        
        // If more than one collapsible-content block, remove the extras immediately.
        if (collapsibleContentBlocks.length > 1) {
            createNotice(
                'warning',
                'Only one Collapsible Content block is allowed per Collapsible block.',
                {
                    isDismissible: true,
                    type: 'snackbar'
                }
            );
            const knownIds = knownContentIdsRef.current;
            let duplicateBlocks = collapsibleContentBlocks.filter(
                ( block ) =>
                    block.clientId !== primaryContentIdRef.current &&
                    ! knownIds.includes( block.clientId )
            );

            if ( duplicateBlocks.length === 0 ) {
                duplicateBlocks = collapsibleContentBlocks.filter(
                    ( block ) => block.clientId !== primaryContentIdRef.current
                );
            }

            const duplicateIds = duplicateBlocks.map( ( block ) => block.clientId );
            const nextInnerBlocks = innerBlocks.filter(
                ( block ) =>
                    block.name !== 'excelsior-bootstrap-editor/collapsible-content' ||
                    ! duplicateIds.includes( block.clientId )
            );

            replaceInnerBlocks( clientId, nextInnerBlocks, false );

            knownContentIdsRef.current = [ primaryContentIdRef.current ];
            enforcingContentRef.current = false;
            return;
        }

        enforcingContentRef.current = false;
    }, [ collapsibleContentBlocks.length, clientId, createNotice, innerBlocks, insertBlocks, isPreview, replaceInnerBlocks ]);

    // Prevent removing or moving the required collapsible-content wrapper.
    useEffect(() => {
        if ( isPreview ) {
            return;
        }

        if ( ! firstCollapsibleContentId || collapsibleContentBlocks.length !== 1 ) {
            return;
        }

        const isLocked =
            !!firstCollapsibleContentLock &&
            firstCollapsibleContentLock.remove === true &&
            firstCollapsibleContentLock.move === false;

        if ( isLocked ) {
            return;
        }

        updateBlockAttributes( firstCollapsibleContentId, {
            lock: { remove: true, move: false }
        } );
    }, [ firstCollapsibleContentId, firstCollapsibleContentLock, collapsibleContentBlocks.length, isPreview, updateBlockAttributes ]);

    if ( isPreview ) {
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
                    allowedBlocks={allowedBlocks}
                    template={TEMPLATE}
                    templateLock={false}
                    renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                />
            </div>
            
        </div>
        </>
    );
}
