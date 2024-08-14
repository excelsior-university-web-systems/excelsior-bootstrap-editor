import { registerFormatType, insert, create, applyFormat, removeFormat } from '@wordpress/rich-text';
import { Fragment, useState, createElement } from '@wordpress/element';
import { Modal, Button, __experimentalGrid as Grid } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { ICONS } from './icons';

// Register the format type
registerFormatType('excelsior-bootstrap/inline-icon', {
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
                      removeFormat(value, 'excelsior-bootstrap/inline-icon', value.start, value.end),
                      {
                          type: 'excelsior-bootstrap/inline-icon',
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
            let newValue = removeFormat(value, 'excelsior-bootstrap/inline-icon', value.start, value.end);
            
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
                        <Grid columns={6} gap={6}>
                            {ICONS.map((icon) => (
                                <Button
                                    key={icon.name}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '80px',
                                        fontSize: '1.8rem',
                                        border: '1px solid #f2f2f2'
                                    }}
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