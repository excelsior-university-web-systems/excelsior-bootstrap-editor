import { RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { termName, termDefinition } = attributes;

    return (
        <>
        <RichText.Content
            tagName="dt"
            className='term'
            value={termName}
        />
        <RichText.Content
            tagName="dd"
            className='definition mb-3'
            value={termDefinition}
        />
        </>
    );
}
