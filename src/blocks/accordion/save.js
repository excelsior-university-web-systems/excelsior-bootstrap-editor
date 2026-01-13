import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {
    const blockProps = useBlockProps.save({
        className: 'accordion mb-3',
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
