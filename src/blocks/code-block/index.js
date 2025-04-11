import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { code } from '@wordpress/icons';

registerBlockType( metadata, {
    icon: code,
    edit,
    save,
} );