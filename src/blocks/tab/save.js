import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { title, uniqueId } = attributes;
    const blockProps = useBlockProps.save({
        className: "tab-pane fade",
        role: "tabpanel"
    });

    return (
        <div {...blockProps} id={`${uniqueId}-pane`} aria-labelledby={`${uniqueId}-tab`}>
            <RichText.Content
                tagName="h2"
                className='h4'
                value={title}
            />
            <InnerBlocks.Content />
        </div>
    );
}
