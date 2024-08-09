import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

export default function Edit( {attributes, setAttributes} ) {

    const {href, styleType, text} = attributes;
    const blockProps = useBlockProps({
        className: `btn ${styleType}`,
        rel: styleType === 'btn-resource' ? 'noopener' : undefined
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title='Settings'>
                    <TextControl
                        label='URL'
                        value={href}
                        onChange={(value) => setAttributes({ href: value.trim() })}
                    />
                    <SelectControl
                        label='Styles'
                        value={styleType}
                        options={[
                            { label: 'Internal', value: 'btn-internal' },
                            { label: 'Resource', value: 'btn-resource' },
                        ]}
                        onChange={(value) => setAttributes({ styleType: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <RichText
                {...blockProps}
                tagName="a"
                href={href}
                value={text}
                placeholder='Button Text'
                onChange={(value) => setAttributes({ text: value })}
                allowedFormats={[]}
            />
        </>
    );
}
