import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { tabPanel } from '@wordpress/icons';

registerBlockType(metadata, {
    icon: tabPanel,
    edit,
    save,
});