import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {
    return (
        <p {...useBlockProps.save()}>
            <InnerBlocks.Content />
        </p>
    );
}
