import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { title, content } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps}>
            <RichText.Content tagName="h4" value={title} />
            <RichText.Content tagName="div" value={content} />
        </div>
    );
}
