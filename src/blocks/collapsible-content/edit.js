import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { preventLineBreaks } from '../../commons';

export default function Edit( {attributes, setAttributes, context} ) {

    const { uniqueId, buttonText } = attributes;
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
        <>
        
        <div {...blockProps}>
            <div id={`btn-${uniqueId}`} className="btn btn-sm mb-3" href={'#'+uniqueId}>
            <RichText
                className="btn-label"
                tagName="span"
                value={buttonText}
                placeholder='enter button name...'
                onChange={(value) => setAttributes({ buttonText: value })}
                multiline={false}
                onKeyDown={preventLineBreaks}
            />
            &nbsp;
            <i class="bi bi-chevron-up" aria-hidden="true"></i>
        </div>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={[['core/paragraph']]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
    );
}