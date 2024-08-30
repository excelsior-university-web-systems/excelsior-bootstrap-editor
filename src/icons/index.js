import { registerFormatType, insert, create, applyFormat, removeFormat } from '@wordpress/rich-text';
import { Fragment, useState, createElement } from '@wordpress/element';
import { Modal, Button, __experimentalGrid as Grid } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { ICONS } from './icons';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../constants';

const ICON_FORMAT_NAME = XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon';

wp.domReady(() => {

    // Register the format type
    registerFormatType( ICON_FORMAT_NAME, {
        title: 'Insert Icon',
        tagName: 'i',
        className: null,
        edit({ isActive, value, onChange }) {

            const [isOpen, setOpen] = useState(false);
            const openIconModal = () => setOpen(true);
            const closeIconModal = () => setOpen(false);

            const handleIconSelect = (iconName) => {
                const iconHTML = `<i class="bi ${iconName}" role="presentation" aria-hidden="true">&nbsp;</i>`;

                const newValue = isActive
                    ? applyFormat(
                        removeFormat(value, ICON_FORMAT_NAME, value.start, value.end),
                        {
                            type: ICON_FORMAT_NAME,
                            attributes: {
                                class: `bi ${iconName}`,
                                role: 'presentation',
                                'aria-hidden': 'true',
                            },
                        },
                        value.start,
                        value.end
                    )
                    : insert(
                        value,
                        create({ html: iconHTML }),
                        value.start
                    );

                onChange(newValue);
                closeIconModal();
            };

            const handleIconDelete = () => {
                // Remove the format
                let newValue = removeFormat(value, ICON_FORMAT_NAME, value.start, value.end);
                
                const start = newValue.start;
                const end = newValue.end;
            
                // Adjust the text to remove the non-breaking space
                const adjustedText = newValue.text.slice(0, start) + newValue.text.slice(end);
            
                // Update the content with the adjusted text
                newValue = {
                    ...newValue,
                    text: adjustedText,
                };
            
                onChange(newValue);
            };
            
            return (
                <Fragment>
                    <BlockControls>
                        <ToolbarGroup>
                            <ToolbarButton
                                icon="smiley"
                                title={isActive ? "Replace Icon" : "Insert Icon"}
                                onClick={openIconModal}
                                isActive={isActive}
                            />
                            {isActive && (
                                <ToolbarButton
                                    icon="trash"
                                    title="Remove Icon"
                                    onClick={handleIconDelete}
                                    isActive={isActive}
                                />
                            )}
                        </ToolbarGroup>
                    </BlockControls>
                    {isOpen && (
                        <Modal
                            title="Choose an Icon"
                            onRequestClose={closeIconModal}
                        >
                            <Grid columns={8} gap={6}>
                                {ICONS.map((icon) => (
                                    <Button
                                        key={icon.name}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '80px',
                                            border: '1px solid #f2f2f2'
                                        }}
                                        isPressed={ 
                                            value.activeFormats[0] && 
                                            value.activeFormats[0].unregisteredAttributes &&
                                            value.activeFormats[0].unregisteredAttributes.class &&
                                            value.activeFormats[0].unregisteredAttributes.class === "bi " + icon.name
                                        }
                                        onClick={() => handleIconSelect(icon.name)}
                                    >
                                        {createElement('i', { className: `bi ${icon.name}`, style: { fontSize: '3rem' } })}
                                    </Button>
                                ))}
                            </Grid>
                        </Modal>
                    )}
                </Fragment>
            );
        },
    });

});