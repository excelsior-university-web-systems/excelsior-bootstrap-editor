import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit( { attributes, setAttributes} ) {
    
    const { accordionHeadingLevel, accordionHeadingSize, cover } = attributes;
    const blockProps = useBlockProps({
        className: 'accordion',
    });

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title='Settings'>
                <SelectControl
                    label="Heading Level"
                    help="The heading level of the accordion item."
                    value={accordionHeadingLevel}
                    options={[
                        { label: 'H2', value: 'h2' },
                        { label: 'H3', value: 'h3' },
                        { label: 'H4', value: 'h4' },
                        { label: 'H5', value: 'h5' },
                        { label: 'H6', value: 'h6' },
                    ]}
                    onChange={(value) => setAttributes({ accordionHeadingLevel: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
                <SelectControl
                    label="Heading Level Size"
                    help="Set the font size of the heading to use the size of a different heading level."
                    value={accordionHeadingSize}
                    options={[
                        { label: 'H1', value: 'h1' },
                        { label: 'H2', value: 'h2' },
                        { label: 'H3', value: 'h3' },
                        { label: 'H4', value: 'h4' },
                        { label: 'H5', value: 'h5' },
                        { label: 'H6', value: 'h6' },
                    ]}
                    onChange={(value) => setAttributes({ accordionHeadingSize: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/accordion-item']}
                template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/accordion-item']]}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
        
    );
}
