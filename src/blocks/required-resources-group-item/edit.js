import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

export default function Edit( { attributes, setAttributes} ) {
    
    const { name, material } = attributes;
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
        <li {...blockProps}>
            <RichText
                tagName='p'
                placeholder="Chapter name..."
                value={name}
                onChange={(value) => setAttributes({ name: value })}
                allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/math', 'glyphwell/inline-equation"']}
            />
            <RichText
                tagName='p'
                placeholder="Material name..."
                className='secondary'
                value={material}
                onChange={(value) => setAttributes({ material: value })}
                allowedFormats={['core/math', 'glyphwell/inline-equation"']}
            />
        </li>
        </>
        
    );
}
