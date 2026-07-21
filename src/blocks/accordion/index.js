import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { accordion } from '@wordpress/icons';

registerBlockType(metadata, {
    icon: accordion,
    edit,
    save,
});
