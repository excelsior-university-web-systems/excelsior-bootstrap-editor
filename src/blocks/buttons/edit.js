import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit( { attributes } ) {

    const { cover } = attributes;

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
    }

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