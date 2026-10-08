import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Notice } from '@wordpress/components';
import metadata from './block.json';
import { preventLineBreaks } from '../../commons';
import { hasRichTextContent } from '../required-resources/validation';

export default function Edit( { attributes, setAttributes, clientId } ) {
    
    const { resource } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const isAdvanced = useSelect( ( select ) => {
        const editor = select( 'core/block-editor' );
        const groupId = editor.getBlockRootClientId( clientId );
        return editor.getBlockAttributes( groupId )?.mode === 'advanced';
    }, [ clientId ] );
    const blockProps = useBlockProps({
        className: 'list-group-item',
    });

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    const missingResource = isAdvanced && !hasRichTextContent( resource );
    const resourceErrorId = `required-resources-item-error-${ clientId }`;

    return (
        <>
        <div {...blockProps}>
            <RichText
                tagName='p'
                identifier="resource"
                aria-required={isAdvanced || undefined}
                aria-invalid={missingResource}
                aria-describedby={missingResource ? resourceErrorId : undefined}
                placeholder="Resource Name..."
                value={resource}
                onChange={(value) => setAttributes({ resource: value })}
                allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/math', 'glyphwell/inline-equation"']}
                multiline={false}
                onKeyDown={preventLineBreaks}
                onPaste={preventLineBreaks}
            />
            { missingResource && (
                <Notice id={resourceErrorId} status="error" isDismissible={false}>
                    Resource content is required.
                </Notice>
            ) }
        </div>
        </>
        
    );
}
