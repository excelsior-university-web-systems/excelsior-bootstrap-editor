import { InnerBlocks, useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect, useRegistry } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { plus } from '@wordpress/icons';
import { useMinimumChildBlocks, preventLineBreaks } from '../../commons';
import metadata from './block.json';
import { convertRequiredResources, GROUP_BLOCK } from './mode';

const MIN_GROUPS = 1;
const ITEM_BLOCK = GROUP_BLOCK + '-item';

export default function Edit( { attributes, setAttributes, clientId } ) {
    
    const { mode = 'simple', headingLevel, headingText, estimatedTime, contextContent } = attributes;
    const isAdvanced = mode === 'advanced';
    const registry = useRegistry();
    const { replaceBlocks, insertBlocks, updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = useDispatch( 'core/block-editor' );
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const blockProps = useBlockProps({
        className: 'excelsior-required-resources',
    });

    const groups = useMinimumChildBlocks( {
        clientId,
        blockName: GROUP_BLOCK,
        minimum: MIN_GROUPS,
        isPreview,
    } );

    useEffect( () => {
        if ( isPreview ) {
            return;
        }
        const mismatchedGroups = groups.filter( ( group ) => ( group.attributes.mode || 'simple' ) !== mode );
        if ( mismatchedGroups.length ) {
            registry.batch( () => {
                __unstableMarkNextChangeAsNotPersistent();
                updateBlockAttributes( mismatchedGroups.map( ( group ) => group.clientId ), { mode } );
            } );
        }
    }, [ groups, mode, isPreview, registry, updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent ] );

    const changeMode = ( advanced ) => {
        const nextMode = advanced ? 'advanced' : 'simple';
        if ( nextMode === mode ) {
            return;
        }
        const block = registry.select( 'core/block-editor' ).getBlock( clientId );
        // One replacement keeps the mode and converted content in the same undo step.
        replaceBlocks( clientId, [ convertRequiredResources( block, nextMode ) ] );
    };

    const resourceGroups = (
        <InnerBlocks
            allowedBlocks={[GROUP_BLOCK]}
            template={[[GROUP_BLOCK, { mode }]]}
            templateLock={false}
            renderAppender={isAdvanced ? false : undefined}
        />
    );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title='Settings'>
                <ToggleControl
                    label="Advanced Mode"
                    checked={isAdvanced}
                    onChange={changeMode}
                    __nextHasNoMarginBottom
                />
                <SelectControl
                    label="Heading Level"
                    value={headingLevel}
                    options={[
                        { label: 'H2', value: 'h2' },
                        { label: 'H3', value: 'h3' },
                        { label: 'H4', value: 'h4' },
                        { label: 'H5', value: 'h5' },
                        { label: 'H6', value: 'h6' },
                    ]}
                    onChange={(value) => setAttributes({ headingLevel: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <div class="context-container">
                <div class="context-header">
                    <div class="icon">
                        <i class="bi bi-check2-circle" aria-hidden="true"></i>
                    </div>
                    <div class="heading">
                        <RichText
                            tagName={headingLevel}
                            value={headingText}
                            className='title h5'
                            onChange={(value) => setAttributes({ headingText: value })}
                            allowedFormats={[]}
                            multiline={false}
                            onKeyDown={preventLineBreaks}
                            onPaste={preventLineBreaks}
                        />
                        <p class="estimated-time">Estimated Time:&nbsp;
                            <RichText
                                tagName="span"
                                placeholder="5 to 10 minutes"
                                value={estimatedTime}
                                onChange={(value) => setAttributes({ estimatedTime: value })}
                                allowedFormats={[]}
                                multiline={false}
                                onKeyDown={preventLineBreaks}
                                onPaste={preventLineBreaks}
                            />
                        </p>
                    </div>
                </div>
                { !isAdvanced && <div class="context-content">
                    <RichText
                        tagName="p"
                        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec mauris luctus, sagittis lacus eget, volutpat tortor. Vivamus feugiat cursus nulla, vel commodo ipsum consequat ac..."
                        value={contextContent}
                        onChange={(value) => setAttributes({ contextContent: value })}
                        allowedFormats={['core/bold', 'core/italic', 'core/math', 'glyphwell/inline-equation"']}
                        multiline={false}
                        onKeyDown={preventLineBreaks}
                        onPaste={preventLineBreaks}
                    />
                </div> }
                { isAdvanced ? <div className="grouped-resources">{resourceGroups}</div> : resourceGroups }
            </div>
            { isAdvanced && (
                <div className="required-resources-group-actions">
                    <Button
                        variant="secondary"
                        icon={plus}
                        onClick={() => insertBlocks(
                            createBlock( GROUP_BLOCK, { mode: 'advanced' }, [ createBlock( ITEM_BLOCK ) ] ),
                            registry.select( 'core/block-editor' ).getBlockOrder( clientId ).length,
                            clientId
                        )}
                    >
                        Add Resource Group
                    </Button>
                </div>
            ) }
        </div>
        </>
        
    );
}
