import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { preventLineBreaks, useMinimumChildBlocks } from '../../commons';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';
import { hasRichTextContent } from '../required-resources/validation';

const ITEM_BLOCK = XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group-item';

export default function Edit( { attributes, setAttributes, clientId } ) {
    const { mode = 'simple', contextContent } = attributes;
    const isAdvanced = mode === 'advanced';
    
    const previewImage = metadata?.example?.attributes?.cover || '';
    
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps({
        className: isAdvanced ? 'grouped-item' : 'list-group',
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

    const missingContext = isAdvanced && !hasRichTextContent( contextContent );
    const contextErrorId = `required-resources-context-error-${ clientId }`;

    const resources = (
        <InnerBlocks
            allowedBlocks={[ITEM_BLOCK]}
            template={[[ITEM_BLOCK]]}
            templateLock={false}
            renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
        />
    );

    return (
        <>
        <div {...blockProps}>
            { isAdvanced && (
                <div className="context-content">
                    <RichText
                        tagName="p"
                        identifier="contextContent"
                        aria-required="true"
                        aria-invalid={missingContext}
                        aria-describedby={missingContext ? contextErrorId : undefined}
                        aria-label="Group introduction"
                        placeholder="Group introduction..."
                        value={contextContent}
                        onChange={(value) => setAttributes({ contextContent: value })}
                        allowedFormats={['core/bold', 'core/italic', 'core/math', 'glyphwell/inline-equation"']}
                        multiline={false}
                        onKeyDown={preventLineBreaks}
                        onPaste={preventLineBreaks}
                    />
                </div>
            ) }
            { isAdvanced ? <div className="list-group">{resources}</div> : resources }
        </div>
        </>
        
    );
}
