import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { postFeaturedImage } from '@wordpress/icons';

registerBlockType( metadata, {
    icon: postFeaturedImage,
    edit,
    save,
} );