export const TABLE_BORDERED = 'table-bordered';
export const TABLE_BORDERLESS = 'table-borderless';
export const DEFAULT_COLUMN_WIDTH = 160;
export const DEFAULT_COLUMN_COUNT = 3;
export const DEFAULT_ROW_COUNT = 3;

/*
  Bootstrap ships table variants designed for tr/th/td, so row, column, and cell
  colors are stored as class names rather than inline styles.

  The "preview" value is only used to tint cells inside the Jspreadsheet grid,
  which can take inline styles but not classes. It points at Bootstrap's own
  custom properties so the editor preview tracks the framework (and its dark
  mode overrides) instead of hardcoding hex values. The "-bg-subtle" properties
  hold the same values the matching .table-* class assigns to --bs-table-bg.
*/
export const TABLE_VARIANTS = [
	{ label: 'None', className: '', preview: '' },
	{
		label: 'Light',
		className: 'table-light',
		preview: 'background-color: var(--bs-light); color: #000',
	},
	{
		label: 'Primary',
		className: 'table-primary',
		preview: 'background-color: var(--bs-primary-bg-subtle); color: #000',
	},
	{
		label: 'Secondary',
		className: 'table-secondary',
		preview: 'background-color: var(--bs-secondary-bg-subtle); color: #000',
	},
	{
		label: 'Success',
		className: 'table-success',
		preview: 'background-color: var(--bs-success-bg-subtle); color: #000',
	},
	{
		label: 'Danger',
		className: 'table-danger',
		preview: 'background-color: var(--bs-danger-bg-subtle); color: #000',
	},
	{
		label: 'Warning',
		className: 'table-warning',
		preview: 'background-color: var(--bs-warning-bg-subtle); color: #000',
	},
	{
		label: 'Info',
		className: 'table-info',
		preview: 'background-color: var(--bs-info-bg-subtle); color: #000',
	},
	{
		label: 'Dark',
		className: 'table-dark',
		preview: 'background-color: var(--bs-dark); color: var(--bs-light)',
	},
	{
		label: 'Highlight',
		className: 'table-active',
		preview: 'background-color: rgba(var(--bs-emphasis-color-rgb), 0.1)',
	},
];

const VARIANT_CLASS_NAMES = TABLE_VARIANTS.map(
	( variant ) => variant.className
);

const VARIANT_PREVIEWS = TABLE_VARIANTS.reduce( ( previews, variant ) => {
	if ( variant.className ) {
		previews[ variant.className ] = variant.preview;
	}

	return previews;
}, {} );

/*
  Bootstrap's .table-bordered reads --bs-border-width, and the table variants
  read --bs-table-border-color, so border thickness and color can be set once on
  the table element and cascade to every cell.
*/
export const BORDER_COLORS = [
	{ label: 'Default', value: '' },
	{ label: 'Primary', value: 'var(--bs-primary)' },
	{ label: 'Secondary', value: 'var(--bs-secondary)' },
	{ label: 'Success', value: 'var(--bs-success)' },
	{ label: 'Danger', value: 'var(--bs-danger)' },
	{ label: 'Warning', value: 'var(--bs-warning)' },
	{ label: 'Info', value: 'var(--bs-info)' },
	{ label: 'Dark', value: 'var(--bs-dark)' },
	{ label: 'Light', value: 'var(--bs-light)' },
];

export const MAX_BORDER_WIDTH = 5;

export const getBootstrapTableClasses = ( {
	border = TABLE_BORDERED,
	isStriped = false,
	isCompact = false,
} = {} ) =>
	[
		'table',
		border === TABLE_BORDERLESS ? TABLE_BORDERLESS : TABLE_BORDERED,
		isStriped ? 'table-striped' : '',
		isCompact ? 'table-sm' : '',
	].filter( Boolean );

export const getColumnName = ( index ) => {
	let columnNumber = Number( index ) + 1;
	let columnName = '';

	while ( columnNumber > 0 ) {
		const remainder = ( columnNumber - 1 ) % 26;
		columnName = String.fromCharCode( 65 + remainder ) + columnName;
		columnNumber = Math.floor( ( columnNumber - remainder ) / 26 );
	}

	return columnName;
};

export const getCellName = ( columnIndex, rowIndex ) =>
	`${ getColumnName( columnIndex ) }${ Number( rowIndex ) + 1 }`;

export const getCoordsFromCellName = ( cellName ) => {
	const match = /^([A-Z]+)([0-9]+)$/i.exec( cellName || '' );

	if ( ! match ) {
		return null;
	}

	const letters = match[ 1 ].toUpperCase();
	let columnIndex = 0;

	for ( let index = 0; index < letters.length; index++ ) {
		columnIndex = columnIndex * 26 + letters.charCodeAt( index ) - 64;
	}

	return {
		columnIndex: columnIndex - 1,
		rowIndex: Number( match[ 2 ] ) - 1,
	};
};

/*
  The 3x3 default only applies to an empty table. Flooring every table at 3x3
  would silently re-expand a table the author deliberately shrank.
*/
export const getColumnCount = ( data = [], columns = [] ) => {
	const widestRow = ( Array.isArray( data ) ? data : [] ).reduce(
		( widest, row ) =>
			Math.max( widest, Array.isArray( row ) ? row.length : 0 ),
		0
	);
	const columnCount = Math.max(
		widestRow,
		Array.isArray( columns ) ? columns.length : 0
	);

	return columnCount > 0 ? columnCount : DEFAULT_COLUMN_COUNT;
};

export const normalizeData = ( data = [], columns = [] ) => {
	const columnCount = getColumnCount( data, columns );
	const rows = Array.isArray( data ) ? data : [];
	const rowCount = rows.length > 0 ? rows.length : DEFAULT_ROW_COUNT;

	return Array.from( { length: rowCount }, ( _, rowIndex ) => {
		const row = Array.isArray( rows[ rowIndex ] ) ? rows[ rowIndex ] : [];

		return Array.from( { length: columnCount }, ( __, columnIndex ) => {
			const value = row[ columnIndex ];

			return value === undefined || value === null ? '' : value;
		} );
	} );
};

export const normalizeColumns = ( data = [], columns = [] ) => {
	const columnCount = getColumnCount( data, columns );

	return Array.from( { length: columnCount }, ( _, index ) => {
		const column = ( Array.isArray( columns ) && columns[ index ] ) || {};
		const parsedWidth = parseInt( column.width, 10 );

		return {
			...column,
			type: 'text',
			title: column.title || getColumnName( index ),
			width:
				Number.isFinite( parsedWidth ) && parsedWidth > 0
					? parsedWidth
					: DEFAULT_COLUMN_WIDTH,
		};
	} );
};

export const normalizeVariants = ( variants = {} ) => ( {
	cells: variants?.cells || {},
	rows: variants?.rows || {},
	columns: variants?.columns || {},
} );

const getVariantClass = ( value ) =>
	VARIANT_CLASS_NAMES.includes( value ) ? value : '';

/*
  Exactly one variant wins per cell, in the order cell, row, column. Emitting the
  row variant on the tr instead would let a column variant on the cell out-specify
  it and invert this order.
*/
export const resolveCellVariant = ( variants, rowIndex, columnIndex ) => {
	const normalizedVariants = normalizeVariants( variants );
	const cellName = getCellName( columnIndex, rowIndex );

	return getVariantClass(
		normalizedVariants.cells[ cellName ] ||
			normalizedVariants.rows[ rowIndex ] ||
			normalizedVariants.columns[ columnIndex ] ||
			''
	);
};

export const getVariantPreviewStyles = (
	variants = {},
	data = [],
	columns = []
) => {
	const normalizedData = normalizeData( data, columns );
	const columnCount = getColumnCount( normalizedData, columns );
	const previewStyles = {};

	for ( let rowIndex = 0; rowIndex < normalizedData.length; rowIndex++ ) {
		for ( let columnIndex = 0; columnIndex < columnCount; columnIndex++ ) {
			const variant = resolveCellVariant(
				variants,
				rowIndex,
				columnIndex
			);

			previewStyles[ getCellName( columnIndex, rowIndex ) ] = variant
				? VARIANT_PREVIEWS[ variant ] || ''
				: '';
		}
	}

	return previewStyles;
};

export const getTableStyle = ( {
	tableWidth = '',
	borderWidth = '',
	borderColor = '',
} = {} ) => {
	const style = {};
	const width = String( tableWidth || '' ).trim();
	const parsedBorderWidth = parseInt( borderWidth, 10 );

	if ( width ) {
		style.width = /^\d+$/.test( width ) ? `${ width }px` : width;
	}

	if ( Number.isFinite( parsedBorderWidth ) && parsedBorderWidth >= 0 ) {
		style[ '--bs-border-width' ] = `${ Math.min(
			parsedBorderWidth,
			MAX_BORDER_WIDTH
		) }px`;
	}

	if ( borderColor ) {
		style[ '--bs-table-border-color' ] = borderColor;
	}

	return style;
};

/*
  A table is split into a header row, body rows, and a footer row. Returns the
  inclusive row range of each section that is actually rendered.
*/
export const getTableSections = ( rowCount, hasHeader, hasFooter ) => {
	const totalRows = Math.max( 0, Number( rowCount ) || 0 );
	const renderHeader = Boolean( hasHeader ) && totalRows > 0;
	const renderFooter = Boolean( hasFooter ) && totalRows > 1;
	const bodyStart = renderHeader ? 1 : 0;
	const bodyEnd = renderFooter ? totalRows - 2 : totalRows - 1;

	return {
		head: renderHeader ? { start: 0, end: 0 } : null,
		body: bodyEnd >= bodyStart ? { start: bodyStart, end: bodyEnd } : null,
		foot: renderFooter
			? { start: totalRows - 1, end: totalRows - 1 }
			: null,
	};
};

/*
  thead, tbody, and tfoot are separate row groups, so a rowspan may not reach
  across them. Clamping keeps the saved markup valid whatever the author merged.
*/
export const clampMergesToSections = (
	mergeCells = {},
	rowCount,
	columnCount,
	hasHeader,
	hasFooter
) => {
	const sections = Object.values(
		getTableSections( rowCount, hasHeader, hasFooter )
	).filter( Boolean );
	const clampedMerges = {};

	Object.entries( mergeCells || {} ).forEach( ( [ cellName, span ] ) => {
		const coords = getCoordsFromCellName( cellName );

		if ( ! coords || ! Array.isArray( span ) ) {
			return;
		}

		const { columnIndex, rowIndex } = coords;

		if (
			rowIndex < 0 ||
			rowIndex >= rowCount ||
			columnIndex < 0 ||
			columnIndex >= columnCount
		) {
			return;
		}

		const section = sections.find(
			( { start, end } ) => rowIndex >= start && rowIndex <= end
		);

		if ( ! section ) {
			return;
		}

		const requestedColspan = Math.max( 1, parseInt( span[ 0 ], 10 ) || 1 );
		const requestedRowspan = Math.max( 1, parseInt( span[ 1 ], 10 ) || 1 );
		const colspan = Math.min( requestedColspan, columnCount - columnIndex );
		const rowspan = Math.min(
			requestedRowspan,
			section.end - rowIndex + 1
		);

		if ( colspan > 1 || rowspan > 1 ) {
			clampedMerges[ cellName ] = [ colspan, rowspan ];
		}
	} );

	return clampedMerges;
};

export const getCoveredCells = ( mergeCells = {} ) => {
	const coveredCells = new Set();

	Object.entries( mergeCells || {} ).forEach( ( [ cellName, span ] ) => {
		const coords = getCoordsFromCellName( cellName );

		if ( ! coords || ! Array.isArray( span ) ) {
			return;
		}

		const [ colspan = 1, rowspan = 1 ] = span.map( ( value ) =>
			Math.max( 1, parseInt( value, 10 ) || 1 )
		);

		for ( let rowOffset = 0; rowOffset < rowspan; rowOffset++ ) {
			for (
				let columnOffset = 0;
				columnOffset < colspan;
				columnOffset++
			) {
				if ( rowOffset === 0 && columnOffset === 0 ) {
					continue;
				}

				coveredCells.add(
					getCellName(
						coords.columnIndex + columnOffset,
						coords.rowIndex + rowOffset
					)
				);
			}
		}
	} );

	return coveredCells;
};

export const getMergeSpan = ( mergeCells = {}, columnIndex, rowIndex ) => {
	const span = mergeCells?.[ getCellName( columnIndex, rowIndex ) ];

	if ( ! Array.isArray( span ) ) {
		return null;
	}

	return {
		colspan: Math.max( 1, parseInt( span[ 0 ], 10 ) || 1 ),
		rowspan: Math.max( 1, parseInt( span[ 1 ], 10 ) || 1 ),
	};
};

/*
  Cells hold plain strings, but authors expect to be able to bold a word or drop
  in a link the way the old core/table variation allowed. Everything outside this
  allowlist is escaped, so a stray "<" renders literally instead of breaking the
  saved markup. Must stay pure: it runs on every save and feeds block validation.
*/
const ALLOWED_TAGS = {
	a: [ 'href', 'title', 'class' ],
	b: [],
	br: [],
	code: [],
	em: [],
	i: [],
	span: [ 'class' ],
	strong: [],
	sub: [],
	sup: [],
};

const VOID_TAGS = [ 'br' ];

const TAG_PATTERN =
	/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)\/?\s*>/g;

const ATTRIBUTE_PATTERN =
	/([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

const UNSAFE_PROTOCOL_PATTERN = /^(?:javascript|data|vbscript):/;

const escapeHtml = ( value ) =>
	String( value )
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		.replace( /"/g, '&quot;' );

const isSafeHref = ( value ) =>
	! UNSAFE_PROTOCOL_PATTERN.test(
		// Drop everything but letters, digits, and the colon so padded or
		// character-escaped protocols ("java\tscript:") are still caught.
		String( value )
			.replace( /[^a-zA-Z0-9:]/g, '' )
			.toLowerCase()
	);

const sanitizeAttributes = ( tagName, rawAttributes ) => {
	const allowedAttributes = ALLOWED_TAGS[ tagName ];

	if ( ! allowedAttributes.length ) {
		return '';
	}

	let attributes = '';
	let match;

	ATTRIBUTE_PATTERN.lastIndex = 0;

	while ( ( match = ATTRIBUTE_PATTERN.exec( rawAttributes ) ) !== null ) {
		const name = match[ 1 ].toLowerCase();
		const value = match[ 2 ] || match[ 3 ] || match[ 4 ] || '';

		if ( ! allowedAttributes.includes( name ) ) {
			continue;
		}

		if ( name === 'href' && ! isSafeHref( value ) ) {
			continue;
		}

		attributes += ` ${ name }="${ escapeHtml( value ) }"`;
	}

	return attributes;
};

export const sanitizeCellHtml = ( value ) => {
	const raw = value === undefined || value === null ? '' : String( value );
	const openTags = [];
	let sanitized = '';
	let lastIndex = 0;
	let match;

	TAG_PATTERN.lastIndex = 0;

	while ( ( match = TAG_PATTERN.exec( raw ) ) !== null ) {
		const [ fullMatch, closingSlash, rawTagName, rawAttributes ] = match;
		const tagName = rawTagName.toLowerCase();

		sanitized += escapeHtml( raw.slice( lastIndex, match.index ) );
		lastIndex = match.index + fullMatch.length;

		if ( ! ALLOWED_TAGS[ tagName ] ) {
			sanitized += escapeHtml( fullMatch );
			continue;
		}

		if ( VOID_TAGS.includes( tagName ) ) {
			if ( ! closingSlash ) {
				sanitized += `<${ tagName } />`;
			}

			continue;
		}

		if ( ! closingSlash ) {
			openTags.push( tagName );
			sanitized += `<${ tagName }${ sanitizeAttributes(
				tagName,
				rawAttributes
			) }>`;
			continue;
		}

		// Repair improper nesting by closing everything opened inside this tag.
		const openIndex = openTags.lastIndexOf( tagName );

		if ( openIndex < 0 ) {
			continue;
		}

		for ( let index = openTags.length - 1; index >= openIndex; index-- ) {
			sanitized += `</${ openTags[ index ] }>`;
		}

		openTags.length = openIndex;
	}

	sanitized += escapeHtml( raw.slice( lastIndex ) );

	// Close anything the author left open so the cell cannot leak into the table.
	for ( let index = openTags.length - 1; index >= 0; index-- ) {
		sanitized += `</${ openTags[ index ] }>`;
	}

	return sanitized;
};
