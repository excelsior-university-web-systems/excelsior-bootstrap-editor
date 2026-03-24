import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

export default function Edit( {attributes} ) {

    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    
    const TEMPLATE = [
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/image', { alignment: "float-end ms-3", mobileResponsive: false }],
        ['core/paragraph', { placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet accumsan arcu. Vestibulum nec nisi id urna tempor cursus. Nulla facilisi. Nullam eget lectus vel orci aliquam varius. Sed ac sapien id sapien gravida scelerisque sit amet ac libero." }]
    ];

    const blockProps = useBlockProps( {
        className: 'clearfix'
    } );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={TEMPLATE}
                    templateLock={false}
                />
            </div>
        </>
    );
}
