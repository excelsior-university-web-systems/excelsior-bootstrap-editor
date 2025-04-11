import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { mediaAndText } from '@wordpress/icons';

registerBlockType( metadata, {
    icon: mediaAndText,
    edit,
    save,
} );