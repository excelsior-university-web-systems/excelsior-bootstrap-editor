import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save( {attributes} ) {

    const { uniqueId } = attributes;
    const blockProps = useBlockProps.save( {
        className: 'collapse'
    } );

    return (
    <div {...blockProps} id={uniqueId}>
        <InnerBlocks.Content />
    </div>
    );
}
