import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { imgUrl, imgAltText, useImg, bgColor } = attributes;
    const blockProps = useBlockProps.save( {
        className: 'col'
    } );

    return (
        <div {...blockProps}>
            <div class={`card h-100 ${bgColor}`}>
                { useImg ? (<img class="card-img-top" src={imgUrl} alt={imgAltText} />) : '' }
                <div class="card-body">
                <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
}
