import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { url, alt } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps}>
            {url && <img src={url} alt={alt} />}
        </div>
    );
}
