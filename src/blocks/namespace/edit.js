import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit() {

    return (
        <div {...useBlockProps()}>
            <div id='excelsior-bootstrap'>
                <InnerBlocks
                    allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/container']}
                    template={[[XCLSR_BTSTRP_EDITOR_PREFIX + '/container' ]]}
                    templateLock='all'
                />
            </div>
        </div>
    );
}
