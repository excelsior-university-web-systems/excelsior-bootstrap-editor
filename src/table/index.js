import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useEffect } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, BaseControl } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../constants';

// Function to modify the core/table block
function modifyTableBlock(settings, name) {

    if (name !== 'core/table') {
        return settings;
    }

    // Remove caption attribute
    if (settings.attributes && settings.attributes.caption) {
        delete settings.attributes.caption;
    }

    // Add custom attributes
    settings.attributes = {
        ...settings.attributes,
        isCompact: {
            type: "boolean",
            default: false
        },
        border: {
            type: "string",
            default: "table-bordered"
        },
        isStriped: {
            type: "boolean",
            default: false
        }
    };

    // Modify supports
    settings.supports = {
        ...settings.supports,
        align: false
    };

    settings.styles = [];

    return settings;
}

// Hook into the blocks.registerBlockType filter
addFilter(
    'blocks.registerBlockType',
    XCLSR_BTSTRP_EDITOR_PREFIX + '/customize-core-table',
    modifyTableBlock
);

// Create a Higher-Order Component (HOC) to add a custom class in the editor
const modifyTableEditor = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/table') {
            return <BlockEdit {...props} />;
        }

        const { border, isStriped, isCompact } = props.attributes;

        const applyClasses = (tableElement) => {

            if (tableElement) {
                const classArray = ['table', border, isStriped ? 'table-striped' : '', isCompact ? 'table-sm' : ''].filter(Boolean);
                tableElement.classList.add(...classArray);
            }

        };

        useEffect(() => {

            const blockElement = document.querySelector(`[data-block="${props.clientId}"]`);

            if (!blockElement) return;

            // Create a MutationObserver to watch for changes in the block element
            const observer = new MutationObserver(() => {
                const tableElement = blockElement.querySelector('table');
                applyClasses(tableElement);
            });

            // Start observing the block element for childList changes
            observer.observe(blockElement, {
                childList: true,
                subtree: true,
            });

            // Initial application of classes
            const initialTableElement = blockElement.querySelector('table');
            applyClasses(initialTableElement);

            // Cleanup observer on unmount
            return () => {
                observer.disconnect();
                if (initialTableElement) {
                    const classArray = ['table', border, isStriped ? 'table-striped' : '', isCompact ? 'table-sm' : ''].filter(Boolean);
                    initialTableElement.classList.remove(...classArray);
                }
            };
        }, [props.clientId, border, isStriped, isCompact]);

        return (
            <Fragment>
                <BlockEdit {...props} {...useBlockProps()} />
                <InspectorControls>
                    {props.isSelected && (
                        <PanelBody>
                            <BaseControl label="Styles" __nextHasNoMarginBottom>
                                <ToggleControl
                                    label="Striped"
                                    checked={isStriped}
                                    onChange={(value) => props.setAttributes({ isStriped: value })}
                                    __nextHasNoMarginBottom
                                />
                                <ToggleControl
                                    label="Compact"
                                    checked={isCompact}
                                    onChange={(value) => props.setAttributes({ isCompact: value })}
                                    __nextHasNoMarginBottom
                                />
                            </BaseControl>
                            <ToggleGroupControl
                                label="Border"
                                value={border}
                                onChange={(value) => props.setAttributes({ border: value })}
                                isBlock
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            >
                                <ToggleGroupControlOption value="" label="Simple" />
                                <ToggleGroupControlOption value="table-bordered" label="Bordered" />
                                <ToggleGroupControlOption value="table-borderless" label="Borderless" />
                            </ToggleGroupControl>
                        </PanelBody>
                    )}
                </InspectorControls>
            </Fragment>
        );
    };
}, 'modifyTableEditor');

// Hook into the editor.BlockEdit filter
addFilter(
    'editor.BlockEdit',
    XCLSR_BTSTRP_EDITOR_PREFIX + '/modify-table-editor',
    modifyTableEditor
);

// Function to filter the save element
function filterTableSave(element, blockType, attributes) {
    if (blockType.name !== 'core/table') {
        return element;
    }

    // Ensure the element is valid and is a figure
    if (element && element.type === 'figure') {

        // Extract the children of the figure element (usually the table and optionally the caption)
        const tableElement = element.props.children.find((child) => child.type === 'table');
        
        const {border, isStriped, isCompact} = attributes;
        const classes = `table${border.length ? ' ' + border : ''}${isStriped ? ' table-striped' : ''}${isCompact ? ' table-sm' : ''}`;

        tableElement.props.className = `${tableElement.props.className || ''} ${classes}`.trim();

        return tableElement; // Return only the table element
    }

    return element;
}

// Hook into the blocks.getSaveElement filter
addFilter(
    'blocks.getSaveElement',
    XCLSR_BTSTRP_EDITOR_PREFIX + '/filter-table-save',
    filterTableSave
);