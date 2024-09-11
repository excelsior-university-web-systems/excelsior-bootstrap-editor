import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit() {
    return (
        <p {...useBlockProps()}>
            <InnerBlocks
                allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/button']}
                template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/button']]}
                templateLock={false}
                orientation="horizontal"
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </p>
    );
}