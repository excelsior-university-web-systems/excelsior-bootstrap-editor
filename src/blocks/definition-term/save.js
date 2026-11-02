import { RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { termName, termDefinition, hasIndentation } = attributes;

    return (
        <>
        <RichText.Content
            tagName="dt"
            className='term'
            value={termName}
        />
        <RichText.Content
            tagName="dd"
            className={`definition mb-3 ${hasIndentation ? 'ms-3' : ''}`}
            value={termDefinition}
        />
        </>
    );
}
