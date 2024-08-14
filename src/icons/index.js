import { registerFormatType, insert, create, applyFormat, removeFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Fragment, useState, createElement } from '@wordpress/element';
import { Modal, Button, __experimentalGrid as Grid } from '@wordpress/components';

// Array of available icons
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
                {isActive && (
                    <RichTextToolbarButton
                        icon="trash"
                        title="Remove Icon"
                        onClick={handleIconDelete}
                        isActive={isActive}
                        priority={10}
                    />
                )}
                <RichTextToolbarButton
                    icon="smiley"
                    title="Insert Icon"
                    onClick={openIconModal}
                    isActive={isActive}
                    priority={10}
                />
                {isOpen && (
                    <Modal
                        title="Choose an Icon"
                        onRequestClose={closeIconModal}
                    >
                        <Grid columns={4} gap={8}>
                            {ICONS.map((icon) => (
                                <Button
                                    key={icon.name}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '80px',
                                        fontSize: '2rem',
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