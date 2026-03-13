import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { styleType } = attributes;
    const blockProps = useBlockProps.save( {
        className: `excelsior-collapsible mb-3 ${styleType}`
    } );

    return (
        <div {...blockProps}>
            <div className='content'>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
