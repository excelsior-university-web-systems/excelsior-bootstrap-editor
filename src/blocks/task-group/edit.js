import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit() {

    const blockProps = useBlockProps( {
        className: 'list-group list-group-flush'
    } );

    return (
        <ul {...blockProps}>
            <InnerBlocks
                allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/task']}
                template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/task']]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </ul>
    );
}
