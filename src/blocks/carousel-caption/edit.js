import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Edit() {

    const blockProps = useBlockProps( {
        className: "carousel-caption"
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks template={[
					[ 'core/paragraph', { placeholder: 'Add caption here...' } ],
			]} allowedBlocks={["core/paragraph"]} />
        </div>
    );
}
