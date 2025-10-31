import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {

    const { uniqueId, animation, slides } = attributes;

    const blockProps = useBlockProps.save({
        className: `carousel slide ${animation == 'carousel-fade' ? 'carousel-fade' : '' } `.trim(),
        id: uniqueId,
        role: 'region',
        'aria-roledescription': 'carousel'
    });

    return (
        <div {...blockProps}>
            <div className="carousel-indicators">
                {slides.map((_slide, index) => (
                    <a 
                        href={`#${uniqueId}`}
                        role="button"
                        data-bs-target={`#${uniqueId}`}
                        data-bs-slide-to={index}
                        className={`${index === 0 ? 'active' : ''}`}
                        aria-current={`${index === 0 ? 'true' : ''}`}>
                        <span className="visually-hidden">Slide {index + 1}</span>
                    </a>
                ))}
            </div>

            <div className="carousel-inner" aria-live="polite">
                <InnerBlocks.Content />
            </div>
            <a href={`#${uniqueId}`} className="carousel-control-prev" role="button" data-bs-target={`#${uniqueId}`}
                data-bs-slide="prev" aria-label="Previous slide">
                <span className="carousel-control-prev-icon" aria-hidden="true">&nbsp;</span>
                <span className="visually-hidden">Previous Slide</span>
            </a>
            <a href={`#${uniqueId}`} className="carousel-control-next" role="button" data-bs-target={`#${uniqueId}`}
                data-bs-slide="next" aria-label="Next slide">
                <span className="carousel-control-next-icon" aria-hidden="true">&nbsp;</span>
                <span className="visually-hidden">Next Slide</span>
            </a>
        </div>
    );
}
