import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {
    const blockProps = useBlockProps.save({
        id: 'excelsior-bootstrap', // Adding the ID to the outermost div
    });

    return (
        <div {...blockProps}>
            <div className="page-container">
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
