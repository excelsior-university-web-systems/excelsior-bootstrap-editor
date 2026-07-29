import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

export default function Edit() {
    
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const blockProps = useBlockProps({
        className: 'list-group',
    });

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <ul {...blockProps}>
            <InnerBlocks
                allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group-item']}
                template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group-item']]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </ul>
        </>
        
    );
}
