import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { href, styleType, text } = attributes;

    const blockProps = useBlockProps.save({
        className: `btn ${styleType}`,
        rel: styleType === 'btn-resource' ? 'noopener' : undefined
    });

    return (
        <RichText.Content
            {...blockProps}
            tagName="a"
            href={href}
            target={styleType === 'btn-resource' ? '_blank' : undefined}
            value={text}
        />
    );
}
