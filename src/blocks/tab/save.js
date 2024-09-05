import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {

    const { title, uniqueId } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps}>
            <RichText.Content
                tagName="h2"
                value={title}
            />
            <div id={uniqueId}>
                <div>
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
}
