import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {

    const blockProps = useBlockProps.save( {
        className: 'list-group list-group-flush'
    } );

    return (
        <ul {...blockProps}>
            <InnerBlocks.Content />
        </ul>
    );
}
