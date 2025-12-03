import { registerFormatType, applyFormat, removeFormat, getActiveFormat } from '@wordpress/rich-text';
import { useState, useEffect, useCallback, useRef } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Popover, SelectControl, Button, Modal, __experimentalSpacer as Spacer } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../constants';

const INLINE_CODE_FORMAT_NAME = XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-code';

wp.domReady(() => {
    // Configure Prism to run manually. The global is required for the preview modal.
    window.Prism = window.Prism || {};
    Prism.manual = true;

    // Remove the core inline code format so we can fully replace it.
    wp.richText.unregisterFormatType('core/code');

    // Helper: derive language slug (e.g. "javascript") from a format object.
    const getLanguageFromFormat = (format) => {
        if (!format) {
            return '';
        }

        const className = format.unregisteredAttributes?.class || format.attributes?.class || '';

        const match = className.match(/language-(\w+)/);
        return match ? match[1] : '';
    };

    registerFormatType(INLINE_CODE_FORMAT_NAME, {
        title: 'Inline Code',
        tagName: 'code',
        className: null,
        attributes: { class: '' },

        edit({ isActive, value, onChange, contentRef }) {
            const activeFormat = getActiveFormat(value, INLINE_CODE_FORMAT_NAME);

            // Initial language for the current inline-code format instance.
            const initialLang = getLanguageFromFormat(activeFormat);

            const [language, setLanguage] = useState(initialLang);
            const [isPopoverVisible, setPopoverVisible] = useState(false);
            const [popoverAnchor, setPopoverAnchor] = useState(null);
            const [isPreviewing, setPreviewing] = useState(false);

            // Tracks the <code> element that the popover is currently anchored to.
            const codeElementRef = useRef(null);

            // Apply or update the inline code format with the selected language class.
            const applyLanguageClass = (lang) => {
                const newClass = lang ? `language-${lang}` : '';
                const newValue = applyFormat(value, {
                    type: INLINE_CODE_FORMAT_NAME,
                    attributes: {
                        class: newClass,
                    },
                });
                onChange(newValue);
            };

            // Update language state and re-apply the format.
            const onLanguageChange = (lang) => {
                setLanguage(lang);
                applyLanguageClass(lang);
            };

            // Compute a virtual anchor based on the current text selection.
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

            // Find a <code> element from a click event target (or its ancestors).
            const getCodeElementFromEvent = (event) => (event.target.closest ? event.target.closest('code') : null);

            // Try to locate a <code> element based on the current selection.
            const getCodeElementFromSelection = () => {
                const sel = window.getSelection();

                if (!sel || !sel.rangeCount) {
                    return null;
                }

                const range = sel.getRangeAt(0);
                let node = range.commonAncestorContainer || range.startContainer;

                if (node.nodeType === Node.TEXT_NODE) {
                    node = node.parentNode;
                }

                if (!node || !node.closest) {
                    return null;
                }

                return node.closest('code');
            };

            // Compute a virtual anchor based on a specific <code> element.
            const computeAnchorFromCodeElement = (element) => {
                if (!element) {
                    return null;
                }

                const rect = element.getBoundingClientRect();

                if (!rect || (!rect.width && !rect.height)) {
                    return null;
                }

                return {
                    getBoundingClientRect: () => rect,
                    ownerDocument: element.ownerDocument || document,
                };
            };

            // Show the popover at the given anchor, optionally binding to a <code> element.
            const openPopoverAt = (anchor, codeElement = null) => {
                if (codeElement) {
                    codeElementRef.current = codeElement;
                }

                setPopoverAnchor(anchor);
                setPopoverVisible(true);
            };

            // Hide the popover and clear its anchor/element tracking.
            const closePopover = () => {
                setPopoverVisible(false);
                setPopoverAnchor(null);
                codeElementRef.current = null;
            };

            // Toolbar button click: toggle the inline code format and open/close the popover.
            const onToolbarClick = () => {
                if (isActive) {
                    onChange(removeFormat(value, INLINE_CODE_FORMAT_NAME));
                    closePopover();
                } else {
                    // Apply / update the format for the current selection.
                    applyLanguageClass(language);

                    // Anchor to the current selection (baseline behavior).
                    const anchorFromSelection = computeAnchorFromSelection();

                    // Also try to capture the <code> element for better scroll/resize behavior.
                    const codeElement = getCodeElementFromSelection();

                    if (anchorFromSelection) {
                        openPopoverAt(anchorFromSelection, codeElement);
                    }
                }
            };

            // Handle clicks inside the editor content; open the popover when clicking inline code.
            const onClickInContent = useCallback((event) => {
                const codeElement = getCodeElementFromEvent(event);

                if (!codeElement) {
                    return;
                }

                const anchor = computeAnchorFromCodeElement(codeElement);

                if (anchor) {
                    openPopoverAt(anchor, codeElement);
                }
            }, []);

            // Re-sync language when the active inline-code format changes
            // (for example: moving the caret into a different inline-code span or loading content).
            useEffect(() => {
                if (!activeFormat) {
                    // When caret leaves inline code, keep the last chosen language.
                    return;
                }

                const langFromFormat = getLanguageFromFormat(activeFormat);
                setLanguage(langFromFormat);
            }, [activeFormat]);

            // When the popover is open, keep it positioned near the inline code.
            // Prefer the actual <code> element when available, and throttle updates with rAF.
            useEffect(() => {
                if (!isPopoverVisible) {
                    return;
                }

                let frameId = null;

                const doUpdate = () => {
                    const el = codeElementRef.current;

                    // If we have a tracked <code> element and it is still in the DOM, use it.
                    if (el && document.body.contains(el)) {
                        const anchorFromCode = computeAnchorFromCodeElement(el);

                        if (anchorFromCode) {
                            setPopoverAnchor(anchorFromCode);
                            return;
                        }
                        // Element exists but rect is bad (e.g. 0×0) – close the popover.
                        closePopover();
                        return;
                    }

                    // Fallback: no tracked <code> element – use selection or last anchor.
                    const anchor = computeAnchorFromSelection() || popoverAnchor;

                    if (anchor) {
                        setPopoverAnchor(anchor);
                    } else {
                        // Nothing sensible to anchor to anymore – close the popover.
                        closePopover();
                    }
                };

                const scheduleUpdate = () => {
                    if (frameId !== null) {
                        return;
                    }
                    frameId = window.requestAnimationFrame(() => {
                        frameId = null;
                        doUpdate();
                    });
                };

                // Initial position after the popover becomes visible.
                scheduleUpdate();

                window.addEventListener('scroll', scheduleUpdate, true);
                window.addEventListener('resize', scheduleUpdate);

                return () => {
                    window.removeEventListener('scroll', scheduleUpdate, true);
                    window.removeEventListener('resize', scheduleUpdate);

                    if (frameId !== null) {
                        window.cancelAnimationFrame(frameId);
                    }
                };
            }, [isPopoverVisible, popoverAnchor]);

            // Attach a click listener to the editor content so clicking an inline <code>
            // element can reopen and re-anchor the popover.
            useEffect(() => {
                const domRoot = contentRef?.current;

                if (domRoot) {
                    domRoot.addEventListener('click', onClickInContent);
                    return () => {
                        domRoot.removeEventListener('click', onClickInContent);
                    };
                }
            }, [contentRef, onClickInContent]);

            // Close the popover when there is no longer an active inline-code format
            // at the current selection.
            useEffect(() => {
                if (!activeFormat) {
                    closePopover();
                }
            }, [activeFormat]);

            // When the preview modal opens, run Prism syntax highlighting on its contents.
            useEffect(() => {
                if (isPreviewing) {
                    const modalContent = document.querySelector('.inline-code-preview-modal');
                    
                    if (modalContent) {
                        Prism.highlightAllUnder(modalContent);
                    }
                }
            }, [isPreviewing]);

            // Convert the current RichText value to HTML for use in the preview modal.
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
