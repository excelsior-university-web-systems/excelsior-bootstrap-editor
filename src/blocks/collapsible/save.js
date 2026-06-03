import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {
    const blockProps = useBlockProps.save( {
        className: `excelsior-collapsible mb-3`
    } );

    return (
        <div {...blockProps}>
            <div className='content'>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
