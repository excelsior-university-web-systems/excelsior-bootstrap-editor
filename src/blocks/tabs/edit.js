import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({
        className: 'excelsior-tabs',
    });

    // Initialize tabs if not present
    useEffect(() => {
        if (!attributes.tabs) {
            setAttributes({ tabs: [] });
        }
    }, []);

    const childTabs = useSelect(
        (select) => {
            const { getBlockOrder, getBlockAttributes } = select('core/block-editor');
            const innerBlockIds = getBlockOrder(clientId);

            return innerBlockIds.map((innerBlockId) => {
                const attributes = getBlockAttributes(innerBlockId);
                return attributes ? attributes : { title: '', uniqueId: '' };
            });
        },
        [clientId]
    );

    // The first tab is always active
    useEffect(() => {
        if (childTabs.length > 0 && (!attributes.activeTab || attributes.activeTab !== childTabs[0].uniqueId)) {
            setAttributes({ activeTab: childTabs[0].uniqueId });
        }
    }, [childTabs]);

    // Update the parent block's "tabs" attribute when child tabs change
    useEffect(() => {
        // Compare current childTabs with attributes.tabs
        if (JSON.stringify(childTabs) !== JSON.stringify(attributes.tabs)) {
            setAttributes({ tabs: childTabs });
        }
    }, [childTabs]);

    return (
        <div {...blockProps}>
            <ul className="nav nav-tabs" role="tablist">
                {childTabs.map((tab, index) => (
                    <li className="nav-item" role="presentation" key={tab.uniqueId || index}>
                        <a
                            href="#"
                            id={`${tab.uniqueId}-tab`}
                            className={`nav-link ${index === 0 ? 'active' : ''}`}
                            role="tab"
                            data-bs-toggle="tab"
                            data-bs-target={`#${tab.uniqueId}-pane`}
                            aria-controls={`${tab.uniqueId}-pane`}
                            aria-selected={index === 0 ? 'true' : 'false'}
                            onClick={(e)=>{e.preventDefault()}}
                            dangerouslySetInnerHTML = { {__html: tab.title || `Tab ${index + 1}`}}
                        />
                    </li>
                ))}
            </ul>

            <div className="tab-content">
                <InnerBlocks
                    allowedBlocks={['excelsior-bootstrap-editor/tab']}
                    template={[['excelsior-bootstrap-editor/tab']]}
                    templateLock={false}
                />
            </div>
        </div>
    );
}
