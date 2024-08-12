import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {
    const blockProps = useBlockProps.save( {
        id: 'excelsior-bootstrap',
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
