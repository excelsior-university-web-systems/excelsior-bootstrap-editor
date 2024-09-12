import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { embedCode, floatingClasses } = attributes;
    const blockProps = useBlockProps.save( {
        className: floatingClasses
    } );

    return (
        <div {...blockProps} dangerouslySetInnerHTML={{ __html: embedCode }} />
    );

}
