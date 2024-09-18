import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit( {attributes} ) {

    const { cover } = attributes;
    
    const TEMPLATE = [
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/image', { alignment: "float-end ms-3 mb-1", mobileResponsive: false }],
        ['core/paragraph', { placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet accumsan arcu. Vestibulum nec nisi id urna tempor cursus. Nulla facilisi. Nullam eget lectus vel orci aliquam varius. Sed ac sapien id sapien gravida scelerisque sit amet ac libero." }]
    ];

    const blockProps = useBlockProps( {
        className: 'clearfix'
    } );

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
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
