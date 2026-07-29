import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { name, material } = attributes;

    const blockProps = useBlockProps.save({
        className: 'list-group-item',
    });

    return (
        <li {...blockProps}>
            <RichText.Content
                tagName='p'
                value={name}
            />
            <RichText.Content
                tagName='p'
                value={material}
                className='secondary'
            />
        </li>
    );
}
