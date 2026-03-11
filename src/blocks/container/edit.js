import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Tooltip } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { ALLOWED_BLOCKS } from './allowed-blocks';

function isEmptyParagraphBlock( block ) {
    if ( !block || block.name !== 'core/paragraph' ) {
        return false;
    }

    const content = block.attributes?.content || '';
    const textOnlyContent = content
        .replace( /<br\s*\/?>/gi, '' )
        .replace( /&nbsp;/gi, ' ' )
        .replace( /<[^>]+>/g, '' )
        .trim();

    return textOnlyContent.length === 0;
}

function ParagraphAppender( { rootClientId } ) {
    const { insertBlock, selectBlock } = useDispatch( 'core/block-editor' );

    const appendParagraph = () => {
        const block = createBlock( 'core/paragraph' );
        insertBlock( block, undefined, rootClientId );
        selectBlock( block.clientId );
    };

    return (
        <div className='empty-block-appender'>
            <Tooltip text='Add an empty block at the end of the container'>
                <button
                    type="button"
                    onClick={appendParagraph}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z"></path></svg>
                </button>
            </Tooltip>
        </div>
    );
}

export default function Edit( { attributes, setAttributes, clientId } ) {
    
    const { backToTop, mainLandmarkRole } = attributes;
    const { isReBlockPostType, lastInnerBlock } = useSelect( ( select ) => {
        const postType = select( 'core/editor' )?.getCurrentPostType?.();
        const innerBlocks = select( 'core/block-editor' ).getBlocks( clientId );

        return {
            isReBlockPostType: postType === 'reblock',
            lastInnerBlock: innerBlocks[ innerBlocks.length - 1 ] || null,
        };
    }, [ clientId ] );

    const blockProps = useBlockProps( {
        className: `page-container${backToTop ? ' back-to-top' : ''}`.trim(),
        role: mainLandmarkRole ? 'main' : undefined,
    } );

    useEffect( () => {
        if ( isReBlockPostType && backToTop ) {
            setAttributes( { backToTop: false } );
        }
    }, [ isReBlockPostType, backToTop, setAttributes ] );

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ToggleControl
                        label="Back to top button"
                        help="Add a fixed-position button at the bottom right of the page to scroll long content back to the top."
                        checked={backToTop}
                        disabled={isReBlockPostType}
                        onChange={(value) => setAttributes({ backToTop: value })}
                        __nextHasNoMarginBottom
                    />
                    <ToggleControl
                        label="Main ARIA landmark role"
                        help="Add role='main' to the container to identify it as the primary content for screen readers. Avoid adding it if the platform (e.g., Canvas) already defines a main role landmark."
                        checked={mainLandmarkRole}
                        onChange={(value) => setAttributes({ mainLandmarkRole: value })}
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={[ [ 'core/paragraph' ] ]}
                    templateLock={false}
                    renderAppender={false}
                />
                { !isEmptyParagraphBlock( lastInnerBlock ) && (
                    <ParagraphAppender rootClientId={clientId} />
                ) }
            </div>
        </>
    );
}
