import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    const { mode = 'simple', contextContent } = attributes;

    const blockProps = useBlockProps.save({
        className: mode === 'advanced' ? 'grouped-item' : 'list-group',
    });

    if ( mode === 'advanced' ) {
        return (
            <div {...blockProps}>
                <div className="context-content">
                    <RichText.Content tagName="p" value={contextContent} />
                </div>
                <ul className="list-group"><InnerBlocks.Content /></ul>
            </div>
        );
    }

    return (
        <ul {...blockProps}>
            <InnerBlocks.Content />
        </ul>
    );
}
