import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, clientId }) {

    const {tabHeadingLevel, tabHeadingLevelClass, tabStyle} = attributes;

    const blockProps = useBlockProps({
        className: tabStyle,
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
        <>
        <InspectorControls>
            <PanelBody title='Settings'>
                <SelectControl
                    label="Tab Style"
                    value={tabStyle}
                    options={[
                        { label: 'Regular', value: 'excelsior-tabs' },
                        { label: 'Large', value: 'excelsior-lg-tabs' }
                    ]}
                    onChange={(value) => setAttributes({ tabStyle: value })}
                />
                <SelectControl
                    label="Heading Level"
                    help="The heading level of the first heading that appears in the tab's content."
                    value={tabHeadingLevel}
                    options={[
                        { label: 'H2', value: 'h2' },
                        { label: 'H3', value: 'h3' },
                        { label: 'H4', value: 'h4' },
                        { label: 'H5', value: 'h5' },
                        { label: 'H6', value: 'h6' },
                    ]}
                    onChange={(value) => setAttributes({ tabHeadingLevel: value })}
                />
                <SelectControl
                    label="Heading Level Size"
                    help="Set the font size of the first heading to use the size of a different heading level."
                    value={tabHeadingLevelClass}
                    options={[
                        { label: 'H1', value: 'h1' },
                        { label: 'H2', value: 'h2' },
                        { label: 'H3', value: 'h3' },
                        { label: 'H4', value: 'h4' },
                        { label: 'H5', value: 'h5' },
                        { label: 'H6', value: 'h6' },
                    ]}
                    onChange={(value) => setAttributes({ tabHeadingLevelClass: value })}
                />
            </PanelBody>
        </InspectorControls>
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
        </>
    );
}
