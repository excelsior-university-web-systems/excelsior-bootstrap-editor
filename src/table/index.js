import domReady from '@wordpress/dom-ready';
import { registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Children, Fragment, cloneElement, isValidElement, useEffect } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { dispatch, select, subscribe, useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX, XCLSR_BTSTRP_POST_TYPE } from '../constants';

const CORE_TABLE_BLOCK = 'core/table';
const CONTAINER_BLOCK = `${XCLSR_BTSTRP_EDITOR_PREFIX}/container`;
const BOOTSTRAP_TABLE_VARIATION_NAME = `${XCLSR_BTSTRP_EDITOR_PREFIX}/bootstrap-table`;
const TABLE_BORDERED = 'table-bordered';
const TABLE_BORDERLESS = 'table-borderless';
const MANAGED_TABLE_CLASSES = ['table', 'table-sm', 'table-striped', TABLE_BORDERED, TABLE_BORDERLESS];
const BOOTSTRAP_TABLE_VARIATION_ATTRIBUTES = {
    isBootstrapTableVariant: true,
    isCompact: false,
    isStriped: false,
    border: TABLE_BORDERED,
    fixedLayout: false,
    hasFixedLayout: false,
};
const BOOTSTRAP_TABLE_VARIATION = {
    name: BOOTSTRAP_TABLE_VARIATION_NAME,
    title: 'Bootstrap Table',
    description: 'A table with bordered, striped, and compact options.',
    isDefault: true,
    attributes: BOOTSTRAP_TABLE_VARIATION_ATTRIBUTES,
    isActive: (blockAttributes) => blockAttributes.isBootstrapTableVariant === true,
    scope: ['inserter', 'block'],
};

let isBootstrapTableVariationRegistered = false;
let isConvertingContainerTables = false;

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

const isExcelsiorBootstrapPostType = () => {
    const editorStore = select('core/editor');

    if (!editorStore || !editorStore.getCurrentPostType) {
        return false;
    }

    return editorStore.getCurrentPostType() === XCLSR_BTSTRP_POST_TYPE;
};

const isBlockInsideContainer = (clientId) => {
    if (!clientId) {
        return false;
    }

    const blockEditorStore = select('core/block-editor');

    if (!blockEditorStore || !blockEditorStore.getBlockParents || !blockEditorStore.getBlockName) {
        return false;
    }

    const parentClientIds = blockEditorStore.getBlockParents(clientId);

    return parentClientIds.some((parentClientId) => {
        return blockEditorStore.getBlockName(parentClientId) === CONTAINER_BLOCK;
    });
};

const isBootstrapTableEligible = (clientId) => {
    return isExcelsiorBootstrapPostType() || isBlockInsideContainer(clientId);
};

const getContainerTableBlocks = (blocks = [], isInsideContainer = false) => {
    return blocks.flatMap((block) => {
        const nextIsInsideContainer = isInsideContainer || block.name === CONTAINER_BLOCK;
        const matchingBlocks = nextIsInsideContainer && block.name === CORE_TABLE_BLOCK ? [block] : [];

        return [
            ...matchingBlocks,
            ...getContainerTableBlocks(block.innerBlocks || [], nextIsInsideContainer),
        ];
    });
};

const convertContainerTablesToBootstrapVariation = () => {
    if (isConvertingContainerTables || isExcelsiorBootstrapPostType()) {
        return;
    }

    const blockEditorStore = select('core/block-editor');

    if (!blockEditorStore || !blockEditorStore.getBlocks) {
        return;
    }

    const blocksNeedingConversion = getContainerTableBlocks(blockEditorStore.getBlocks()).filter((block) => {
        return block.attributes?.isBootstrapTableVariant !== true;
    });

    if (!blocksNeedingConversion.length) {
        return;
    }

    isConvertingContainerTables = true;

    try {
        dispatch('core/block-editor').updateBlockAttributes(
            blocksNeedingConversion.map((block) => block.clientId),
            BOOTSTRAP_TABLE_VARIATION_ATTRIBUTES
        );
    } finally {
        isConvertingContainerTables = false;
    }
};

const registerBootstrapTableVariation = () => {
    if (isBootstrapTableVariationRegistered) {
        return;
    }

    isBootstrapTableVariationRegistered = true;

    try {
        registerBlockVariation(CORE_TABLE_BLOCK, BOOTSTRAP_TABLE_VARIATION);
    } catch (error) {
        isBootstrapTableVariationRegistered = false;
        throw error;
    }
};

const syncBootstrapTableVariationRegistration = () => {
    if (isExcelsiorBootstrapPostType()) {
        registerBootstrapTableVariation();
    }
};

domReady(() => {
    const syncBootstrapTableState = () => {
        if (!isBootstrapTableVariationRegistered) {
            syncBootstrapTableVariationRegistration();
        }

        convertContainerTablesToBootstrapVariation();
    };

    syncBootstrapTableState();
    subscribe(syncBootstrapTableState);
});

function modifyTableBlock(settings, name) {
    if (name !== CORE_TABLE_BLOCK) {
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
        if (props.name !== CORE_TABLE_BLOCK) {
            return <BlockEdit {...props} />;
        }

        const isEligible = useSelect(() => isBootstrapTableEligible(props.clientId), [props.clientId]);
        const { isBootstrapTableVariant, border, isStriped, isCompact } = props.attributes;

        useEffect(() => {
            if (!isEligible || !isBootstrapTableVariant) {
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
        }, [props.attributes, props.clientId, isEligible, isBootstrapTableVariant, border, isStriped, isCompact]);

        if (!isEligible || !isBootstrapTableVariant) {
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
    if (blockType.name !== CORE_TABLE_BLOCK || !attributes.isBootstrapTableVariant || !isValidElement(element) || element.type !== 'figure') {
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
