import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import './editor.css';

import { registerBlockType } from '@wordpress/blocks';
import { table } from '@wordpress/icons';
import edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata, {
	icon: table,
	edit,
	save,
} );
