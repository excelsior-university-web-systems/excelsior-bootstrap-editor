import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {

    const blockProps = useBlockProps.save( {
        className: 'col'
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
