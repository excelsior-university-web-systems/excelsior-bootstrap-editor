import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, BaseControl, Button, ToggleControl, Tooltip, SelectControl } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { createElement } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import metadata from './block.json';

const ICONS = [
    { name: 'bi-signpost-split', label: 'Orientation' },
    { name: 'bi-house', label: 'Homepage' },
    { name: 'bi-x-diamond', label: 'Module Overview' },
    { name: 'bi-alphabet-uppercase', label: 'Key Terms' },
    { name: 'bi-easel', label: 'Lesson' },
    { name: 'bi-bookmark-star', label: 'Key Takeaways' },
    { name: 'bi-chat-square-text', label: 'Discussion' },
    { name: 'bi-journal-text', label: 'Assignment' },
    { name: 'bi-patch-question', label: 'Knowledge Check' },
    { name: 'bi-clipboard-check', label: 'Quiz / Exam' },
    { name: 'bi-broadcast', label: 'Live Session' },
    { name: 'bi-boxes', label: 'SkillSource/Immersive' },
    { name: 'bi-gear', label: 'Technical Guide' },
    { name: 'bi-person-exclamation', label: 'Instructor Notes' },
];

const DEPRECATED_ICONS = [
    { name: 'bi-box', label: 'Immersive Page' },
    { name: 'bi-bookmark-check-fill', label: 'Module Reflection Page' },
    { name: 'bi-bookmark-star-fill', label: 'Getting Started Page' },
    { name: 'bi-building-fill', label: 'Insight Industry' },
    { name: 'bi-clipboard-check-fill', label: 'Quiz or Knowledge Check Page' },
    { name: 'bi-chat-square-dots-fill', label: 'Discussion Page' },
    { name: 'bi-compass', label: 'Orientation Page' },
    { name: 'bi-easel', label: 'Verbal Competency Session Page' },
    { name: 'bi-house-door-fill', label: 'Homepage' },
    { name: 'bi-gear-fill', label: 'Technical Guide' },
    { name: 'bi-globe', label: 'Real-World Examples' },
    { name: 'bi-journal-text', label: 'Instructor Notes Page' },
    { name: 'bi-lightbulb', label: 'Reflect' },
    { name: 'bi-list-check', label: 'Session Sign Up Page' },
    { name: 'bi-pencil-fill', label: 'Assignment Page' },
    { name: 'bi-people-fill', label: 'Live Session Page' },
    { name: 'bi-puzzle-fill', label: 'SkillSource Page'},
    { name: 'bi-search', label: 'Lesson or Module Page' },
    { name: 'bi-x-diamond-fill', label: 'Module Overview Page' },
];

export default function Edit ({ attributes, setAttributes }) {
    
    const { selectedIcon, size, decorative, noIcon, styleType } = attributes;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const handleIconSelect = (iconName) => {
        setAttributes({ selectedIcon: iconName });
    };

    const handleStyleChange = (style) => {
        setAttributes({styleType: style.value})
        blockProps.className = determineClassNames();
    };

    const determineClassNames = () => {
        if ( styleType !== 'basic' ) {
            return `decorative red ${ noIcon ? '' : `bi ${selectedIcon}${size !== 'regular' ? ' ' + size : '' }`}`
        }
        return '';
    };

    const blockProps = useBlockProps( {
        className: determineClassNames(),
        role: decorative ? 'presentation' : undefined
    } );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
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
                    ]}
                    onChange={(value) => handleStyleChange({ value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />

                { noIcon == false && styleType !== 'basic' && (
                    <>
                    <BaseControl label="Page Type Icons" __nextHasNoMarginBottom>
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
                    <BaseControl label="Deprecated Icons" className="deprecated" __nextHasNoMarginBottom>
                    <p className='do-not-use-msg'><strong>DO NOT USE; WILL BE REMOVED IN THE NEAR FUTURE</strong></p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {DEPRECATED_ICONS.map((icon) => (
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
                    </>

                ) }

                <ToggleControl
                    label="No Icon"
                    help="Toggle on to remove page type icon."
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
