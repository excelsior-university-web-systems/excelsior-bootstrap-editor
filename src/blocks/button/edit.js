import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Notice } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { isAllowedLinkUrl, preventLineBreaks } from '../../commons';

export default function Edit( { attributes, setAttributes, clientId } ) {

    const { href, text, subsequent } = attributes;
    const isHrefAllowed = isAllowedLinkUrl( href );
    const { lockPostSaving, unlockPostSaving } = useDispatch( 'core/editor' );

    useEffect( () => {
        if ( isHrefAllowed ) {
            return;
        }

        const lockKey = `invalid-button-url-${ clientId }`;
        lockPostSaving( lockKey );

        return () => unlockPostSaving( lockKey );
    }, [ isHrefAllowed, clientId, lockPostSaving, unlockPostSaving ] );

    // Get the parent container (excelsior-bootstrap-editor/buttons)
    const parents = wp.data.select( 'core/block-editor' ).getBlockParents( clientId );
    const parent = parents.filter( ( parent ) => {
        return wp.data.select( 'core/block-editor' ).getBlock( parent ).name === ( XCLSR_BTSTRP_EDITOR_PREFIX + '/buttons' );
    } );

    // Get the sibling blocks in the parent container
    const siblingBlocks = parent.length
        ? wp.data.select( 'core/block-editor' ).getBlocks( parent[0] )
        : [];

    // Get the index of the current block among its siblings
    const currentIndex = siblingBlocks.findIndex( (block) => block.clientId === clientId );

    // if index is greater than 0, it is a subsequent button
    if ( currentIndex > 0 ) {
        setAttributes( { subsequent: true } );
    }

    const blockProps = useBlockProps( {
        className: `btn btn-resource${subsequent ? ' ms-2' : ''}`
    } );

    return (
        <>
            <InspectorControls>
                <PanelBody title='Settings'>
                    <TextControl
                        label="URL"
                        help="Enter the button's URL."
                        value={href}
                        onChange={(value) => setAttributes({ href: value.trim() })}
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                    />
                    { !isHrefAllowed && (
                        <Notice status="error" isDismissible={false}>
                            Enter a URL that starts with http://, https://, or mailto:, or an anchor that starts with #. The page cannot be saved until this is fixed.
                        </Notice>
                    )}
                </PanelBody>
            </InspectorControls>
            <RichText
                {...blockProps}
                tagName="a"
                href={href}
                value={text}
                placeholder='Button Text'
                onChange={(value) => setAttributes({ text: value })}
                allowedFormats={[XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
                multiline={false}
                onKeyDown={preventLineBreaks}
                onPaste={preventLineBreaks}
            />
        </>
    );
}
