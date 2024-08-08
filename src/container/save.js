import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { additionalClass = '', backToTop } = attributes;

    const blockProps = useBlockProps.save({
        className: `page-container ${additionalClass ? additionalClass : ''} ${backToTop ? 'back-to-top' : ''}`.trim(),
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
