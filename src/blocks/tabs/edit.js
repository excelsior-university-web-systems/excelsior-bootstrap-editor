import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit() {

    const blockProps = useBlockProps({
        className: 'excelsior-tabs',
    });

    return (
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/tab']}
                template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/tab']]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
    );
}
