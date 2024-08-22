import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save( {attributes} ) {

    const { colSize } = attributes;

    const blockProps = useBlockProps.save( {
        className: `row row-cols-1 row-cols-sm-2 row-cols-md-${colSize} g-3`
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
