import { InnerBlocks } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

export default function Save() {
    const blockProps = useBlockProps.save({
        className: 'excelsior-tabs'
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
