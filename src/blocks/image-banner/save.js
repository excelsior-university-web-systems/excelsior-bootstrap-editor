import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { url } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps}>
            {url && <img src={url} alt="" role="presentation" />}
        </div>
    );
}
