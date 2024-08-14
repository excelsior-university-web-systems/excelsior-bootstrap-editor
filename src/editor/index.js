import { addFilter } from '@wordpress/hooks';

function removeBlockAlignment(settings) {
    // Check if the block supports alignment and remove it
    if (settings.supports && settings.supports.align) {
        settings.supports = {
            ...settings.supports,
            align: false,
        };
    }

    return settings;
}

// Add filter to modify block settings
addFilter(
    'blocks.registerBlockType',
    'excelsior-bootstrap/remove-block-alignment',
    removeBlockAlignment
);

wp.domReady(() => {
    wp.richText.unregisterFormatType('core/image');        // Remove inline image
    wp.richText.unregisterFormatType('core/text-color');   // Remove text color/highlight
    wp.richText.unregisterFormatType('core/language');     // Example for language button
    wp.richText.unregisterFormatType('core/keyboard');     // Example for keyboard input button
});
