import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { uniqueId, isActive } = attributes;
    
    const blockProps = useBlockProps.save({
        className: `tab-pane fade ${isActive ? 'show active' : ''}`,
        id: `${uniqueId}-pane`,
        role: "tabpanel",
        "aria-labelledby": `${uniqueId}-tab`
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
