import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {

    const blockProps = useBlockProps.save( {
        className: 'homepage-content clearfix'
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
