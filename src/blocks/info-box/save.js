import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { styleType, narrowWidth } = attributes;
    const blockProps = useBlockProps.save( {
        className: `info-box${styleType.length ? ' ' + styleType : ''}${narrowWidth ? ' w-75 mx-auto' : ''}`,
        role: 'alert'
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
