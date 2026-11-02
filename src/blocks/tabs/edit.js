import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { useMinimumChildBlocks } from '../../commons';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import metadata from './block.json';

const TAB_BLOCK = XCLSR_BTSTRP_EDITOR_PREFIX + '/tab';
const MIN_TABS = 2;
const TEMPLATE = [
    [TAB_BLOCK],
    [TAB_BLOCK],
];

export default function Edit({ attributes, setAttributes, clientId }) {

    const { tabStyle } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps({
        className: 'mb-3 ' + tabStyle,
    });
    const tabBlocks = useMinimumChildBlocks( {
        clientId,
        blockName: TAB_BLOCK,
        minimum: MIN_TABS,
        isPreview,
    } );

    // Initialize tabs if not present
    useEffect(() => {
        if ( isPreview ) {
            return;
        }

        if (!attributes.tabs) {
            setAttributes({ tabs: [] });
        }
    }, [ attributes.tabs, isPreview ] );

    const childTabs = tabBlocks.map(
        ( block ) => block.attributes || { title: '', uniqueId: '' }
    );

    // Update the parent block's "tabs" attribute when child tabs change
    useEffect(() => {
        if ( isPreview ) {
            return;
        }
        
        // Compare current childTabs with attributes.tabs
        if ( JSON.stringify( childTabs ) !== JSON.stringify( attributes.tabs ) ) {
            setAttributes({ tabs: childTabs });
        }

        // The first tab is always active
        if ( childTabs.length > 0 && ( !attributes.activeTab || attributes.activeTab !== childTabs[0].uniqueId ) ) {
            setAttributes({ activeTab: childTabs[0].uniqueId });
        }

    }, [ attributes.activeTab, attributes.tabs, childTabs, isPreview, setAttributes ] );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }
    
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
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <ul className="nav nav-tabs" role="tablist">
                {childTabs.map((tab, index) => (
                    <li className="nav-item" key={tab.uniqueId || index}>
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
                            dangerouslySetInnerHTML = { {__html: tab.title || ' '}}
                        />
                    </li>
                ))}
            </ul>

            <div className="tab-content">
                <InnerBlocks
                    allowedBlocks={[TAB_BLOCK]}
                    template={TEMPLATE}
                    templateLock={false}
                />
            </div>
        </div>
        </>
    );
}
