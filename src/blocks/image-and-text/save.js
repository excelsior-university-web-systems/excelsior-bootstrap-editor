import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { repositioned } = attributes;
    const blockProps = useBlockProps.save( {
        className: repositioned ? 'd-flex flex-column d-md-block clearfix' : 'clearfix'
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
