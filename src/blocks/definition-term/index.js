import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { termDescription } from '@wordpress/icons';

registerBlockType(metadata, {
    icon: termDescription,
    edit,
    save,

    __experimentalLabel: ( attributes, { context } ) => {
        const { termName } = attributes;

        if (context === 'list-view' && termName) {
            return termName;
        }

        return metadata.title;

    },
});