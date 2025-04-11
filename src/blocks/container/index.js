import { registerBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { layout } from '@wordpress/icons';

registerBlockType( metadata, {
    icon: layout,
    edit,
    save,
} );

// extends the core/group block but remove other layouts (row, stack, grid, etc.)
const withCustomGroupSettings = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        if ( props.name !== 'excelsior-bootstrap/container' ) {
            return <BlockEdit {...props} />;
        }

        return (
            <BlockEdit {...props} />
        );
    };
}, 'withCustomGroupSettings' );

addFilter(
    'editor.BlockEdit',
    'excelsior-bootstrap/container',
    withCustomGroupSettings
);