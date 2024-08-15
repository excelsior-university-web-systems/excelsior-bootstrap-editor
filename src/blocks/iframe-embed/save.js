import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { embedCode } = attributes;

    return (
        <div {...useBlockProps.save()} dangerouslySetInnerHTML={{ __html: embedCode }} />
    );

}
