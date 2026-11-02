import { useBlockProps } from "@wordpress/block-editor";
import { isValidUrl } from '../../commons';

export default function Save({ attributes }) {
    const { url, alignmentEnabled, alignment, alignmentSize, centerAlignment, repositioned, order, caption, altText, sourceUrl, mobileResponsive, useDiv, enlargeable } = attributes;

    if (!url) return null;

    const hasCaption = !!caption;
    const hasAltText = !!altText;
    const hasSourceUrl = !!sourceUrl;

    const alignmentClass = alignmentEnabled && alignment && alignmentSize ? `${alignment} ${alignmentSize}` : "";
    const orderClass = alignmentEnabled && repositioned ? `order-${order}` : '';
    const centerClass = centerAlignment ? "center-aligned" : "";
    const fluidClass = mobileResponsive ? "img-fluid" : "";
    const marginBottomClass = !useDiv ? "mb-3" : "";
    const enlargeableClass = enlargeable ? "enlargeable" : "";
    const baseClasses = `${marginBottomClass} ${alignmentClass} ${orderClass} ${centerClass}`.trim();

    if (hasAltText || hasCaption || hasSourceUrl || enlargeable) {
        if (useDiv) {
            return (
                <div {...useBlockProps.save({ className: `figure ${baseClasses} ${enlargeableClass}`.trim() })}>
                    <img className={`figure-img ${fluidClass}`.trim()} src={url} alt={altText || ""} />
                </div>
            );
        }
        return (
            <figure {...useBlockProps.save({ className: `figure ${baseClasses} ${enlargeableClass}`.trim() })}>
                <img className={`figure-img ${fluidClass}`.trim()} src={url} alt={altText || ""} />
                { ( hasCaption || hasSourceUrl ) && <figcaption className='figure-caption'>
                    {hasCaption && <p>{caption}</p>}
                    {hasSourceUrl && <p>Source: <cite>
                            {isValidUrl(sourceUrl) ? (
                            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                            {sourceUrl}
                            </a>
                        ) : (
                            sourceUrl
                        )}    
                    </cite></p>}
                </figcaption> }
            </figure>
        );
    }

    return <img {...useBlockProps.save({ className: `${fluidClass} ${baseClasses}`.trim() })} src={url} alt='' />;

}
