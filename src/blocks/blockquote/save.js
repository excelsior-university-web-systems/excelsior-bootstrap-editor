import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { hasSource, source, narrowWidth } = attributes;
    const blockProps = useBlockProps.save( {
        className: `${!hasSource ? 'excelsior-blockquote' : ''} ${narrowWidth ? 'w-75 mx-auto' : ''}`
    } );

    return (
        <>
        { hasSource && source.length ? 
            <figure {...blockProps}>
                <blockquote className='excelsior-blockquote'>
                    <InnerBlocks.Content />
                </blockquote>
                <figcaption class="excelsior-blockquote-footer">
                {source}
                </figcaption>
            </figure>
        : (
            <blockquote {...blockProps}>
                <InnerBlocks.Content />
            </blockquote>
        ) }
        </>
        
    );
}
