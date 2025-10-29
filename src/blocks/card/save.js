import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { imgUrl, imgAltText, useImg, enlargeable, bgColor } = attributes;
    const blockProps = useBlockProps.save( {
        className: 'col'
    } );

    return (
        <div {...blockProps}>
            <div class={`card h-100 ${bgColor}`}>
                { useImg ? (
                    <>
                    { enlargeable ? (
                        <div class="figure w-full enlargeable mb-0">
                            <img class="card-img-top" src={imgUrl} alt={imgAltText} />
                        </div>
                    ) : (
                        <img class="card-img-top" src={imgUrl} alt={imgAltText} />
                    )}
                    </>
                    
                ) : '' }
                <div class="card-body">
                <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
}
