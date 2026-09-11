import jspreadsheet from 'jspreadsheet-ce';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Notice,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import {
	tableColumnAfter,
	tableColumnDelete,
	tableRowAfter,
	tableRowDelete,
} from '@wordpress/icons';
import {
	BORDER_COLORS,
	DEFAULT_COLUMN_WIDTH,
	MAX_BORDER_WIDTH,
	TABLE_BORDERED,
	TABLE_BORDERLESS,
	TABLE_VARIANTS,
	getCellName,
	getColumnName,
	getCoordsFromCellName,
	getTableSections,
	getVariantPreviewStyles,
	normalizeColumns,
	normalizeData,
	normalizeVariants,
} from './utils';

const STYLE_SCOPE_CELL = 'cell';
const STYLE_SCOPE_ROW = 'row';
const STYLE_SCOPE_COLUMN = 'column';

const cloneData = ( data ) => data.map( ( row ) => [ ...row ] );

const getSignature = ( { data, columns, mergeCells, variants } ) =>
	JSON.stringify( {
		data,
		columns: normalizeColumns( data, columns ).map(
			( column ) => column.width
		),
		mergeCells,
		variants: normalizeVariants( variants ),
	} );

/*
  Jspreadsheet takes inline styles rather than classes, so a variant with no
  color has to be reset instead of set to an empty declaration.
*/
const applyPreviewStyles = ( worksheet, previewStyles ) => {
	const styled = {};
	const cleared = {};

	Object.entries( previewStyles ).forEach( ( [ cellName, cssText ] ) => {
		if ( cssText ) {
			styled[ cellName ] = cssText;
		} else {
			cleared[ cellName ] = true;
		}
	} );

	if ( Object.keys( cleared ).length ) {
		worksheet.resetStyle( cleared, true );
	}

	if ( Object.keys( styled ).length ) {
		worksheet.setStyle( styled, null, null, true );
	}
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		data,
		columns,
		mergeCells,
		variants,
		caption,
		hasHeader,
		hasFooter,
		isStriped,
		isCompact,
		border,
		tableWidth,
		borderWidth,
		borderColor,
	} = attributes;
	const containerRef = useRef( null );
	const worksheetRef = useRef( null );
	const attributesRef = useRef( attributes );
	const lastSignatureRef = useRef( null );
	const isApplyingRemoteRef = useRef( false );
	const [ selectedRange, setSelectedRange ] = useState( [ 0, 0, 0, 0 ] );
	const [ styleScope, setStyleScope ] = useState( STYLE_SCOPE_CELL );
	const [ mergeWarning, setMergeWarning ] = useState( '' );
	const blockProps = useBlockProps( { className: 'excelsior-table-editor' } );

	attributesRef.current = attributes;

	const syncFromWorksheet = useCallback(
		( worksheet = worksheetRef.current ) => {
			// Writes we just pushed into the grid must not echo back as edits.
			if ( ! worksheet || isApplyingRemoteRef.current ) {
				return;
			}

			/*
			  "processed: true" reads the underlying value array. The default
			  reads each cell's innerHTML instead, which would persist
			  Jspreadsheet's rendered markup rather than what the author typed.
			*/
			const nextData = normalizeData(
				worksheet.getData( false, true ) || [],
				attributesRef.current.columns
			);
			const widths = worksheet.getWidth() || [];
			const nextColumns = normalizeColumns(
				nextData,
				attributesRef.current.columns
			).map( ( column, index ) => ( {
				width:
					parseInt( widths[ index ], 10 ) ||
					column.width ||
					DEFAULT_COLUMN_WIDTH,
			} ) );
			const nextAttributes = {
				data: nextData,
				columns: nextColumns,
				mergeCells: worksheet.getMerge() || {},
				variants: normalizeVariants( attributesRef.current.variants ),
			};

			lastSignatureRef.current = getSignature( nextAttributes );
			setAttributes( nextAttributes );
		},
		[ setAttributes ]
	);

	useEffect( () => {
		const container = containerRef.current;

		if ( ! container ) {
			return undefined;
		}

		const normalizedData = normalizeData(
			attributesRef.current.data,
			attributesRef.current.columns
		);
		const normalizedColumns = normalizeColumns(
			normalizedData,
			attributesRef.current.columns
		);

		lastSignatureRef.current = getSignature( attributesRef.current );

		jspreadsheet( container, {
			about: false,
			allowExport: false,
			contextMenu: ( instance, columnIndex, rowIndex, event, items ) =>
				( items || [] ).filter(
					( item ) =>
						! /sort|filter/i.test( item.title || item.text || '' )
				),
			parseFormulas: false,
			tabs: false,
			toolbar: false,
			worksheets: [
				{
					allowComments: false,
					allowDeletingAllRows: false,
					// columnSorting and search are worksheet options, not
					// spreadsheet options, so they have to be set here.
					columnSorting: false,
					columnDrag: false,
					columnResize: true,
					columns: normalizedColumns,
					data: cloneData( normalizedData ),
					filters: false,
					mergeCells: attributesRef.current.mergeCells || {},
					minDimensions: [
						normalizedColumns.length,
						normalizedData.length,
					],
					rowDrag: false,
					rowResize: false,
					search: false,
					style: getVariantPreviewStyles(
						attributesRef.current.variants,
						normalizedData,
						normalizedColumns
					),
					tableOverflow: true,
					tableWidth: '100%',
					textOverflow: false,
					wordWrap: true,
				},
			],
			onafterchanges: syncFromWorksheet,
			ondeletecolumn: syncFromWorksheet,
			ondeleterow: syncFromWorksheet,
			oninsertcolumn: syncFromWorksheet,
			oninsertrow: syncFromWorksheet,
			onresizecolumn: syncFromWorksheet,
			onselection: ( worksheet, left, top, right, bottom ) => {
				setSelectedRange( [
					Number( left ) || 0,
					Number( top ) || 0,
					Number( right ) || 0,
					Number( bottom ) || 0,
				] );
			},
			onload: ( spreadsheet ) => {
				worksheetRef.current = spreadsheet?.worksheets?.[ 0 ] || null;
			},
		} );

		return () => {
			if ( jspreadsheet.destroy ) {
				jspreadsheet.destroy( container, true );
			} else {
				container.innerHTML = '';
			}

			worksheetRef.current = null;
		};
	}, [ clientId, syncFromWorksheet ] );

	/*
	  Data otherwise flows one way, from the grid into attributes, so an undo or
	  any other external attribute change would leave a stale grid on screen.
	*/
	useEffect( () => {
		const worksheet = worksheetRef.current;
		const signature = getSignature( {
			data,
			columns,
			mergeCells,
			variants,
		} );

		if ( ! worksheet || signature === lastSignatureRef.current ) {
			return;
		}

		lastSignatureRef.current = signature;
		isApplyingRemoteRef.current = true;

		try {
			const normalizedData = normalizeData( data, columns );
			const normalizedColumns = normalizeColumns(
				normalizedData,
				columns
			);

			worksheet.setData( cloneData( normalizedData ) );

			Object.keys( worksheet.getMerge() || {} ).forEach( ( cellName ) =>
				worksheet.removeMerge( cellName )
			);
			Object.entries( mergeCells || {} ).forEach(
				( [ cellName, span ] ) => {
					if ( Array.isArray( span ) ) {
						worksheet.setMerge( cellName, span[ 0 ], span[ 1 ] );
					}
				}
			);

			normalizedColumns.forEach( ( column, columnIndex ) =>
				worksheet.setWidth( columnIndex, column.width )
			);

			applyPreviewStyles(
				worksheet,
				getVariantPreviewStyles(
					variants,
					normalizedData,
					normalizedColumns
				)
			);
		} finally {
			isApplyingRemoteRef.current = false;
		}
	}, [ data, columns, mergeCells, variants ] );

	const runWorksheetAction = ( action ) => {
		const worksheet = worksheetRef.current;

		if ( ! worksheet ) {
			return;
		}

		action( worksheet );
		window.setTimeout( () => syncFromWorksheet( worksheet ), 0 );
	};

	const normalizedData = normalizeData( data, columns );
	const normalizedColumns = normalizeColumns( normalizedData, columns );
	const [ left, top, right, bottom ] = selectedRange;
	const columnStart = Math.min( left, right );
	const columnEnd = Math.max( left, right );
	const rowStart = Math.min( top, bottom );
	const rowEnd = Math.max( top, bottom );

	const insertRow = () =>
		runWorksheetAction( ( worksheet ) => {
			worksheet.insertRow( 1, rowEnd, false );
		} );

	const deleteRow = () =>
		runWorksheetAction( ( worksheet ) => {
			worksheet.deleteRow( rowStart, 1 );
		} );

	const insertColumn = () =>
		runWorksheetAction( ( worksheet ) => {
			worksheet.insertColumn( 1, columnEnd, false, [
				{ type: 'text', width: DEFAULT_COLUMN_WIDTH },
			] );
		} );

	const deleteColumn = () =>
		runWorksheetAction( ( worksheet ) => {
			worksheet.deleteColumn( columnStart, 1 );
		} );

	const mergeSelection = () => {
		/*
		  thead, tbody, and tfoot are separate row groups, so a rowspan cannot
		  reach across them. Clamp here rather than letting save quietly shrink
		  a merge the author can see in the grid.
		*/
		const sections = Object.values(
			getTableSections( normalizedData.length, hasHeader, hasFooter )
		).filter( Boolean );
		const section = sections.find(
			( { start, end } ) => rowStart >= start && rowStart <= end
		);
		const colspan = columnEnd - columnStart + 1;
		const requestedRowspan = rowEnd - rowStart + 1;
		const rowspan = section
			? Math.min( requestedRowspan, section.end - rowStart + 1 )
			: requestedRowspan;

		setMergeWarning(
			rowspan < requestedRowspan
				? 'The merge was limited to the header, body, or footer it started in, because a table cell cannot span across those sections.'
				: ''
		);

		if ( colspan > 1 || rowspan > 1 ) {
			runWorksheetAction( ( worksheet ) => {
				worksheet.setMerge(
					getCellName( columnStart, rowStart ),
					colspan,
					rowspan
				);
			} );
		}
	};

	const splitSelection = () => {
		setMergeWarning( '' );
		runWorksheetAction( ( worksheet ) => {
			const merges = worksheet.getMerge() || {};

			Object.keys( merges ).forEach( ( cellName ) => {
				const coords = getCoordsFromCellName( cellName );

				if ( ! coords || ! Array.isArray( merges[ cellName ] ) ) {
					return;
				}

				const [ colspan = 1, rowspan = 1 ] = merges[ cellName ].map(
					( value ) => Math.max( 1, parseInt( value, 10 ) || 1 )
				);
				const intersectsSelection =
					coords.columnIndex <= columnEnd &&
					coords.columnIndex + colspan - 1 >= columnStart &&
					coords.rowIndex <= rowEnd &&
					coords.rowIndex + rowspan - 1 >= rowStart;

				if ( intersectsSelection ) {
					worksheet.removeMerge( cellName );
				}
			} );
		} );
	};

	const getScopedVariant = () => {
		const normalizedVariants = normalizeVariants( variants );

		if ( styleScope === STYLE_SCOPE_ROW ) {
			return normalizedVariants.rows[ rowStart ] || '';
		}

		if ( styleScope === STYLE_SCOPE_COLUMN ) {
			return normalizedVariants.columns[ columnStart ] || '';
		}

		return (
			normalizedVariants.cells[ getCellName( columnStart, rowStart ) ] ||
			''
		);
	};

	/*
	  Colors are Bootstrap table variant classes, so each target holds at most
	  one of them. That keeps this to a single setAttributes call, and the saved
	  markup to a class rather than an inline style.
	*/
	const applyVariant = ( variantClassName ) => {
		const normalizedVariants = normalizeVariants(
			attributesRef.current.variants
		);
		const nextVariants = {
			cells: { ...normalizedVariants.cells },
			rows: { ...normalizedVariants.rows },
			columns: { ...normalizedVariants.columns },
		};
		const assign = ( target, key ) => {
			if ( variantClassName ) {
				target[ key ] = variantClassName;
			} else {
				delete target[ key ];
			}
		};

		if ( styleScope === STYLE_SCOPE_ROW ) {
			for ( let index = rowStart; index <= rowEnd; index++ ) {
				assign( nextVariants.rows, index );
			}
		} else if ( styleScope === STYLE_SCOPE_COLUMN ) {
			for ( let index = columnStart; index <= columnEnd; index++ ) {
				assign( nextVariants.columns, index );
			}
		} else {
			for ( let row = rowStart; row <= rowEnd; row++ ) {
				for (
					let column = columnStart;
					column <= columnEnd;
					column++
				) {
					assign( nextVariants.cells, getCellName( column, row ) );
				}
			}
		}

		setAttributes( { variants: nextVariants } );
	};

	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ tableRowAfter }
						label="Insert row after"
						onClick={ insertRow }
					/>
					<ToolbarButton
						icon={ tableRowDelete }
						label="Delete row"
						onClick={ deleteRow }
					/>
					<ToolbarButton
						icon={ tableColumnAfter }
						label="Insert column after"
						onClick={ insertColumn }
					/>
					<ToolbarButton
						icon={ tableColumnDelete }
						label="Delete column"
						onClick={ deleteColumn }
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						label="Merge cells"
						onClick={ mergeSelection }
					>
						Merge
					</ToolbarButton>
					<ToolbarButton
						label="Split cells"
						onClick={ splitSelection }
					>
						Split
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title="Table" initialOpen={ true }>
					<ToggleControl
						label="Header row"
						checked={ hasHeader }
						onChange={ ( value ) =>
							setAttributes( { hasHeader: value } )
						}
					/>
					<ToggleControl
						label="Footer row"
						checked={ hasFooter }
						onChange={ ( value ) =>
							setAttributes( { hasFooter: value } )
						}
					/>
					<ToggleControl
						label="Striped"
						checked={ isStriped }
						onChange={ ( value ) =>
							setAttributes( { isStriped: value } )
						}
					/>
					<ToggleControl
						label="Compact"
						checked={ isCompact }
						onChange={ ( value ) =>
							setAttributes( { isCompact: value } )
						}
					/>
					<SelectControl
						label="Border"
						value={ border }
						options={ [
							{ label: 'Bordered', value: TABLE_BORDERED },
							{ label: 'Borderless', value: TABLE_BORDERLESS },
						] }
						onChange={ ( value ) =>
							setAttributes( { border: value || TABLE_BORDERED } )
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						label="Caption"
						value={ caption }
						onChange={ ( value ) =>
							setAttributes( { caption: value } )
						}
						__next40pxDefaultSize
					/>
				</PanelBody>
				<PanelBody title="Dimensions and borders" initialOpen={ false }>
					<TextControl
						label="Table width"
						help="Use CSS values such as 640px or 80%, or leave blank for full width."
						value={ tableWidth }
						onChange={ ( value ) =>
							setAttributes( { tableWidth: value } )
						}
						__next40pxDefaultSize
					/>
					<TextControl
						label={ `Column ${ getColumnName(
							columnStart
						) } width (px)` }
						type="number"
						value={
							normalizedColumns[ columnStart ]?.width ||
							DEFAULT_COLUMN_WIDTH
						}
						min={ 40 }
						onChange={ ( value ) => {
							const nextColumns = normalizedColumns.map(
								( column, index ) => ( {
									width:
										index === columnStart
											? parseInt( value, 10 ) ||
											  DEFAULT_COLUMN_WIDTH
											: column.width,
								} )
							);

							setAttributes( { columns: nextColumns } );
						} }
						__next40pxDefaultSize
					/>
					<TextControl
						label="Border thickness (px)"
						help="Applies to the whole table."
						type="number"
						value={ borderWidth }
						min={ 0 }
						max={ MAX_BORDER_WIDTH }
						onChange={ ( value ) =>
							setAttributes( { borderWidth: value || '' } )
						}
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Border color"
						value={ borderColor }
						options={ BORDER_COLORS }
						onChange={ ( value ) =>
							setAttributes( { borderColor: value } )
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody title="Color" initialOpen={ false }>
					<SelectControl
						label="Apply color to"
						value={ styleScope }
						options={ [
							{
								label: 'Selected cells',
								value: STYLE_SCOPE_CELL,
							},
							{
								label: 'Selected rows',
								value: STYLE_SCOPE_ROW,
							},
							{
								label: 'Selected columns',
								value: STYLE_SCOPE_COLUMN,
							},
						] }
						onChange={ setStyleScope }
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Color"
						help="A cell color overrides a row color, which overrides a column color."
						value={ getScopedVariant() }
						options={ TABLE_VARIANTS.map( ( variant ) => ( {
							label: variant.label,
							value: variant.className,
						} ) ) }
						onChange={ applyVariant }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			{ mergeWarning && (
				<Notice
					status="warning"
					onRemove={ () => setMergeWarning( '' ) }
				>
					{ mergeWarning }
				</Notice>
			) }
			{ /* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- The grid is a focus and keyboard container for Jspreadsheet, which renders its own table and manages cell focus. */ }
			<div
				className="excelsior-table-editor__grid"
				/*
				  The grid owns its own keys and clipboard, or Backspace in an
				  empty cell would delete the whole block. Gutenberg's undo
				  shortcut therefore does not fire while focus is in the grid;
				  Jspreadsheet's own undo handles it. Mouse events are left to
				  propagate so Gutenberg can still select the block, which is
				  what reveals the toolbar and these inspector panels.
				*/
				onKeyDown={ ( event ) => event.stopPropagation() }
				onPaste={ ( event ) => event.stopPropagation() }
				ref={ containerRef }
			/>
		</div>
	);
}
