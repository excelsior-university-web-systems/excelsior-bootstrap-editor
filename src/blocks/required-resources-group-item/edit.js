import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

export default function Edit( { attributes, setAttributes} ) {
    
    const { resource, source } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const blockProps = useBlockProps({
        className: 'list-group-item',
    });

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <div {...blockProps}>
            <RichText
                tagName='p'
                placeholder="Resource Name..."
                value={resource}
                onChange={(value) => setAttributes({ resource: value })}
                allowedFormats={['core/italic', 'core/link', 'core/math', 'glyphwell/inline-equation"']}
            />
            <RichText
                tagName='p'
                placeholder="Source Name..."
                className='secondary'
                value={source}
                onChange={(value) => setAttributes({ source: value })}
                allowedFormats={['core/math', 'glyphwell/inline-equation"']}
            />
        </div>
        </>
        
    );
}
