import { registerFormatType, applyFormat, removeFormat, getActiveFormat } from '@wordpress/rich-text';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Popover, SelectControl, Button, Modal, __experimentalSpacer as Spacer } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../constants';

const INLINE_CODE_FORMAT_NAME = XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-code';

wp.domReady(() => {
    window.Prism = window.Prism || {};
    Prism.manual = true;

    wp.richText.unregisterFormatType('core/code');

    registerFormatType(INLINE_CODE_FORMAT_NAME, {
        title: 'Inline Code',
        tagName: 'code',
        className: null,
        attributes: { class: '' },

        edit({ isActive, value, onChange, contentRef }) {
            const activeFormat = getActiveFormat(value, INLINE_CODE_FORMAT_NAME);
            const initialLang = activeFormat?.attributes?.class?.match(/language-(\w+)/)?.[1] || '';

            const [language, setLanguage] = useState(initialLang);
            const [isPopoverVisible, setPopoverVisible] = useState(false);
            const [popoverAnchor, setPopoverAnchor] = useState(null);
            const [isPreviewing, setPreviewing] = useState(false);

            const applyLanguageClass = (lang) => {
                const newClass = lang ? `language-${lang}` : '';
                const newValue = applyFormat(value, {
                    type: INLINE_CODE_FORMAT_NAME,
                    attributes: { class: newClass },
                });
                onChange(newValue);
            };

            const onLanguageChange = (lang) => {
                setLanguage(lang);
                applyLanguageClass(lang);
            };

            const computeAnchorFromSelection = () => {
                const sel = window.getSelection();
                if (sel?.rangeCount > 0) {
                    const range = sel.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    if (rect) {
                        return {
                            getBoundingClientRect: () => rect,
                            ownerDocument: document,
                        };
                    }
                }
                return null;
            };

            const computeAnchorFromClickedCode = (event) => {
                const target = event.target;
                if (target.tagName === 'CODE') {
                    const rect = target.getBoundingClientRect();
                    return {
                        getBoundingClientRect: () => rect,
                        ownerDocument: document,
                    };
                }
                return null;
            };

            const openPopoverAt = (anchor) => {
                setPopoverAnchor(anchor);
                setPopoverVisible(true);
            };

            const closePopover = () => {
                setPopoverVisible(false);
                setPopoverAnchor(null);
            };

            const onToolbarClick = () => {
                if (isActive) {
                    onChange(removeFormat(value, INLINE_CODE_FORMAT_NAME));
                    closePopover();
                } else {
                    applyLanguageClass(language);
                    // anchor to current selection
                    const anchor = computeAnchorFromSelection();
                    if (anchor) {
                        openPopoverAt(anchor);
                    }
                }
            };

            const onClickInContent = useCallback((event) => {
                const anchor = computeAnchorFromClickedCode(event);
                if (anchor) {
                    openPopoverAt(anchor);
                }
            }, []);

            // If popover is open — attach scroll/resize to reposition anchor
            useEffect(() => {
                if (!isPopoverVisible) {
                    return;
                }
                const update = () => {
                    const anchor = computeAnchorFromSelection() || popoverAnchor;
                    if (anchor) {
                        setPopoverAnchor(anchor);
                    }
                };
                window.addEventListener('scroll', update, true);
                window.addEventListener('resize', update);
                return () => {
                    window.removeEventListener('scroll', update, true);
                    window.removeEventListener('resize', update);
                };
            }, [isPopoverVisible, popoverAnchor]);

            // Add click listener to rendered content
            useEffect(() => {
                const domRoot = contentRef?.current;
                if (domRoot) {
                    domRoot.addEventListener('click', onClickInContent);
                    return () => {
                        domRoot.removeEventListener('click', onClickInContent);
                    };
                }
            }, [contentRef, onClickInContent]);

            // Close popover if format removed
            useEffect(() => {
                if (!activeFormat) {
                    closePopover();
                }
            }, [activeFormat]);

            // When preview modal opens, highlight code in modal
            useEffect(() => {
                if (isPreviewing) {
                    const modalContent = document.querySelector('.inline-code-preview-modal');
                    if (modalContent) {
                        Prism.highlightAllUnder(modalContent);
                    }
                }
            }, [isPreviewing]);

            // Convert current value to HTML for preview
            const previewHTML = wp.richText.toHTMLString({ value });

            return (
                <>
                    <RichTextToolbarButton icon='editor-code' title='Inline Code' onClick={onToolbarClick} isActive={isActive} />
                    {isPopoverVisible && popoverAnchor && (
                        <Popover anchor={popoverAnchor} offset={8} placement='bottom-start' focusOnMount={true} onClose={closePopover} noArrow={false}>
                            <div style={{ padding: '10px', width: '200px' }}>
                                <SelectControl
                                    label='Select Language'
                                    value={language}
                                    options={[
                                        { label: 'None', value: '' },
                                        { label: 'C', value: 'c' },
                                        { label: 'C#', value: 'csharp' },
                                        { label: 'C++', value: 'cpp' },
                                        { label: 'CSS', value: 'css' },
                                        { label: 'HTML/XML', value: 'markup' },
                                        { label: 'Java', value: 'java' },
                                        { label: 'JavaScript', value: 'javascript' },
                                        { label: 'Python', value: 'python' },
                                        { label: 'R', value: 'r' },
                                    ]}
                                    onChange={onLanguageChange}
                                    __next40pxDefaultSize
                                    __nextHasNoMarginBottom
                                />
                                <Spacer />
                                <Button text='Preview' variant='secondary' onClick={() => setPreviewing(true)} __next40pxDefaultSize __nextHasNoMarginBottom />
                            </div>
                        </Popover>
                    )}
                    {isPreviewing && (
                        <Modal title='Preview' className='inline-code-preview-modal' onRequestClose={() => setPreviewing(false)} shouldCloseOnClickOutside={false} shouldCloseOnEsc={true} size='large'>
                            <div className='excelsior-bootstrap-code-preview' dangerouslySetInnerHTML={{ __html: previewHTML }} />
                        </Modal>
                    )}
                </>
            );
        },
    });
});
