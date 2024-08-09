import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { additionalClass, backToTop, mainLandmarkRole } = attributes;

    const blockProps = useBlockProps.save({
        className: `page-container${backToTop ? ' back-to-top' : ''}${additionalClass ? ' ' + additionalClass : ''}`.trim(),
        role: mainLandmarkRole ? 'main' : undefined,
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
