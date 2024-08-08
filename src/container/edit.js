import { InnerBlocks, useBlockProps, BlockControls  } from '@wordpress/block-editor';

const TEMPLATE = [
    ['core/heading', { placeholder: 'Add heading...' }],
    ['core/paragraph', { placeholder: 'The start of something new!' }]
];

const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph',  'excelsior-bootstrap/accordion'];

export default function Edit({ attributes, setAttributes }) {

    const { additionalClass = '' } = attributes;

    const blockProps = useBlockProps({
        className: `page-container ${additionalClass ? additionalClass : ''}`.trim(),
    });

    return (
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
    );
}
