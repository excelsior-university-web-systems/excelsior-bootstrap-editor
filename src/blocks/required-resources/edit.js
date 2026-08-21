import { InnerBlocks, useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMinimumChildBlocks, preventLineBreaks } from '../../commons';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

const GROUP_BLOCK = XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group';
const MIN_GROUPS = 1;

export default function Edit( { attributes, setAttributes, clientId } ) {
    
    const { headingLevel, headingText, estimatedTime, contextContent } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const blockProps = useBlockProps({
        className: 'excelsior-required-resources',
    });

    useMinimumChildBlocks( {
        clientId,
        blockName: GROUP_BLOCK,
        minimum: MIN_GROUPS,
        isPreview,
    } );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title='Settings'>
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
                            />
                        </p>
                    </div>
                </div>
                <div class="context-content">
                    <RichText
                        tagName="p"
                        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec mauris luctus, sagittis lacus eget, volutpat tortor. Vivamus feugiat cursus nulla, vel commodo ipsum consequat ac..."
                        value={contextContent}
                        onChange={(value) => setAttributes({ contextContent: value })}
                        allowedFormats={['core/bold', 'core/italic', 'core/math', 'glyphwell/inline-equation"']}
                        multiline={false}
                        onKeyDown={preventLineBreaks}
                    />
                </div>
                <InnerBlocks
                    allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group']}
                    template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group']]}
                    templateLock={false}
                />
            </div>
        </div>
        </>
        
    );
}
