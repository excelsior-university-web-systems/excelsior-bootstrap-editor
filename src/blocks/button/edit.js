import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes, clientId } ) {

    const { href, styleType, text, subsequent } = attributes;

    // Get the parent container (excelsior-bootstrap/buttons)
    const parents = wp.data.select( 'core/block-editor' ).getBlockParents( clientId );
    const parent = parents.filter( ( parent ) => {
        return wp.data.select( 'core/block-editor' ).getBlock( parent ).name === 'excelsior-bootstrap/buttons';
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
        className: `btn ${styleType}${subsequent ? ' ms-2' : ''}`,
        rel: styleType === 'btn-resource' ? 'noopener' : undefined
    } );

    return (
        <>
            <InspectorControls>
                <PanelBody title='Settings'>
                    <TextControl
                        label='URL'
                        value={href}
                        onChange={(value) => setAttributes({ href: value.trim() })}
                    />
                    <SelectControl
                        label='Styles'
                        value={styleType}
                        options={[
                            { label: 'Internal', value: 'btn-internal' },
                            { label: 'Resource', value: 'btn-resource' },
                        ]}
                        onChange={(value) => setAttributes({ styleType: value })}
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
                allowedFormats={[]}
            />
        </>
    );
}
