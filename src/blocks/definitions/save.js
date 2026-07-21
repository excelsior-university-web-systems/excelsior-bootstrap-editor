import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {
    const blockProps = useBlockProps.save({
        className: 'excelsior-definitions mb-3',
    });

    return (
        <dl {...blockProps}>
            <InnerBlocks.Content />
        </dl>
    );
}
