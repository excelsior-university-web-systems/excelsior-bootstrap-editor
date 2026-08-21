import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { headingLevel, headingText, estimatedTime, contextContent } = attributes;
    const blockProps = useBlockProps.save({
        className: 'excelsior-required-resources',
    });

    return (
        <div {...blockProps}>
            <div class="context-container">
                <div class="context-header">
                    <div class="icon">
                        <i class="bi bi-check2-circle" aria-hidden="true"></i>
                    </div>
                    <div class="heading">
                        <RichText.Content
                            tagName={headingLevel}
                            value={headingText}
                            className='title h5'
                        />
                        { estimatedTime && (
                            <p class="estimated-time">Estimated Time: {estimatedTime}</p>
                        )}
                    </div>
                </div>
                { contextContent && (
                    <div class="context-content">
                        <RichText.Content
                            tagName="p"
                            value={contextContent}
                        />
                    </div>
                )}
                <InnerBlocks.Content />
            </div>
            
        </div>
    );
}
