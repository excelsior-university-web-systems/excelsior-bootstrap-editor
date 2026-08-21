import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { preventLineBreaks } from '../../commons';

export default function Edit( { attributes, setAttributes, clientId } ) {

    const { href, styleType, text, subsequent } = attributes;

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
        className: `btn ${styleType}${subsequent ? ' ms-2' : ''}`
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
            />
        </>
    );
}
