import { InnerBlocks, useBlockProps  } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';

const TEMPLATE = [
    ['core/heading', { placeholder: 'Add heading...' }],
    ['core/paragraph', { placeholder: 'The start of something new!' }]
];

export default function Edit({ attributes }) {

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
