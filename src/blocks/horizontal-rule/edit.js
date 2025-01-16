import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, BaseControl, Button, ToggleControl, Tooltip, SelectControl } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { createElement } from '@wordpress/element';

const ICONS = [
    { name: 'bi-house-door-fill', label: 'Homepage' },
    { name: 'bi-bookmark-star-fill', label: 'Getting Started Page' },
    { name: 'bi-bookmark-check-fill', label: 'Module Reflection Page' },
    { name: 'bi-chat-square-dots-fill', label: 'Discussion Page' },
    { name: 'bi-journal-text', label: 'Instructor Notes Page' },
    { name: 'bi-x-diamond-fill', label: 'Module Overview Page' },
    { name: 'bi-search', label: 'Lesson or Module Page' },
    { name: 'bi-pencil-fill', label: 'Assignment Page' },
    { name: 'bi-people-fill', label: 'Live Session Page' },
    { name: 'bi-clipboard-check-fill', label: 'Quiz or Knowledge Check Page' },
    { name: 'bi-list-check', label: 'Session Sign Up Page' },
    { name: 'bi-easel', label: 'Verbal Competency Session Page' }
];

export default function Edit ({ attributes, setAttributes }) {
    
    const { selectedIcon, size, decorative, noIcon, cover, styleType } = attributes;

    const handleIconSelect = (iconName) => {
        setAttributes({ selectedIcon: iconName });
    };

    const determineClassNames = () => {
        if ( styleType !== 'basic' ) {
            setAttributes( { noIcon: false, decorative: true } );
            return `decorative ${styleType !== 'red' ? styleType : '' } ${ noIcon ? '' : `bi ${selectedIcon}${size !== 'regular' ? ' ' + size : '' }`}`
        }
        setAttributes( { noIcon: true, decorative: false } );
        return '';
    };

    const blockProps = useBlockProps( {
        className: determineClassNames(),
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

                <SelectControl
                    label="Styles"
                    value={styleType}
                    options={[
                        { label: 'Basic', value: 'basic' },
                        { label: 'Red (Default)', value: 'red' },
                        { label: 'Blue', value: 'blue' },
                        { label: 'Purple', value: 'purple' },
                    ]}
                    onChange={(value) => setAttributes({ styleType: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />

                { noIcon == false && (

                    <BaseControl label="Icons" __nextHasNoMarginBottom>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {ICONS.map((icon) => (
                            <Tooltip text={icon.label} delay={500} placement='top'>
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
                                    __nextHasNoMarginBottom
                                    __next40pxDefaultSize
                                >
                                    {createElement('i', { className: `bi ${icon.name}` })}
                                </Button>
                            </Tooltip>
                        ))}
                    </div>
                    </BaseControl>

                ) }

                <ToggleControl
                    label="No Icon"
                    help="Toggle on to remove icon."
                    checked={noIcon}
                    disabled={styleType === 'basic'}
                    onChange={(value) => setAttributes({ noIcon: value })}
                    __nextHasNoMarginBottom
                />
                { styleType !== 'basic' && ( <ToggleGroupControl
                    label="Size"
                    help="Adjust the size of the icon."
                    value={size}
                    onChange={(value) => setAttributes({ size: value })}
                    isBlock
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                >
                    <ToggleGroupControlOption value="small" label="Small" />
                    <ToggleGroupControlOption value="regular" label="Regular" />
                    <ToggleGroupControlOption value="large" label="Large" />
                </ToggleGroupControl>
                )}
                <ToggleControl
                    label="Decorative"
                    help="Toggle on to set the horizontal rule as decorative."
                    checked={decorative}
                    onChange={(value) => setAttributes({ decorative: value })}
                    __nextHasNoMarginBottom
                />
            </PanelBody>
        </InspectorControls>

        <hr {...blockProps} />
        </>
        
    );
}