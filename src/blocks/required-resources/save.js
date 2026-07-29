import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { headingLevel, estimatedTime, contextContent } = attributes;
    const blockProps = useBlockProps.save({
        className: 'excelsior-required-resources',
    });

    const HeadingTag = `h${headingLevel}`;

    return (
        <div {...blockProps}>
            <div class="context-container">
                <div class="context-header">
                    <div class="icon">
                        <i class="bi bi-check2-circle" aria-hidden="true">&nbsp;</i>
                    </div>
                    <div class="heading">
                        <HeadingTag className="title h5">Required Resources</HeadingTag>
                        <p class="estimated-time">Estimated Time: {estimatedTime}</p>
                    </div>
                </div>
                <div class="context-content">
                    <RichText.Content
                        tagName="p"
                        value={contextContent}
                    />
                </div>
                <InnerBlocks.Content />
            </div>
            
        </div>
    );
}
