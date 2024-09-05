import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {

    const blockProps = useBlockProps.save( {
        className: 'start-here-banner'
    } );

    return (
        <div {...blockProps}>
            <div className='col offset-md-5'>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
