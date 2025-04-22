import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {

    const { title, uniqueId, open, HeadingLevel, headingSize } = attributes;
    const blockProps = useBlockProps.save( {
        className: 'accordion-item'
    });

    return (
        <div {...blockProps}>
            <HeadingLevel className={`accordion-header ${headingSize}`}>
            <RichText.Content
                tagName="a"
                value={title}
                className={open ? 'accordion-button' : 'accordion-button collapsed'}
                role='button'
                aria-controls={uniqueId}
                aria-expanded={open}
                data-bs-toggle="collapse"
                data-bs-target={'#' + uniqueId}
            />
            </HeadingLevel>
            <div id={uniqueId} class={`accordion-collapse collapse ${open ? 'show' : ''}`}>
                <div class="accordion-body">
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
}
