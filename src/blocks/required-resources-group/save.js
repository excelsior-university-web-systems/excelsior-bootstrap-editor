import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {

    const blockProps = useBlockProps.save({
        className: 'list-group',
    });

    return (
        <ul {...blockProps}>
            <InnerBlocks.Content />
        </ul>
    );
}
