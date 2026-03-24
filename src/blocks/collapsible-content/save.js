import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save( {attributes} ) {

    const { uniqueId, buttonText } = attributes;
    const blockProps = useBlockProps.save( {
        className: 'collapse mt-3'
    } );

    return (
        <>
        <a id={`btn-${uniqueId}`}
            className="btn collapsed"
            href={'#' + uniqueId}
            role="button"
            data-bs-toggle="collapse"
            aria-expanded="false"
            aria-controls={uniqueId}
        >
            Show <span className='btn-label'>{buttonText}</span>
            <i class="bi bi-chevron-down" aria-hidden="true"></i>
        </a>
        <div {...blockProps} id={uniqueId} role="region" aria-labelledby={`btn-${uniqueId}`}>
            <InnerBlocks.Content />
        </div>
        </>
    );
}
