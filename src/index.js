import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

registerBlockType('excelsior-bootstrap/editor', {
    title: __('Excelsior Bootstrap Editor', 'excelsior-bootstrap'),
    description: __('The main container block for Excelsior Bootstrap Editor.', 'excelsior-bootstrap'),
    category: 'layout',
    icon: 'layout',
    supports: {
        html: false,
    },
    edit,
    save,
    useOnce: true,
});
