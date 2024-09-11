import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { selectedIcon, size, decorative, noIcon } = attributes;
    const blockProps = useBlockProps.save( {
        className: `decorative ${ noIcon ? '' : `bi ${selectedIcon}${size !== 'regular' ? ' ' + size : '' }`}`,
        role: decorative ? 'presentation' : undefined
    } );

    return (
        <hr {...blockProps} />
    );
}
