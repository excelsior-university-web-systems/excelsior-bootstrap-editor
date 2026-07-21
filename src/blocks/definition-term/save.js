import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {

    const { termName } = attributes;
    
    const blockProps = useBlockProps.save( {
        className: 'definition-term'
    });

    return (
        <div {...blockProps}>
            <RichText.Content
                tagName="dt"
                className='term'
                value={termName}
            />
            <dd className='description'>
                <InnerBlocks.Content />
            </dd>
        </div>
    );
}
