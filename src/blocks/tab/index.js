import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata, {
    icon: {
        src: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" focusable="false"><path d="M5 11.25h14v1.5H5z"></path></svg>
    },
    edit,
    save,
});