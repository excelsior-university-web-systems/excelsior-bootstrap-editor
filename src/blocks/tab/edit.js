import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { generateHtmlId, removeScriptTags } from '../../commons';
import { ALLOWED_BLOCKS } from './allowed-blocks';

export default function Edit({ attributes, setAttributes, context }) {
    const { title, uniqueId, isActive } = attributes;
    const blockProps = useBlockProps( {
        className: "tab-pane",
        role: "tabpanel"
    } );

    const activeTab = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/activeTab'];

    useEffect(() => {

        if (!uniqueId) {
            setAttributes({ uniqueId: generateHtmlId() });
        }

        if ( activeTab === uniqueId ) {
            setAttributes({ isActive: true });
        }

    }, [uniqueId, activeTab]);

    return (
        <div {...blockProps} id={`${uniqueId}-pane`} aria-labelledby={`${uniqueId}-tab`}>
            <RichText
                tagName='p'
                placeholder="Tab Title"
                className='fw-bold text-body-secondary'
                value={title}
                onChange={(value) => setAttributes({ title: removeScriptTags(value) })}
                allowedFormats={[XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
            />
            <InnerBlocks template={[['core/heading', {headingSizeClass: "h4"}],['core/paragraph']]} allowedBlocks={ALLOWED_BLOCKS} templateLock={false} />
        </div>
    );
}
