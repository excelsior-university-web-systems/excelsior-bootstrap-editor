import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { styleType, buttonText, uniqueId } = attributes;
    const blockProps = useBlockProps.save( {
        className: `excelsior-collapsible ${styleType}`
    } );

    return (
        <div {...blockProps}>
            <div className='content'>
                <InnerBlocks.Content />
            </div>
            <a
                className="btn collapsed"
                href={'#' + uniqueId}
                role="button"
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls={uniqueId}
            >
                {buttonText} <i class="bi bi-chevron-down" aria-hidden="true"></i>
            </a>
        </div>
    );
}
