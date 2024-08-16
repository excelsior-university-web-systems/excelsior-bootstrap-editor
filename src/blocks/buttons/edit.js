import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

const ALLOWED_BLOCKS = [XCLSR_BTSTRP_EDITOR_PREFIX + '/button'];
const TEMPLATE = [
    [XCLSR_BTSTRP_EDITOR_PREFIX + '/button']
];

export default function Edit() {
    return (
        <p {...useBlockProps()}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                orientation="horizontal"
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </p>
    );
}