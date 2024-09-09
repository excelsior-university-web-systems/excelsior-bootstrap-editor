import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { title, uniqueId, isActive } = attributes;
    const blockProps = useBlockProps.save({
        className: `tab-pane fade ${isActive ? 'show active' : ''}`,
        id: `${uniqueId}-pane`,
        role: "tabpanel",
        "aria-labelledby": `${uniqueId}-tab`
    });

    return (
        <div {...blockProps}>
            <RichText.Content
                tagName="h2"
                className='h4'
                value={title}
            />
            <InnerBlocks.Content />
        </div>
    );
}
