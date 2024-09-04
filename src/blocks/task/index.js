import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata, {
    icon: {
        src: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path d="M18,18.75h12v-2.25h-12v2.25ZM14.19,12.77l-4.85,6.55-2.54-1.93-.69.92,3.47,2.62,5.54-7.47-.92-.69Z"/></svg>
    },
    edit,
    save,
} );