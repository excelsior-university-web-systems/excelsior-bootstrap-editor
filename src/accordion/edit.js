import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = ['excelsior-bootstrap/accordion-item'];
const TEMPLATE = [
    ['excelsior-bootstrap/accordion-item']
];

export default function Edit() {
    const blockProps = useBlockProps({
        className: 'accordion',
    });

    return (
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            />
        </div>
    );
}
