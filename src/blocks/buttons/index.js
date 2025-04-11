import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { buttons } from '@wordpress/icons';

registerBlockType( metadata, {
    icon: buttons,
    edit,
    save,
} );