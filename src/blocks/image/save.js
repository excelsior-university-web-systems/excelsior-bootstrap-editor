import { useBlockProps } from "@wordpress/block-editor";

export default function Save({ attributes }) {
    const { url, alignment, alignmentSize, centerAlignment, caption, altText, mobileResponsive } = attributes;

    if (!url) return null;

    const hasCaption = !!caption;
    const hasAltText = !!altText;

    const alignmentClass = alignment && alignmentSize ? `${alignment} ${alignmentSize}` : "";
    const centerClass = centerAlignment ? "center-aligned" : "";
    const fluidClass = mobileResponsive ? "img-fluid" : "";
    const baseClasses = `mb-3 ${alignmentClass} ${centerClass}`.trim();

    if (hasAltText || hasCaption) {
        return (
            <figure {...useBlockProps.save({ className: `figure ${baseClasses}`.trim() })}>
                <img className={`figure-img ${fluidClass}`.trim()} src={url} alt={altText || ""} />
                {hasCaption && <figcaption className='figure-caption'>{caption}</figcaption>}
            </figure>
        );
    }

    return <img {...useBlockProps.save({ className: `${fluidClass} ${baseClasses}`.trim() })} src={url} alt='' />;
}
