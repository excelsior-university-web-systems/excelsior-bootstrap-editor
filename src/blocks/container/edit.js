import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';

const TEMPLATE = [
    ['core/heading', { placeholder: 'Add heading...' }],
    ['core/paragraph', { placeholder: 'The start of something new!' }]
];

export default function Edit( { attributes, setAttributes } ) {
    const { backToTop, mainLandmarkRole } = attributes;

    const blockProps = useBlockProps( {
        className: `page-container${backToTop ? ' back-to-top' : ''}`.trim(),
        role: mainLandmarkRole ? 'main' : undefined,
    } );

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
                    <ToggleControl
                        label="Main ARIA landmark role"
                        help="Add role='main' to the container to identify it as the primary content for screen readers. Avoid adding it if the platform (e.g., Canvas) already defines a main role landmark."
                        checked={mainLandmarkRole}
                        onChange={(value) => setAttributes({ mainLandmarkRole: value })}
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
