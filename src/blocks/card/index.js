import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { page } from '@wordpress/icons';

registerBlockType( metadata, {
    icon: page,
    edit,
    save,
} );