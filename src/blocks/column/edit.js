import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';

export default function Edit() {
   
    const blockProps = useBlockProps( {
        className: 'col'
    } );

    return (
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={[['core/paragraph']]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
    );
}
