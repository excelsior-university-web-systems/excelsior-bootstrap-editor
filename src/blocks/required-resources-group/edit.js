import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMinimumChildBlocks } from '../../commons';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

const ITEM_BLOCK = XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group-item';

export default function Edit( { clientId } ) {
    
    const previewImage = metadata?.example?.attributes?.cover || '';
    
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps({
        className: 'list-group',
    });

    useMinimumChildBlocks( {
        clientId,
        blockName: ITEM_BLOCK,
        minimum: 1,
        isPreview,
    } );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={[ITEM_BLOCK]}
                template={[[ITEM_BLOCK]]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
        
    );
}
