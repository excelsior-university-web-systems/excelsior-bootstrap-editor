import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { url, alignment, caption, altText, mobileResponsive } = attributes;

    return (
        <>
        { 
            url && (altText.length || caption.length) ? (

                <figure {...useBlockProps.save({className: "figure"})}>
                    <img className={`figure-img${ mobileResponsive ? " img-fluid" : "" }`} src={url} alt={altText || ''} />
                    { caption && <figcaption className='figure-caption'>{caption}</figcaption> }
                </figure>

            ) : (

                <img {...useBlockProps.save({className: mobileResponsive ? "img-fluid" : ""})} src={url} alt="" role="presentation" />

            ) 
        }
        </>
    );
}
