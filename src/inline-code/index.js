import { registerFormatType, applyFormat, removeFormat, getActiveFormat } from '@wordpress/rich-text';
import { useState, useEffect, createElement } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Popover, SelectControl, Button, Modal } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../constants';

const INLINE_CODE_FORMAT_NAME = XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-code';

wp.domReady(() => {

    window.Prism = window.Prism || {};
    Prism.manual = true;
    
    // Unregistered core/code inline code format
    wp.richText.unregisterFormatType('core/code');

    // Register Excelsior Bootstrap inline code format
    registerFormatType(INLINE_CODE_FORMAT_NAME, {
        title: 'Inline Code',
        tagName: 'code',
        className: null,
        attributes: {
            class: ''
        },
        edit({ isActive, value, onChange }) {
    
            const activeFormat = getActiveFormat(value, INLINE_CODE_FORMAT_NAME);
            const initialLanguage = activeFormat?.attributes?.class?.match(/language-(\w+)/)?.[1] || activeFormat?.unregisteredAttributes?.class?.match(/language-(\w+)/)?.[1] || '';
            const previewHTML = wp.richText.toHTMLString({ value });
            const [language, setLanguage] = useState(initialLanguage);
            const [isVisible, setIsVisible] = useState(false);
            const [isPreviewing, setPreviewing] = useState(false);
            const openPreviewModal = () => setPreviewing(true);
            const closePreviewModal = () => setPreviewing(false);
    
            const applyLanguageClass = (lang) => {

                const newClassName = lang ? `language-${lang}` : '';

                const newValue = applyFormat(value, {
                    type: INLINE_CODE_FORMAT_NAME,
                    attributes: { class: newClassName }
                });
    
                onChange(newValue);
            };
    
            const onLanguageChange = (selectedLanguage) => {
                setLanguage(selectedLanguage);
                applyLanguageClass(selectedLanguage);
            };
    
            // Effect to open the popover automatically when the format is activated
            useEffect(() => {
                if (isActive && !isVisible) {
                    setIsVisible(true);
                }
            }, [isActive]);

            // Effect to close the popover automatically when the format is not code
            useEffect(()=>{
                if ( !activeFormat ) {
                    setIsVisible(false);
                }
            }, [activeFormat]);

            // Effect to hightlight the code when the preview modal is opened
            useEffect(()=>{
                if ( isPreviewing ) {
                    const modalContent = document.querySelector('.inline-code-preview-modal');
                    Prism.highlightAllUnder(modalContent);
                }
            }, [isPreviewing]);
    
            return (
                <>
                    <RichTextToolbarButton
                        icon="editor-code"
                        title="Inline Code"
                        onClick={() => {
                            if (isActive) {
                                onChange(removeFormat(value, INLINE_CODE_FORMAT_NAME));
                            } else {
                                setIsVisible(!isVisible);
                            }
                        }}
                        isActive={isActive}
                    />
                    {isVisible && (
                        <Popover
                            variant="toolbar"
                            noArrow={false}
                            offset={8}
                            placement="bottom-start"
                            focusOnMount={false}
                            onClose={() => setIsVisible(false)}>
                            <div style={{ padding: '10px', width: '200px' }}>
                                <SelectControl
                                    label="Select Language"
                                    value={language}
                                    options={[
                                        { label: 'None', value: '' },
                                        { label: 'CSS', value: 'css' },
                                        { label: 'HTML/XML', value: 'markup' },
                                        { label: 'Java', value: 'java' },
                                        { label: 'JavaScript', value: 'javascript' },
                                        { label: 'Python', value: 'python' },
                                        { label: 'R', value: 'r' },
                                    ]}
                                    onChange={onLanguageChange}
                                />
                                <Button
                                    text='Preview'
                                    variant='secondary'
                                    onClick={openPreviewModal}
                                />
                            </div>
                        </Popover>
                    )}
                    {isPreviewing && (
                        <Modal
                            title="Preview"
                            className="inline-code-preview-modal"
                            onRequestClose={closePreviewModal}
                            shouldCloseOnClickOutside={false}
                            shouldCloseOnEsc={true}
                            size="large"
                        >
                            {createElement('div', { className: 'excelsior-bootstrap-code-preview', dangerouslySetInnerHTML: { __html: previewHTML } })}
                        </Modal>
                    )}
                </>
            );
        },
    });
    
});