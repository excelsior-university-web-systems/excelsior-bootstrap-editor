import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, BaseControl, Button, ToggleControl } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { createElement } from '@wordpress/element';

const ICONS = [
    { name: 'bi-house-door-fill' },
    { name: 'bi-bookmark-star-fill' },
    { name: 'bi-bookmark-check-fill' },
    { name: 'bi-chat-square-dots-fill' },
    { name: 'bi-journal-text' },
    { name: 'bi-x-diamond-fill' },
    { name: 'bi-search' },
    { name: 'bi-pencil-fill' },
    { name: 'bi-people-fill' },
    { name: 'bi-clipboard-check-fill' }
];

export default function Edit ({ attributes, setAttributes }) {
    
    const { selectedIcon, size, decorative, noIcon, cover } = attributes;

    const handleIconSelect = (iconName) => {
        setAttributes({ selectedIcon: iconName });
    };

    const blockProps = useBlockProps( {
        className: `decorative ${ noIcon ? '' : `bi ${selectedIcon}${size !== 'regular' ? ' ' + size : '' }`}`,
        role: decorative ? 'presentation' : undefined
    } );

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">

                { noIcon == false && (

                    <BaseControl label="Icons">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {ICONS.map((icon) => (
                            <Button
                                key={icon.name}
                                isPressed={selectedIcon === icon.name}
                                onClick={() => handleIconSelect(icon.name)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '20px',
                                    fontSize: '1.25rem',
                                }}
                            >
                                {createElement('i', { className: `bi ${icon.name}` })}
                            </Button>
                        ))}
                    </div>
                    </BaseControl>

                ) }
                
                <ToggleControl
                    label="No Icon"
                    help="Toggle on to remove icon."
                    checked={noIcon}
                    onChange={(value) => setAttributes({ noIcon: value })}
                />
                <ToggleGroupControl
                    label="Size"
                    help="Adjust the size of the icon."
                    value={size}
                    onChange={(value) => setAttributes({ size: value })}
                    isBlock
                >
                    <ToggleGroupControlOption value="small" label="Small" />
                    <ToggleGroupControlOption value="regular" label="Regular" />
                    <ToggleGroupControlOption value="large" label="Large" />
                </ToggleGroupControl>
                <ToggleControl
                    label="Decorative"
                    help="Toggle on to set the horizontal rule as decorative."
                    checked={decorative}
                    onChange={(value) => setAttributes({ decorative: value })}
                />
            </PanelBody>
        </InspectorControls>

        <hr {...blockProps} />
        </>
        
    );
}