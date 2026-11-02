import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { useMinimumChildBlocks } from '../../commons';
import metadata from './block.json';

const ITEM_BLOCK = XCLSR_BTSTRP_EDITOR_PREFIX + '/definition-term';

export default function Edit ( { attributes, setAttributes, clientId } ) {
    
    const previewImage = metadata?.example?.attributes?.cover || '';
    const { useIndentation } = attributes;

    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps({
        className: 'excelsior-definitions',
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

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <ToggleControl
                    label="Left Indent Definitions"
                    checked={useIndentation}
                    onChange={(value) => setAttributes({ useIndentation: value })}
                    __nextHasNoMarginBottom
                />
            </PanelBody>
        </InspectorControls>
        <dl {...blockProps}>
            <InnerBlocks
                allowedBlocks={[ITEM_BLOCK]}
                template={[[ITEM_BLOCK]]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </dl>
        </>
        
    );
}
