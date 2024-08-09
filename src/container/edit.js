import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';

const TEMPLATE = [
    ['core/heading', { placeholder: 'Add heading...' }],
    ['core/paragraph', { placeholder: 'The start of something new!' }]
];

export default function Edit({ attributes, setAttributes }) {
    const { additionalClass = "", backToTop = false } = attributes;

    const blockProps = useBlockProps({
        className: `page-container${backToTop ? ' back-to-top' : ''}${additionalClass ? ' ' + additionalClass : ''}`.trim(),
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ToggleControl
                        label="Back to top button"
                        help="Add a fixed-position button at the bottom right of the page to scroll long content back to the top."
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
