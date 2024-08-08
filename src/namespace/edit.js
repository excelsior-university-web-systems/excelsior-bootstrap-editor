import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [ ['excelsior-bootstrap/container' ] ];
const ALLOWED_BLOCKS = ['excelsior-bootstrap/container'];

export default function Edit() {

    return (
        <div {...useBlockProps()}>
            <div id='excelsior-bootstrap'>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={TEMPLATE}
                    templateLock='all'
                />
            </div>
        </div>
    );
}
