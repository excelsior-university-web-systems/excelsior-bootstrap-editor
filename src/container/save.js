import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { additionalClass, backToTop } = attributes;

    const blockProps = useBlockProps.save({
        className: `page-container${backToTop ? ' back-to-top' : ''}${additionalClass ? ' ' + additionalClass : ''} `.trim(),
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
