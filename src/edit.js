import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
    ['core/paragraph', { placeholder: 'Add another block here...' }]
];

const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading', 'core/image', 'core/group'];

export default function Edit() {
    const blockProps = useBlockProps({
        id: 'excelsior-bootstrap',
        className: 'page-container'
    });

    return (
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
            />
        </div>
    );
}
