import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit( {attributes, setAttributes, context} ) {

    const { uniqueId } = attributes;
    const id = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/collapsibleContentId'];
    const blockProps = useBlockProps( {
        className: 'collapse-content'
    } );

    useEffect(() => {
        if (uniqueId !== id) {
            setAttributes({ uniqueId: id });
        }
    }, [id]);

    return (
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={[['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
    );
}
