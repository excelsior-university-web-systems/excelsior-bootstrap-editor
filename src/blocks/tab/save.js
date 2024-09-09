import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { title, uniqueId, isActive, headingLevel, headingClass } = attributes;
    
    const blockProps = useBlockProps.save({
        className: `tab-pane fade ${isActive ? 'show active' : ''}`,
        id: `${uniqueId}-pane`,
        role: "tabpanel",
        "aria-labelledby": `${uniqueId}-tab`
    });

    return (
        <div {...blockProps}>
            <RichText.Content
                tagName={headingLevel}
                className={headingClass}
                value={title}
            />
            <InnerBlocks.Content />
        </div>
    );
}
