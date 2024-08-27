import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useEffect } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
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

     // Remove the 'hasFixedLayout' attribute if it exists
     if (settings.attributes && settings.attributes.hasFixedLayout) {
        delete settings.attributes.hasFixedLayout;
    }

    console.log(settings.attributes);

    // Modify default attribute
    // settings.attributes.hasFixedLayout = {
    //     type: 'boolean',
    //     default: false
    // };

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
const withCustomTableClass = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/table') {
            return <BlockEdit {...props} />;
        }

        const blockProps = useBlockProps();

        useEffect(() => {
            const tableElement = document.querySelector(`[data-block="${props.clientId}"] table`);

            if (tableElement) {
                tableElement.classList.add('table'); // Add your custom class here
            }

            // Cleanup function to remove the class when the block is unmounted or re-rendered
            return () => {
                if (tableElement) {
                    tableElement.classList.remove('table');
                }
            };
        }, [props.clientId]);

        return <BlockEdit {...props} {...blockProps} />;
        // return (
        //     <Fragment>
        //         <InspectorControls>
        //             {props.isSelected && (
        //                 <PanelBody title="Table Settings">
        //                     {/* Insert your custom controls here or modify existing ones */}
        //                     {/* Other table settings will go here */}
        //                     {/* You can also remove specific controls by not rendering them */}
        //                 </PanelBody>
        //             )}
        //         </InspectorControls>
        //         <BlockEdit {...props} {...blockProps} />
        //     </Fragment>
        // );
    };
}, 'withCustomTableClass');

// Hook into the editor.BlockEdit filter
addFilter(
    'editor.BlockEdit',
    XCLSR_BTSTRP_EDITOR_PREFIX + '/add-custom-table-class',
    withCustomTableClass
);

// Function to filter the save element
function filterTableSave(element, blockType) {
    if (blockType.name !== 'core/table') {
        return element;
    }

    // Ensure the element is valid and is a figure
    if (element && element.type === 'figure') {
        // Extract the children of the figure element (usually the table and optionally the caption)
        const tableElement = element.props.children.find((child) => child.type === 'table');
        tableElement.props.className = `${tableElement.props.className || ''} table`.trim();
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