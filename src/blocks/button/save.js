import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {

    const { href, text, subsequent } = attributes;
    const blockProps = useBlockProps.save( {
        className: `btn btn-resource${subsequent ? ' ms-2' : ''}`
    } );

    return (
        <RichText.Content
            {...blockProps}
            tagName="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            value={text}
        />
    );
}
