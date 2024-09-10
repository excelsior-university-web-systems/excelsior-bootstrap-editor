import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {

    const { tabStyle } = attributes;
    const blockProps = useBlockProps.save({
        className: tabStyle,
    });

    return (
        <div {...blockProps}>
            <ul className="nav nav-tabs" role="tablist">
                {attributes.tabs.map((tab, index) => (
                    <li className="nav-item" role="presentation" key={tab.uniqueId}>
                        <a
                            href="#"
                            id={`${tab.uniqueId}-tab`}
                            className={`nav-link ${index === 0 ? 'active' : ''}`}
                            role="tab"
                            data-bs-toggle="tab"
                            data-bs-target={`#${tab.uniqueId}-pane`}
                            aria-controls={`${tab.uniqueId}-pane`}
                            aria-selected={index === 0 ? 'true' : 'false'}
                            dangerouslySetInnerHTML = { {__html: tab.title || `Tab ${index + 1}`}}
                        />
                    </li>
                ))}
            </ul>

            <div className="tab-content">
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
