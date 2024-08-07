import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
    ['core/heading', { placeholder: 'Add heading...' }],
    ['core/paragraph', { placeholder: 'The start of something new!' }]
];
const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading', 'excelsior-bootstrap/accordion'];

export default function Edit() {
    const blockProps = useBlockProps();
    return (
        <div {...blockProps}>
            <div id='excelsior-bootstrap'>
                <div className="page-container">
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        templateLock={false}
                        renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                    />
                </div>
            </div>
        </div>
    );
}
