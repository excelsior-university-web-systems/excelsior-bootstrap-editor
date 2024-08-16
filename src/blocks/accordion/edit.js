import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

const ALLOWED_BLOCKS = [XCLSR_BTSTRP_EDITOR_PREFIX + '/accordion-item'];
const TEMPLATE = [
    [XCLSR_BTSTRP_EDITOR_PREFIX + '/accordion-item']
];

export default function Edit() {
    const blockProps = useBlockProps({
        className: 'accordion',
    });

    return (
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            />
        </div>
    );
}
