import { registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Children, Fragment, cloneElement, isValidElement, useEffect } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../constants';

const BOOTSTRAP_TABLE_VARIATION_NAME = `${XCLSR_BTSTRP_EDITOR_PREFIX}/bootstrap-table`;
const TABLE_BORDERED = 'table-bordered';
const TABLE_BORDERLESS = 'table-borderless';
const MANAGED_TABLE_CLASSES = ['table', 'table-sm', 'table-striped', TABLE_BORDERED, TABLE_BORDERLESS];

const getBootstrapTableClasses = (attributes = {}) => {
    const { border = TABLE_BORDERED, isStriped = false, isCompact = false } = attributes;

    return ['table', border === TABLE_BORDERLESS ? TABLE_BORDERLESS : TABLE_BORDERED, isStriped ? 'table-striped' : '', isCompact ? 'table-sm' : ''].filter(Boolean);
};

const syncTableClasses = (tableElement, attributes) => {
    if (!tableElement) {
        return;
    }

    tableElement.classList.remove(...MANAGED_TABLE_CLASSES);
    tableElement.classList.add(...getBootstrapTableClasses(attributes));
};

const getEditorDocuments = () => {
    const iframeDocuments = Array.from(document.querySelectorAll('iframe'))
        .map((iframe) => iframe.contentDocument)
        .filter(Boolean);

    return [document, ...iframeDocuments];
};

const findBlockElement = (clientId) => {
    for (const editorDocument of getEditorDocuments()) {
        const blockElement = editorDocument.querySelector(`[data-block="${clientId}"]`);

        if (blockElement) {
            return blockElement;
        }
    }

    return null;
};

registerBlockVariation('core/table', {
    name: BOOTSTRAP_TABLE_VARIATION_NAME,
    title: 'Bootstrap Table',
    description: 'A table with bordered, striped, and compact options.',
    isDefault: true,
    attributes: {
        isBootstrapTableVariant: true,
        isCompact: false,
        isStriped: false,
        border: TABLE_BORDERED,
        fixedLayout: false,
        hasFixedLayout: false,
    },
    isActive: (blockAttributes) => blockAttributes.isBootstrapTableVariant === true,
    scope: ['inserter', 'block'],
});

function modifyTableBlock(settings, name) {
    if (name !== 'core/table') {
        return settings;
    }

    settings.attributes = {
        ...settings.attributes,
        hasFixedLayout: {
            ...settings.attributes?.hasFixedLayout,
            type: 'boolean',
            default: false,
        },
        isBootstrapTableVariant: {
            type: 'boolean',
            default: false,
        },
        isCompact: {
            type: 'boolean',
            default: false,
        },
        border: {
            type: 'string',
            default: TABLE_BORDERED,
        },
        isStriped: {
            type: 'boolean',
            default: false,
        },
    };

    settings.styles = [];

    return settings;
}

addFilter('blocks.registerBlockType', `${XCLSR_BTSTRP_EDITOR_PREFIX}/customize-core-table`, modifyTableBlock);

const modifyTableEditor = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/table') {
            return <BlockEdit {...props} />;
        }

        const { isBootstrapTableVariant, border, isStriped, isCompact } = props.attributes;

        useEffect(() => {
            if (!isBootstrapTableVariant) {
                return undefined;
            }

            let observedBlockElement = null;
            let blockObserver = null;
            const rootObservers = [];

            const applyManagedClasses = () => {
                const blockElement = findBlockElement(props.clientId);

                if (!blockElement) {
                    return;
                }

                if (observedBlockElement !== blockElement) {
                    blockObserver?.disconnect();
                    observedBlockElement = blockElement;

                    const MutationObserverClass =
                        blockElement.ownerDocument.defaultView?.MutationObserver ||
                        MutationObserver;

                    blockObserver = new MutationObserverClass(() => {
                        const nextTableElement = blockElement.querySelector('table');
                        syncTableClasses(nextTableElement, props.attributes);
                    });

                    blockObserver.observe(blockElement, {
                        childList: true,
                        subtree: true,
                    });
                }

                const tableElement = blockElement.querySelector('table');
                syncTableClasses(tableElement, props.attributes);
            };

            getEditorDocuments().forEach((editorDocument) => {
                if (!editorDocument.body) {
                    return;
                }

                const MutationObserverClass =
                    editorDocument.defaultView?.MutationObserver || MutationObserver;
                const rootObserver = new MutationObserverClass(applyManagedClasses);

                rootObserver.observe(editorDocument.body, {
                    childList: true,
                    subtree: true,
                });

                rootObservers.push(rootObserver);
            });

            applyManagedClasses();

            return () => {
                blockObserver?.disconnect();
                rootObservers.forEach((observer) => observer.disconnect());

                const tableElement = observedBlockElement?.querySelector('table');

                if (tableElement) {
                    tableElement.classList.remove(...MANAGED_TABLE_CLASSES);
                }
            };
        }, [props.attributes, props.clientId, isBootstrapTableVariant, border, isStriped, isCompact]);

        if (!isBootstrapTableVariant) {
            return <BlockEdit {...props} />;
        }

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    {props.isSelected && (
                        <PanelBody title='Bootstrap Table'>
                            <ToggleControl label='Striped' checked={isStriped} onChange={(value) => props.setAttributes({ isStriped: value })} __nextHasNoMarginBottom />
                            <ToggleControl label='Compact' checked={isCompact} onChange={(value) => props.setAttributes({ isCompact: value })} __nextHasNoMarginBottom />
                            <ToggleGroupControl
                                label='Border'
                                value={border}
                                onChange={(value) =>
                                    props.setAttributes({
                                        border: value || TABLE_BORDERED,
                                    })
                                }
                                isBlock
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom>
                                <ToggleGroupControlOption value={TABLE_BORDERED} label='Bordered' />
                                <ToggleGroupControlOption value={TABLE_BORDERLESS} label='Borderless' />
                            </ToggleGroupControl>
                        </PanelBody>
                    )}
                </InspectorControls>
            </Fragment>
        );
    };
}, 'modifyTableEditor');

addFilter('editor.BlockEdit', `${XCLSR_BTSTRP_EDITOR_PREFIX}/modify-table-editor`, modifyTableEditor);

function filterTableSave(element, blockType, attributes) {
    if (blockType.name !== 'core/table' || !attributes.isBootstrapTableVariant || !isValidElement(element) || element.type !== 'figure') {
        return element;
    }

    const children = Children.map(element.props.children, (child) => {
        if (!isValidElement(child) || child.type !== 'table') {
            return child;
        }

        const existingClasses = (child.props.className || '')
            .split(/\s+/)
            .filter(Boolean)
            .filter((className) => !MANAGED_TABLE_CLASSES.includes(className));
        const className = [...existingClasses, ...getBootstrapTableClasses(attributes)].join(' ').trim();

        return cloneElement(child, { className });
    });

    return cloneElement(element, undefined, children || element.props.children);
}

addFilter('blocks.getSaveElement', `${XCLSR_BTSTRP_EDITOR_PREFIX}/filter-table-save`, filterTableSave);
