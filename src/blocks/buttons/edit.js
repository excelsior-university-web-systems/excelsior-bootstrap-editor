import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = ['excelsior-bootstrap/button'];
const TEMPLATE = [
    ['excelsior-bootstrap/button']
];

export default function Edit() {
    return (
        <p {...useBlockProps()}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                orientation="horizontal"
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </p>
    );
}