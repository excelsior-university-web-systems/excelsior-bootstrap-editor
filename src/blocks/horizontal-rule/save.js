import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { selectedIcon, size, decorative } = attributes;
    const blockProps = useBlockProps.save( {
        className: `decorative bi ${selectedIcon}${size !== 'regular' ? ' ' + size : '' }`,
        role: decorative ? 'presentation' : undefined
    } );

    return (
        <hr {...blockProps} />
    );
}
