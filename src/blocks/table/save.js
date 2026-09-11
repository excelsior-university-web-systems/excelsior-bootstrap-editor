import { RawHTML } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import {
	clampMergesToSections,
	getBootstrapTableClasses,
	getCellName,
	getColumnCount,
	getCoveredCells,
	getMergeSpan,
	getTableSections,
	getTableStyle,
	normalizeColumns,
	normalizeData,
	resolveCellVariant,
	sanitizeCellHtml,
} from './utils';

const renderRows = (
	rows,
	rowOffset,
	{
		columns,
		coveredCells,
		mergeCells,
		variants,
		cellTag: CellTag,
		isHeader = false,
	}
) =>
	rows.map( ( row, localRowIndex ) => {
		const rowIndex = rowOffset + localRowIndex;

		return (
			<tr key={ rowIndex }>
				{ columns.map( ( column, columnIndex ) => {
					const cellName = getCellName( columnIndex, rowIndex );

					if ( coveredCells.has( cellName ) ) {
						return null;
					}

					const span = getMergeSpan(
						mergeCells,
						columnIndex,
						rowIndex
					);
					const variant = resolveCellVariant(
						variants,
						rowIndex,
						columnIndex
					);

					return (
						<CellTag
							key={ cellName }
							className={ variant || undefined }
							colSpan={
								span?.colspan > 1 ? span.colspan : undefined
							}
							rowSpan={
								span?.rowspan > 1 ? span.rowspan : undefined
							}
							scope={ isHeader ? 'col' : undefined }
						>
							<RawHTML>
								{ sanitizeCellHtml( row[ columnIndex ] ) }
							</RawHTML>
						</CellTag>
					);
				} ) }
			</tr>
		);
	} );

export default function Save( { attributes } ) {
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
	const normalizedData = normalizeData( data, columns );
	const normalizedColumns = normalizeColumns( normalizedData, columns );
	const sections = getTableSections(
		normalizedData.length,
		hasHeader,
		hasFooter
	);

	/*
	  Clamp before deriving covered cells so a merge the author drew across a
	  section boundary shrinks instead of dropping the cells it used to cover.
	*/
	const clampedMerges = clampMergesToSections(
		mergeCells,
		normalizedData.length,
		getColumnCount( normalizedData, normalizedColumns ),
		hasHeader,
		hasFooter
	);
	const renderOptions = {
		columns: normalizedColumns,
		coveredCells: getCoveredCells( clampedMerges ),
		mergeCells: clampedMerges,
		variants,
	};
	const blockProps = useBlockProps.save( { className: 'mb-3' } );

	return (
		<figure { ...blockProps }>
			<div className="table-responsive">
				<table
					className={ getBootstrapTableClasses( {
						border,
						isStriped,
						isCompact,
					} ).join( ' ' ) }
					style={ getTableStyle( {
						tableWidth,
						borderWidth,
						borderColor,
					} ) }
				>
					<colgroup>
						{ normalizedColumns.map( ( column, columnIndex ) => (
							<col
								key={ columnIndex }
								style={ { width: `${ column.width }px` } }
							/>
						) ) }
					</colgroup>
					{ sections.head && (
						<thead>
							{ renderRows(
								normalizedData.slice(
									sections.head.start,
									sections.head.end + 1
								),
								sections.head.start,
								{
									...renderOptions,
									cellTag: 'th',
									isHeader: true,
								}
							) }
						</thead>
					) }
					{ sections.body && (
						<tbody>
							{ renderRows(
								normalizedData.slice(
									sections.body.start,
									sections.body.end + 1
								),
								sections.body.start,
								{ ...renderOptions, cellTag: 'td' }
							) }
						</tbody>
					) }
					{ sections.foot && (
						<tfoot>
							{ renderRows(
								normalizedData.slice(
									sections.foot.start,
									sections.foot.end + 1
								),
								sections.foot.start,
								{ ...renderOptions, cellTag: 'td' }
							) }
						</tfoot>
					) }
				</table>
			</div>
			{ caption && (
				<figcaption className="figure-caption">{ caption }</figcaption>
			) }
		</figure>
	);
}
