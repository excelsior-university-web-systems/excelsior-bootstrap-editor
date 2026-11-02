import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { imgUrl, imgAltText, useImg, enlargeable, bgColor, aspectRatio } = attributes;
    const blockProps = useBlockProps.save( {
        className: 'col'
    } );

    return (
        <div {...blockProps}>
            <div class={`card h-100 ${bgColor}`}>
                { useImg ? (
                    <>
                    { enlargeable ? (
                        <div className="figure w-full enlargeable mb-0">
                            <div className={`ratio ratio-${aspectRatio}`}>
                                <img className="card-img-top object-fit-cover" src={imgUrl} alt={imgAltText} />
                            </div>
                        </div>
                    ) : (
                        <div className={`ratio ratio-${aspectRatio}`}>
                            <img className="card-img-top object-fit-cover" src={imgUrl} alt={imgAltText} />
                        </div>
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
