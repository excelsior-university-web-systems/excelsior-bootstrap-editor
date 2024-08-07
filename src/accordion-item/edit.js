import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { title, content } = attributes;
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Accordion Item Settings">
                    <TextControl
                        label="Title"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <RichText
                    tagName="h4"
                    placeholder="Accordion Item Title"
                    value={title}
                    onChange={(value) => setAttributes({ title: value })}
                />
                <RichText
                    tagName="div"
                    multiline="p"
                    placeholder="Accordion Item Content"
                    value={content}
                    onChange={(value) => setAttributes({ content: value })}
                />
            </div>
        </>
    );
}
