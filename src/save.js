import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {
    const blockProps = useBlockProps.save({
        id: 'excelsior-bootstrap',
        className: 'page-container'
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
