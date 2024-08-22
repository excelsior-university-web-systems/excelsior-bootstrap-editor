import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { styleType } = attributes;
    const blockProps = useBlockProps.save( {
        className: `callout callout-${styleType}`,
        role: 'complementary'
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
