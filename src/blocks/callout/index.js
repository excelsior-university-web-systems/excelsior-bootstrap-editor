import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { pullquote } from '@wordpress/icons';

registerBlockType( metadata, {
    icon: pullquote,
    edit,
    save,
} );