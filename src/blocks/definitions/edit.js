import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

export default function Edit ( { attributes, setAttributes } ) {
    
    const previewImage = metadata?.example?.attributes?.cover || '';
    const { useIndentation } = attributes;

    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps({
        className: 'excelsior-definitions',
    });

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
                allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/definition-term']}
                template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/definition-term']]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </dl>
        </>
        
    );
}
