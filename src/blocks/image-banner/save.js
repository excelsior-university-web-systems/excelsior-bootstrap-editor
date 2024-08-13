import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { url } = attributes;
    const blockProps = useBlockProps.save( {
        className: 'decorative-banner'
    } );

    return (
        <>
        { url && <img {...blockProps} src={url} alt="" role="presentation" />}
        </>
    );
}
