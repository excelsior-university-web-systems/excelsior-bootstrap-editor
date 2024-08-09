import { InnerBlocks, InspectorControls, useBlockProps  } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';

const TEMPLATE = [
    ['core/heading', { placeholder: 'Add heading...' }],
    ['core/paragraph', { placeholder: 'The start of something new!' }]
];

export default function Edit({ attributes, setAttributes }) {

    const { additionalClass = '', backToTop } = attributes;

    const blockProps = useBlockProps({
        className: `page-container ${additionalClass ? additionalClass : ''} ${backToTop ? 'back-to-top' : ''}`.trim(),
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ToggleControl
                        label="Include back to top button"
                        checked={backToTop}
                        onChange={(value) => setAttributes({ backToTop: value })}
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
