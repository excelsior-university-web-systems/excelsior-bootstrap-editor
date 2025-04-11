import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { image } from '@wordpress/icons';

registerBlockType( metadata, {
    icon: image,
    edit,
    save,
} );