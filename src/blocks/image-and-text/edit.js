import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

const TEMPLATE = [
    [XCLSR_BTSTRP_EDITOR_PREFIX + '/image', { alignment: "float-end ms-3 mb-1", mobileResponsive: false }],
    ['core/paragraph', { placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet accumsan arcu. Vestibulum nec nisi id urna tempor cursus. Nulla facilisi. Nullam eget lectus vel orci aliquam varius. Sed ac sapien id sapien gravida scelerisque sit amet ac libero." }]
];

export default function Edit() {

    const blockProps = useBlockProps( {
        className: 'clearfix'
    } );

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
