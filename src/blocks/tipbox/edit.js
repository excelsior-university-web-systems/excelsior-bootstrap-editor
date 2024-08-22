import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';

const TEMPLATE = [
    ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]
];

export default function Edit ({ attributes, setAttributes }) {

    const { styleType, narrowWidth } = attributes;

    const blockProps = useBlockProps( {
        className: `tip${styleType.length ? ' ' + styleType : ''}${narrowWidth ? ' w-75 mx-auto' : ''}`,
        role: 'alert'
    } );

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <SelectControl
                    label="Styles"
                    help="Tip is purple. Reminder is red. Note is blue. Please refer to the style guide for each style's use case."
                    value={styleType}
                    options={[
                        { label: 'Tip', value: '' },
                        { label: 'Reminder', value: 'tip-reminder' },
                        { label: 'Note', value: 'tip-note' },
                    ]}
                    onChange={(value) => setAttributes({ styleType: value })}
                />
                <ToggleControl
                    label="Narrow Width"
                    help="Toggle on to make the width shorter and center aligned."
                    checked={narrowWidth}
                    onChange={(value) => setAttributes({ narrowWidth: value })}
                />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
        
    );
}