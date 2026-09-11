import jspreadsheet from 'jspreadsheet-ce';
import { BlockControls, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { BaseControl, Button, Notice, PanelBody, RangeControl, SelectControl, TextControl, ToggleControl, ToolbarButton, ToolbarDropdownMenu, ToolbarGroup } from '@wordpress/components';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import {
    // syncTableChrome has its own local "table", the DOM element.
    table as tableIcon,
    tableColumnAfter,
    tableColumnBefore,
    tableColumnDelete,
    tableRowAfter,
    tableRowBefore,
    tableRowDelete,
} from '@wordpress/icons';
import {
    BORDER_COLORS,
    MAX_BORDER_WIDTH,
    TABLE_BORDERED,
    TABLE_BORDERLESS,
    TABLE_STYLE_PROPERTIES,
    TABLE_VARIANTS,
    getBootstrapTableClasses,
    getCellName,
    getColumnName,
    getCoordsFromCellName,
    getGridColumns,
    getTableSections,
    getTableStyle,
    getVariantPreviewStyles,
    insertTableRow,
    normalizeColumns,
    normalizeData,
    normalizeVariants,
    removeTableRow,
} from './utils';

const STYLE_SCOPE_CELL = 'cell';
const STYLE_SCOPE_ROW = 'row';
const STYLE_SCOPE_COLUMN = 'column';

const MANAGED_TABLE_CLASSES = ['table', 'table-sm', 'table-striped', TABLE_BORDERED, TABLE_BORDERLESS];

/*
  Both icons are their source SVGs unaltered, apart from rendering at the 24px
  the toolbar expects and taking their color from currentColor rather than a
  hardcoded black, so they follow the toolbar's hover, pressed, and disabled
  states and the dark editor scheme.
*/
const mergeCellsIcon = (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='currentColor' aria-hidden='true' focusable='false'>
        <path d="M9.95,21h-5.73c-.68,0-1.23-.55-1.23-1.23V4.23c0-.68.55-1.23,1.23-1.23h5.73c.68,0,1.23.55,1.23,1.23v3.68c0,.45-.37.82-.82.82s-.82-.37-.82-.82v-3.27h-4.91v14.73h4.91v-3.27c0-.45.37-.82.82-.82s.82.37.82.82v3.68c0,.68-.55,1.23-1.23,1.23Z"/>
		<path d="M19.77,21h-5.73c-.68,0-1.23-.55-1.23-1.23v-3.68c0-.45.37-.82.82-.82s.82.37.82.82v3.27h4.91V4.64h-4.91v3.27c0,.45-.37.82-.82.82s-.82-.37-.82-.82v-3.68c0-.68.55-1.23,1.23-1.23h5.73c.68,0,1.23.55,1.23,1.23v15.55c0,.68-.55,1.23-1.23,1.23Z"/>
		<path d="M20.18,12.82h-6.55c-.45,0-.82-.37-.82-.82s.37-.82.82-.82h6.55c.45,0,.82.37.82.82s-.37.82-.82.82Z"/>
		<path d="M10.36,12.82h-6.14c-.45,0-.82-.37-.82-.82s.37-.82.82-.82h6.14c.45,0,.82.37.82.82s-.37.82-.82.82Z"/>
		<path d="M15.58,14.79c-.21,0-.42-.08-.58-.24l-1.95-1.95c-.15-.15-.24-.36-.24-.58s.09-.43.24-.58l1.95-1.95c.32-.32.84-.32,1.16,0,.32.32.32.84,0,1.16l-1.37,1.37,1.37,1.37c.32.32.32.84,0,1.16-.16.16-.37.24-.58.24Z"/>
		<path d="M8.47,14.79c-.21,0-.42-.08-.58-.24-.32-.32-.32-.84,0-1.16l1.37-1.37-1.37-1.37c-.32-.32-.32-.84,0-1.16.32-.32.84-.32,1.16,0l1.95,1.95c.32.32.32.84,0,1.16l-1.95,1.95c-.16.16-.37.24-.58.24Z"/>
	</svg>
);

const splitCellsIcon = (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='currentColor' aria-hidden='true' focusable='false'>
        <path d="M-388-388H412V412H-388V-388Z" fill="none"/>
		<path d="M20,3c.55,0,1,.45,1,1v16c0,.55-.45,1-1,1H4c-.55,0-1-.45-1-1V4c0-.55.45-1,1-1h16ZM11,5h-6v14h6v-4h2v4h6V5h-6v4h-2v-4Z"/>
		<polygon points="15 9 18 12 15 15 15 13 9 13 9 15 6 12 9 9 9 11 15 11 15 9"/>
	</svg>
);

const cloneData = (data) => data.map((row) => [...row]);

/*
  Header and footer rows are identified by position, not by a flag, so an
  inserted row has to land inside the body or it would silently become the
  header or footer and displace the author's own. Only the Header row and
  Footer row toggles may create or remove those rows.
*/
const getBodyRowBounds = (rowCount, hasHeader, hasFooter) => ({
    start: hasHeader && rowCount > 0 ? 1 : 0,
    end: hasFooter && rowCount > 1 ? rowCount - 2 : rowCount - 1,
});

const stringify = (value) => JSON.stringify(value);

/*
  Jspreadsheet renders a real table, so giving it the same Bootstrap classes and
  custom properties the saved markup gets makes the grid preview the finished
  table: striping, compact padding, borders, width, and variant colors all come
  from the framework stylesheet the editor canvas already loads.
*/
const syncTableChrome = (worksheet, attributes) => {
    const table = worksheet?.table;

    if (!table) {
        return;
    }

    const { border, isStriped, isCompact, tableWidth, borderWidth, borderColor } = attributes;
    const style = getTableStyle({ tableWidth, borderWidth, borderColor });

    table.classList.remove(...MANAGED_TABLE_CLASSES);
    table.classList.add(...getBootstrapTableClasses({ border, isStriped, isCompact }));

    TABLE_STYLE_PROPERTIES.forEach((property) => table.style.removeProperty(property));
    Object.entries(style).forEach(([property, value]) => table.style.setProperty(property, value));

    // A table with no explicit width fills the block, as it will on the frontend.
    if (!style.width) {
        table.style.setProperty('width', '100%');
    }
};

/*
  Colors are Bootstrap class names and custom property references, not color
  strings, so ColorPalette is the wrong shape: it reports back a normalized
  color that has to be matched to an option to recover the class. These swatches
  carry the value itself, so nothing has to survive a round trip through a color
  format. An empty value is the option that clears the color.
*/
const SwatchControl = ({ help, id, label, onSelect, options, value }) => (
    <BaseControl id={id} help={help} label={label} __nextHasNoMarginBottom>
        <div className='excelsior-table-swatches'>
            {options.map((option) => (
                <Button
                    key={option.value || 'none'}
                    className={['excelsior-table-swatches__swatch', option.value ? '' : 'is-none'].filter(Boolean).join(' ')}
                    isPressed={value === option.value}
                    label={option.label}
                    onClick={() => onSelect(option.value)}
                    showTooltip
                    style={option.value ? { backgroundColor: option.color } : undefined}
                />
            ))}
        </div>
    </BaseControl>
);

/*
  Jspreadsheet takes inline styles rather than classes, so a cell with no variant
  has to have its style reset instead of set to an empty declaration.
*/
const applyPreviewStyles = (worksheet, previewStyles) => {
    const styled = {};
    const cleared = {};

    Object.entries(previewStyles).forEach(([cellName, cssText]) => {
        if (cssText) {
            styled[cellName] = cssText;
        } else {
            cleared[cellName] = true;
        }
    });

    if (Object.keys(cleared).length) {
        worksheet.resetStyle(cleared, true);
    }

    if (Object.keys(styled).length) {
        worksheet.setStyle(styled, null, null, true);
    }
};

export default function Edit({ attributes, setAttributes, clientId }) {
    const { data, columns, mergeCells, variants, caption, hasHeader, hasFooter, isStriped, isCompact, border, tableWidth, borderWidth, borderColor } = attributes;
    const containerRef = useRef(null);
    const worksheetRef = useRef(null);
    const attributesRef = useRef(attributes);
    const appliedRef = useRef({});
    const isApplyingRemoteRef = useRef(false);
    const [isReady, setIsReady] = useState(false);
    const [selectedRange, setSelectedRange] = useState([0, 0, 0, 0]);
    const [styleScope, setStyleScope] = useState(STYLE_SCOPE_CELL);
    const [mergeWarning, setMergeWarning] = useState('');
    const blockProps = useBlockProps({
        className: ['excelsior-table-editor', hasHeader ? 'has-header-row' : '', hasFooter ? 'has-footer-row' : ''].filter(Boolean).join(' '),
    });

    attributesRef.current = attributes;

    const setColumnWidth = useCallback(
        (columnIndex, width) => {
            const parsedWidth = parseInt(width, 10);

            setAttributes({
                columns: normalizeColumns(attributesRef.current.data, attributesRef.current.columns).map((column, index) => ({
                    width: index === columnIndex ? (Number.isFinite(parsedWidth) && parsedWidth > 0 && parsedWidth) || null : column.width,
                })),
            });
        },
        [setAttributes],
    );

    const syncFromWorksheet = useCallback(
        (worksheet = worksheetRef.current) => {
            // Writes we just pushed into the grid must not echo back as edits.
            if (!worksheet || isApplyingRemoteRef.current) {
                return;
            }

            /*
			  "processed: true" reads the underlying value array. The default
			  reads each cell's innerHTML instead, which would persist
			  Jspreadsheet's rendered markup rather than what the author typed.
			*/
            const nextData = normalizeData(worksheet.getData(false, true) || [], attributesRef.current.columns);

            /*
			  Column widths deliberately are not read back from the grid. The
			  grid always has a pixel width for every column, but the block only
			  records one where the author asked for it.
			*/
            appliedRef.current = {
                ...appliedRef.current,
                data: stringify(nextData),
                mergeCells: stringify(worksheet.getMerge() || {}),
            };

            setAttributes({
                data: nextData,
                columns: normalizeColumns(nextData, attributesRef.current.columns).map((column) => ({ width: column.width })),
                mergeCells: worksheet.getMerge() || {},
            });
        },
        [setAttributes],
    );

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return undefined;
        }

        const normalizedData = normalizeData(attributesRef.current.data, attributesRef.current.columns);
        const normalizedColumns = normalizeColumns(normalizedData, attributesRef.current.columns);

        /*
		  Jspreadsheet binds its keydown handler to the document its script was
		  loaded in. The block editor renders blocks inside a canvas iframe, so
		  that is the wrong document and no keystroke ever reaches the grid.
		  Replay the event on the document it listens to, then mirror any
		  preventDefault back onto the real event.

		  Modified keys are left alone so the editor keeps its own shortcuts,
		  including undo and redo, which the resync effect below picks up.
		*/
        const bridgeKeyDown = (event) => {
            if (container.ownerDocument === document) {
                return;
            }

            if (event.ctrlKey || event.metaKey) {
                return;
            }

            const replay = new window.KeyboardEvent('keydown', {
                altKey: event.altKey,
                bubbles: true,
                cancelable: true,
                code: event.code,
                key: event.key,
                shiftKey: event.shiftKey,
            });

            // which and keyCode cannot be passed through KeyboardEventInit, and
            // Jspreadsheet reads them for every shortcut.
            ['which', 'keyCode'].forEach((property) =>
                Object.defineProperty(replay, property, {
                    get: () => event[property],
                }),
            );

            document.dispatchEvent(replay);

            if (replay.defaultPrevented) {
                event.preventDefault();
            }
        };

        container.addEventListener('keydown', bridgeKeyDown);

        /*
		  Jspreadsheet keeps a single module-level pointer at the worksheet it
		  considers focused, and its keydown handler acts on that pointer no
		  matter where the keystroke came from. The inspector lives in the same
		  document as that handler, so typing in a field like Caption would be
		  captured by the grid instead. Releasing the pointer whenever something
		  outside the grid takes focus keeps the two apart.

		  Events raised inside the canvas iframe never reach this document, so
		  this only ever fires for the sidebar, toolbar, and the rest of the UI.
		*/
        const releaseWorksheet = () => {
            if (jspreadsheet.current === worksheetRef.current) {
                jspreadsheet.current = null;
            }
        };

        document.addEventListener('focusin', releaseWorksheet);
        document.addEventListener('mousedown', releaseWorksheet);

        const instances = jspreadsheet(container, {
            about: false,
            allowExport: false,
            contextMenu: (instance, columnIndex, rowIndex, event, items) => (items || []).filter((item) => !/sort|filter/i.test(item.title || item.text || '')),
            parseFormulas: false,
            // Bind mouse, touch, and clipboard events inside the canvas iframe
            // rather than the document this script was loaded in.
            root: container,
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
                    columnResize: false,
                    columns: getGridColumns(normalizedColumns, container.clientWidth),
                    data: cloneData(normalizedData),
                    filters: false,
                    mergeCells: attributesRef.current.mergeCells || {},
                    minDimensions: [normalizedColumns.length, normalizedData.length],
                    rowDrag: false,
                    rowResize: false,
                    search: false,
                    style: getVariantPreviewStyles(attributesRef.current.variants, normalizedData, normalizedColumns),
                    /*
					  Jspreadsheet's own scroll container would nest a second
					  scrollbar inside the block's. The grid wrapper is the
					  only scroller, mirroring the .table-responsive the saved
					  markup uses.
					*/
                    tableOverflow: false,
                    textOverflow: false,
                    wordWrap: true,
                },
            ],
            onafterchanges: syncFromWorksheet,
            ondeletecolumn: syncFromWorksheet,
            ondeleterow: syncFromWorksheet,
            oninsertcolumn: syncFromWorksheet,
            oninsertrow: syncFromWorksheet,
            onselection: (worksheet, left, top, right, bottom) => {
                setSelectedRange([Number(left) || 0, Number(top) || 0, Number(right) || 0, Number(bottom) || 0]);
            },
            onload: (spreadsheet) => attachWorksheet(spreadsheet?.worksheets?.[0]),
        });

        /*
		  jspreadsheet() fills the instances array from an async factory and
		  dispatches onload from a promise callback, so neither is available
		  when the call returns. Whichever arrives first wins; the other is a
		  no-op. Nothing may depend on onload alone, because until the worksheet
		  is attached the toolbar, the resync, and the Bootstrap classes are all
		  inert.
		*/
        let frames = 0;
        let frameId = null;

        function attachWorksheet(worksheet) {
            if (!worksheet || worksheetRef.current) {
                return;
            }

            worksheetRef.current = worksheet;

            // Record what the grid was built from, so the resync effect below
            // sees no difference and leaves the fresh grid alone.
            appliedRef.current = {
                data: stringify(normalizedData),
                mergeCells: stringify(attributesRef.current.mergeCells || {}),
                columns: stringify(normalizedColumns),
                variants: stringify(normalizeVariants(attributesRef.current.variants)),
            };

            // The column letters and row numbers are spreadsheet chrome;
            // authoring a table should look like editing a table.
            if (worksheet.hideIndex) {
                worksheet.hideIndex();
            }

            setIsReady(true);
        }

        const pollForWorksheet = () => {
            attachWorksheet(instances?.[0]);

            if (!worksheetRef.current && frames++ < 120) {
                frameId = window.requestAnimationFrame(pollForWorksheet);
            }
        };

        pollForWorksheet();

        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }

            container.removeEventListener('keydown', bridgeKeyDown);
            document.removeEventListener('focusin', releaseWorksheet);
            document.removeEventListener('mousedown', releaseWorksheet);

            if (jspreadsheet.destroy) {
                jspreadsheet.destroy(container, true);
            } else {
                container.innerHTML = '';
            }

            worksheetRef.current = null;
            setIsReady(false);
        };
    }, [clientId, syncFromWorksheet]);

    /*
	  Data otherwise flows one way, from the grid into attributes, so an undo or
	  any other external attribute change would leave a stale grid on screen.
	  Each part is compared on its own so that, for example, recoloring a cell
	  does not rebuild the data and close an open cell editor.
	*/
    useEffect(() => {
        const worksheet = worksheetRef.current;

        if (!worksheet || !isReady) {
            return;
        }

        const normalizedData = normalizeData(data, columns);
        const normalizedColumns = normalizeColumns(normalizedData, columns);
        const applied = appliedRef.current;
        const next = {
            data: stringify(normalizedData),
            mergeCells: stringify(mergeCells || {}),
            columns: stringify(normalizedColumns),
            variants: stringify(normalizeVariants(variants)),
        };

        isApplyingRemoteRef.current = true;

        try {
            if (next.data !== applied.data) {
                worksheet.setData(cloneData(normalizedData));
            }

            if (next.mergeCells !== applied.mergeCells) {
                Object.keys(worksheet.getMerge() || {}).forEach((cellName) => worksheet.removeMerge(cellName));
                Object.entries(mergeCells || {}).forEach(([cellName, span]) => {
                    if (Array.isArray(span)) {
                        worksheet.setMerge(cellName, span[0], span[1]);
                    }
                });
            }

            if (next.columns !== applied.columns) {
                getGridColumns(normalizedColumns, containerRef.current?.clientWidth || 0).forEach((column, columnIndex) => worksheet.setWidth(columnIndex, column.width));
            }

            /*
			  Data and merge rebuilds drop inline cell styles, so the variant
			  preview is reapplied whenever anything changed, not only colors.
			*/
            applyPreviewStyles(worksheet, getVariantPreviewStyles(variants, normalizedData, normalizedColumns));
        } finally {
            appliedRef.current = next;
            isApplyingRemoteRef.current = false;
        }
    }, [data, columns, mergeCells, variants, isReady]);

    // Bootstrap table settings are presentation only, so they are pushed
    // straight onto the grid rather than going through the data resync above.
    useEffect(() => {
        if (!isReady) {
            return;
        }

        syncTableChrome(worksheetRef.current, {
            border,
            isStriped,
            isCompact,
            tableWidth,
            borderWidth,
            borderColor,
        });
    }, [border, isStriped, isCompact, tableWidth, borderWidth, borderColor, isReady]);

    const runWorksheetAction = (action) => {
        const worksheet = worksheetRef.current;

        if (!worksheet) {
            return;
        }

        action(worksheet);
        window.setTimeout(() => syncFromWorksheet(worksheet), 0);
    };

    const normalizedData = normalizeData(data, columns);
    const normalizedColumns = normalizeColumns(normalizedData, columns);
    const [left, top, right, bottom] = selectedRange;
    const columnStart = Math.min(left, right);
    const columnEnd = Math.max(left, right);
    const rowStart = Math.min(top, bottom);
    const rowEnd = Math.max(top, bottom);

    const bodyRows = getBodyRowBounds(normalizedData.length, hasHeader, hasFooter);

    /*
	  insertRow's second argument is the row the new row goes before or after,
	  so it is the resulting index that has to stay in the body, not the anchor
	  the author happened to select. Inserting before puts the new row at the
	  anchor; inserting after puts it one past.
	*/
    const insertRowBefore = () =>
        runWorksheetAction((worksheet) => {
            worksheet.insertRow(1, Math.max(rowStart, bodyRows.start), true);
        });

    const insertRow = () =>
        runWorksheetAction((worksheet) => {
            worksheet.insertRow(1, Math.min(Math.max(rowEnd, bodyRows.start - 1), bodyRows.end), false);
        });

    const deleteRow = () =>
        runWorksheetAction((worksheet) => {
            worksheet.deleteRow(rowStart, 1);
        });

    // Columns have no header or footer, so nothing to clamp.
    const insertColumnBefore = () =>
        runWorksheetAction((worksheet) => {
            worksheet.insertColumn(1, columnStart, true, [{ type: 'text' }]);
        });

    const insertColumn = () =>
        runWorksheetAction((worksheet) => {
            worksheet.insertColumn(1, columnEnd, false, [{ type: 'text' }]);
        });

    const deleteColumn = () =>
        runWorksheetAction((worksheet) => {
            worksheet.deleteColumn(columnStart, 1);
        });

    const mergeSelection = () => {
        /*
		  thead, tbody, and tfoot are separate row groups, so a rowspan cannot
		  reach across them. Clamp here rather than letting save quietly shrink
		  a merge the author can see in the grid.
		*/
        const section = Object.values(getTableSections(normalizedData.length, hasHeader, hasFooter))
            .filter(Boolean)
            .find(({ start, end }) => rowStart >= start && rowStart <= end);
        const colspan = columnEnd - columnStart + 1;
        const requestedRowspan = rowEnd - rowStart + 1;
        const rowspan = section ? Math.min(requestedRowspan, section.end - rowStart + 1) : requestedRowspan;

        setMergeWarning(rowspan < requestedRowspan ? 'The merge was limited to the header, body, or footer it started in, because a table cell cannot span across those sections.' : '');

        if (colspan > 1 || rowspan > 1) {
            runWorksheetAction((worksheet) => {
                worksheet.setMerge(getCellName(columnStart, rowStart), colspan, rowspan);
            });
        }
    };

    const splitSelection = () => {
        setMergeWarning('');
        runWorksheetAction((worksheet) => {
            const merges = worksheet.getMerge() || {};

            Object.keys(merges).forEach((cellName) => {
                const coords = getCoordsFromCellName(cellName);

                if (!coords || !Array.isArray(merges[cellName])) {
                    return;
                }

                const [colspan = 1, rowspan = 1] = merges[cellName].map((value) => Math.max(1, parseInt(value, 10) || 1));
                const intersectsSelection = coords.columnIndex <= columnEnd && coords.columnIndex + colspan - 1 >= columnStart && coords.rowIndex <= rowEnd && coords.rowIndex + rowspan - 1 >= rowStart;

                if (intersectsSelection) {
                    worksheet.removeMerge(cellName);
                }
            });
        });
    };

    const getScopedVariant = () => {
        const normalizedVariants = normalizeVariants(variants);

        if (styleScope === STYLE_SCOPE_ROW) {
            return normalizedVariants.rows[rowStart] || '';
        }

        if (styleScope === STYLE_SCOPE_COLUMN) {
            return normalizedVariants.columns[columnStart] || '';
        }

        return normalizedVariants.cells[getCellName(columnStart, rowStart)] || '';
    };

    /*
	  Colors are Bootstrap table variant classes, so each target holds at most
	  one of them. That keeps this to a single setAttributes call, and the saved
	  markup to a class rather than an inline style.
	*/
    const applyVariant = (variantClassName) => {
        const normalizedVariants = normalizeVariants(attributesRef.current.variants);
        const nextVariants = {
            cells: { ...normalizedVariants.cells },
            rows: { ...normalizedVariants.rows },
            columns: { ...normalizedVariants.columns },
        };
        const assign = (target, key) => {
            if (variantClassName) {
                target[key] = variantClassName;
            } else {
                delete target[key];
            }
        };

        if (styleScope === STYLE_SCOPE_ROW) {
            for (let index = rowStart; index <= rowEnd; index++) {
                assign(nextVariants.rows, index);
            }
        } else if (styleScope === STYLE_SCOPE_COLUMN) {
            for (let index = columnStart; index <= columnEnd; index++) {
                assign(nextVariants.columns, index);
            }
        } else {
            for (let row = rowStart; row <= rowEnd; row++) {
                for (let column = columnStart; column <= columnEnd; column++) {
                    assign(nextVariants.cells, getCellName(column, row));
                }
            }
        }

        setAttributes({ variants: nextVariants });
    };

    const selectedVariant = getScopedVariant();

    /*
	  A header or footer is a row, not just a reinterpretation of an existing
	  one, so turning either on adds a row and turning it off takes that row
	  away. The last remaining row is never removed; the toggle just flips.
	*/
    const toggleSection = (attributeName, rowIndex, isEnabled) => {
        const change = isEnabled ? insertTableRow(attributesRef.current, rowIndex) : removeTableRow(attributesRef.current, rowIndex);

        setAttributes({
            ...(change || {}),
            [attributeName]: isEnabled,
        });
    };

    return (
        <div {...blockProps}>
            <BlockControls>
				<ToolbarGroup>
                    <ToolbarButton icon={mergeCellsIcon} label='Merge cells' onClick={mergeSelection} />
                    <ToolbarButton icon={splitCellsIcon} label='Split cells' onClick={splitSelection} />
                </ToolbarGroup>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						hasArrowIndicator
						icon={tableIcon}
						label='Edit table'
						controls={[
							{
								icon: tableRowBefore,
								title: 'Insert row before',
								onClick: insertRowBefore,
							},
							{
								icon: tableRowAfter,
								title: 'Insert row after',
								onClick: insertRow,
							},
							{
								icon: tableRowDelete,
								title: 'Delete row',
								onClick: deleteRow,
							},
							{
								icon: tableColumnBefore,
								title: 'Insert column before',
								onClick: insertColumnBefore,
							},
							{
								icon: tableColumnAfter,
								title: 'Insert column after',
								onClick: insertColumn,
							},
							{
								icon: tableColumnDelete,
								title: 'Delete column',
								onClick: deleteColumn,
							},
						]}
					/>
				</ToolbarGroup>
            </BlockControls>
            <InspectorControls>
                <PanelBody title='Table' initialOpen={true}>
                    <ToggleControl label='Header row' checked={hasHeader} onChange={(value) => toggleSection('hasHeader', 0, value)} />
                    <ToggleControl label='Footer row' checked={hasFooter} onChange={(value) => toggleSection('hasFooter', value ? normalizedData.length : normalizedData.length - 1, value)} />
                    <ToggleControl label='Striped' checked={isStriped} onChange={(value) => setAttributes({ isStriped: value })} />
                    <ToggleControl label='Compact' checked={isCompact} onChange={(value) => setAttributes({ isCompact: value })} />
                    <SelectControl
                        label='Border'
                        value={border}
                        options={[
                            { label: 'Bordered', value: TABLE_BORDERED },
                            { label: 'Borderless', value: TABLE_BORDERLESS },
                        ]}
                        onChange={(value) => setAttributes({ border: value || TABLE_BORDERED })}
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                    />
                    <TextControl label='Caption' value={caption} onChange={(value) => setAttributes({ caption: value })} __next40pxDefaultSize />
                </PanelBody>
                <PanelBody title='Dimensions and borders' initialOpen={false}>
                    <TextControl
                        label='Table width'
                        help='Leave blank for full width. Accepts CSS values such as 640px or 80%.'
                        placeholder='Full width'
                        value={tableWidth}
                        onChange={(value) => setAttributes({ tableWidth: value })}
                        __next40pxDefaultSize
                    />
                    <TextControl
                        label={`Column ${getColumnName(columnStart)} width (px)`}
                        help='Leave blank to size this column automatically.'
                        placeholder='Automatic'
                        type='number'
                        value={normalizedColumns[columnStart]?.width || ''}
                        min={40}
                        onChange={(value) => setColumnWidth(columnStart, value)}
                        __next40pxDefaultSize
                    />
                    <RangeControl
                        label='Border thickness (px)'
                        help='Applies to the whole table and its cells.'
                        value={borderWidth === '' ? undefined : Number(borderWidth)}
                        min={1}
                        max={MAX_BORDER_WIDTH}
                        allowReset
                        onChange={(value) =>
                            setAttributes({
                                borderWidth: value === undefined || value === null ? '' : String(value),
                            })
                        }
                        disabled={border === TABLE_BORDERLESS}
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                    />
                    <SwatchControl id={`excelsior-table-border-color-${clientId}`} label='Border color' options={BORDER_COLORS} value={borderColor} onSelect={(value) => setAttributes({ borderColor: value })} />
                </PanelBody>
                <PanelBody title='Color' initialOpen={false}>
                    <SelectControl
                        label='Apply color to'
                        value={styleScope}
                        options={[
                            {
                                label: 'Selected cells',
                                value: STYLE_SCOPE_CELL,
                            },
                            { label: 'Selected rows', value: STYLE_SCOPE_ROW },
                            {
                                label: 'Selected columns',
                                value: STYLE_SCOPE_COLUMN,
                            },
                        ]}
                        onChange={setStyleScope}
                        __next40pxDefaultSize
                    />
                    <SwatchControl
                        id={`excelsior-table-color-${clientId}`}
                        label='Color'
                        help='A cell color overrides a row color, which overrides a column color.'
                        options={[
                            { label: 'None', value: '' },
                            ...TABLE_VARIANTS.map((variant) => ({
                                label: variant.label,
                                value: variant.className,
                                color: variant.color,
                            })),
                        ]}
                        value={selectedVariant}
                        onSelect={applyVariant}
                    />
                </PanelBody>
            </InspectorControls>
            {mergeWarning && (
                <Notice status='warning' onRemove={() => setMergeWarning('')}>
                    {mergeWarning}
                </Notice>
            )}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- The grid is a focus and keyboard container for Jspreadsheet, which renders its own table and manages cell focus. */}
            <div
                className='excelsior-table-editor__grid'
                /*
				  Plain keys stay inside the grid, or Backspace in an empty cell
				  would delete the whole block. Modified keys are let through so
				  the editor keeps its own shortcuts, including undo and redo.
				  Mouse events propagate so Gutenberg can still select the
				  block, which is what reveals the toolbar and these panels.
				*/
                onKeyDown={(event) => {
                    if (!event.ctrlKey && !event.metaKey) {
                        event.stopPropagation();
                    }
                }}
                onPaste={(event) => event.stopPropagation()}
                ref={containerRef}
            />
            {caption && <div className='excelsior-table-editor__caption'>{caption}</div>}
        </div>
    );
}
