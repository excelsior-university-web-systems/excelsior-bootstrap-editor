import { InnerBlocks, useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl, __experimentalHeading as Heading } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

export default function Edit( { attributes, setAttributes} ) {
    
    const { headingLevel, estimatedTime, contextContent } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );
    const blockProps = useBlockProps({
        className: 'excelsior-required-resources',
    });

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
                        { label: 'H2', value: '2' },
                        { label: 'H3', value: '3' },
                        { label: 'H4', value: '4' },
                        { label: 'H5', value: '5' },
                        { label: 'H6', value: '6' },
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
                        <i class="bi bi-check2-circle" aria-hidden="true">&nbsp;</i>
                    </div>
                    <div class="heading">
                        <Heading level={ headingLevel } className="title h5">Required Resources</Heading>
                        <p class="estimated-time">Estimated Time:&nbsp;
                            <RichText
                                tagName="span"
                                placeholder="5 to 10 minutes"
                                value={estimatedTime}
                                onChange={(value) => setAttributes({ estimatedTime: value })}
                                allowedFormats={[]}
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
                    />
                </div>
                <InnerBlocks
                    allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group']}
                    template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group']]}
                    templateLock="all"
                />
            </div>
        </div>
        </>
        
    );
}
