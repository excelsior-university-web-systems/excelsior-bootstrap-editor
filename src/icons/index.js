import { registerFormatType, insert, create } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

// Register the format type
registerFormatType('excelsior-bootstrap/inline-icon', {
    title: 'Insert Icon',
    tagName: 'i',
    className: null,
    edit({ isActive, value, onChange }) {
        const openIconPrompt = () => {
            const iconName = prompt(
                'Enter the Bootstrap Icon class (e.g., bi-house-door-fill):'
            );

            if (iconName) {
                // Create the icon HTML
                const iconHTML = `<i class="bi ${iconName}" role="presentation" aria-hidden="true"></i>`;

                // Insert the icon at the cursor position
                const newValue = insert(
                    value,
                    create({
                        html: iconHTML,
                    }),
                    value.start
                );

                // Update the content
                onChange(newValue);
            }
        };

        return (
            <Fragment>
                <RichTextToolbarButton
                    icon="smiley"
                    title="Insert Icon"
                    onClick={openIconPrompt}
                    isActive={isActive}
                />
            </Fragment>
        );
    },
});
