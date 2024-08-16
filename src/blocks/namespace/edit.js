import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

const TEMPLATE = [ [XCLSR_BTSTRP_EDITOR_PREFIX + '/container' ] ];
const ALLOWED_BLOCKS = [XCLSR_BTSTRP_EDITOR_PREFIX + '/container'];

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
