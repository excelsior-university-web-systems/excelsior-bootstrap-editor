import { registerBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata, {
    icon: {
        src: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" focusable="false"><path d="M18 5.5H6a.5.5 0 00-.5.5v3h13V6a.5.5 0 00-.5-.5zm.5 5H10v8h8a.5.5 0 00.5-.5v-7.5zm-10 0h-3V18a.5.5 0 00.5.5h2.5v-8zM6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"></path></svg>
    },
    edit,
    save,
});

// extends the core/group block but remove other layouts (row, stack, grid, etc.)
const withCustomGroupSettings = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'excelsior-bootstrap/container') {
            return <BlockEdit {...props} />;
        }

        return (
            <BlockEdit {...props} />
        );
    };
}, 'withCustomGroupSettings');

addFilter(
    'editor.BlockEdit',
    'excelsior-bootstrap/container',
    withCustomGroupSettings
);