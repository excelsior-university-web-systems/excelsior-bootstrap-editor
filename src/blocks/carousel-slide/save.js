import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({attributes}) {
    
    const {isActive} = attributes;
    const blockProps = useBlockProps.save({
        className: `carousel-item ${isActive ? 'active' : ''}`.trim()
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
