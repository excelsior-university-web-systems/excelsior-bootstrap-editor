import { addFilter } from '@wordpress/hooks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../constants';

import { registerPlugin } from '@wordpress/plugins';
import { PluginPostStatusInfo } from '@wordpress/editor';
import { Button, Modal, Notice, __experimentalText as Text, PanelBody } from '@wordpress/components';
import { select, useSelect  } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import beautify from 'js-beautify';

window.Prism = window.Prism || {};
Prism.manual = true;

function removeBlockAlignment( settings ) {

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
    XCLSR_BTSTRP_EDITOR_PREFIX + '/remove-block-alignment',
    removeBlockAlignment
);

wp.domReady(() => {
    wp.richText.unregisterFormatType('core/image');        // Remove inline image
    wp.richText.unregisterFormatType('core/text-color');   // Remove text color/highlight
    wp.richText.unregisterFormatType('core/language');     // Example for language button
    wp.richText.unregisterFormatType('core/keyboard');     // Example for keyboard input button

    setTimeout( function() {
        
        wp.data.dispatch( 'core/block-editor' ).updateSettings({
            typography: {},
            fontSizes: [],
            disableCustomFontSizes: true, 
            colors: [],
            disableCustomColors: true,
            disableCustomGradients: true,
            gradients: [],
            __experimentalFeatures: []
        });

    }, 3000);
    
});

// Define the button component
const GetCodeButton = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [renderedHTML, setRenderedHTML] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const { isSaving, hasUnsavedChanges, postStatus } = useSelect((select) => {
        const editorStore = select('core/editor');
        return {
            isSaving: editorStore.isSavingPost(),
            hasUnsavedChanges: editorStore.hasChangedContent(),
            postStatus: editorStore.getEditedPostAttribute('status'),
        };
    });
    const isDisabled = isSaving || hasUnsavedChanges || postStatus !== 'publish';

    // Define the function that will execute when the button is clicked
    const getRenderedHTML = () => {
        const postId = select('core/editor').getCurrentPostId();
        const restUrl = `${wpApiSettings.root}wp/v2/excelsior_bootstrap/${postId}`;

        // Fetch the rendered content via REST API
        fetch(restUrl)
            .then(response => response.json())
            .then(post => {

                const htmlCode = post.content.rendered.replace(
                    /<i([^>]*)>(.*?)<\/i>/g,
                    (match, attrs, innerText) => {
                        const nonBreakingText = innerText.replace(/ /g, '&nbsp;');
                        return `<i${attrs}>${nonBreakingText}</i>`;
                    }
                );

                setRenderedHTML(beautify.html(htmlCode, {preserve_newlines: false}));
                setIsModalOpen(true);
            })
            .catch(error => {
                console.error('Error fetching the post content:', error);
            });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(renderedHTML)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 6000);
            })
            .catch(err => {
                console.error('Failed to copy code: ', err);
            });
    };

    useEffect(() => {
        if (isModalOpen) {
            const codeElement = document.querySelector('.get-code-modal');
            if (codeElement) {
                Prism.highlightAllUnder(codeElement);
            }
        }
    }, [isModalOpen]);

    return (
        <>
        <PluginPostStatusInfo>
            <PanelBody className='get-code-btn-panel'>
            <Button className='get-code-btn' onClick={getRenderedHTML} disabled={isDisabled}>
                Get Code
            </Button>
            {isDisabled && (
                <Text as='p' variant='muted' isBlock style={{marginTop: '8px'}}>
                    The Get Code button will be enabled when all changes are saved or published.
                </Text>
            )}
            </PanelBody>
        </PluginPostStatusInfo>
        {isModalOpen && (
            <Modal
                title="HTML Code"
                className='get-code-modal'
                onRequestClose={() => setIsModalOpen(false)}
                shouldCloseOnClickOutside={false}
                size='fill'
            >
                {copySuccess && (
                    <Notice status="success" isDismissible={true}>
                        HTML code copied to clipboard!
                    </Notice>
                )}
                <div className='cta-wrapper'>
                    <Button
                        variant="primary"
                        onClick={copyToClipboard}
                        style={{ marginTop: '15px' }}
                    >
                        Copy Code
                    </Button>
                </div>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    <code class="language-html line-numbers">{renderedHTML}</code>
                </pre>
            </Modal>
        )}
        </>
    );
};

// Register the plugin to display the button in the editor's sidebar
registerPlugin (XCLSR_BTSTRP_EDITOR_PREFIX + '-get-code-button', {
    render: GetCodeButton,
    icon: 'smiley',
});
