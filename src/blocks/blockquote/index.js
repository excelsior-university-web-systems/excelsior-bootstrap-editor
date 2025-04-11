import { registerBlockType } from '@wordpress/blocks';
import { quote } from '@wordpress/icons';
import edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata, {
    icon: quote,
    edit,
    save,
} );