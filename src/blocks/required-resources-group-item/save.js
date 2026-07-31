import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { resource, source } = attributes;

    const blockProps = useBlockProps.save({
        className: 'list-group-item',
    });

    return (
        <li {...blockProps}>
            
            <RichText.Content
                tagName='p'
                value={resource}
            />
            { source && (
                <RichText.Content
                    tagName='p'
                    value={source}
                    className='secondary'
                />
            )}
            
        </li>
    );
}
