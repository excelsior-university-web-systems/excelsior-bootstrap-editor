import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit( {attributes} ) {

    const { cover } = attributes;
    const blockProps = useBlockProps( {
        className: 'list-group list-group-flush'
    } );

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
    }

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
