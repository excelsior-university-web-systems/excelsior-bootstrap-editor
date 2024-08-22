import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';

const TEMPLATE = [
    ['core/paragraph']
];

export default function Edit() {
   
    const blockProps = useBlockProps( {
        className: 'col'
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
    );
}
