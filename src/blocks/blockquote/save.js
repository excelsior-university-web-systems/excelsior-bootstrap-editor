import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { narrowWidth } = attributes;
    const blockProps = useBlockProps.save( {
        className: `excelsior-blockquote ${narrowWidth ? 'w-75 mx-auto' : ''}`
    } );

    return (
        <>
        <blockquote {...blockProps}>
            <InnerBlocks.Content />
        </blockquote>
        </>
        
    );
}
