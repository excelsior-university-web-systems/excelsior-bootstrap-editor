import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save() {
    
    const blockProps = useBlockProps.save( {
        className: 'carousel-caption vh-sm-down'
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
