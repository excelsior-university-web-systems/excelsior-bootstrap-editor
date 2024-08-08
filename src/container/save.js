import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { additionalClass = '' } = attributes;

    const blockProps = useBlockProps.save({
        className: `page-container ${additionalClass ? additionalClass : ''}`.trim(),
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
