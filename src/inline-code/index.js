import { registerFormatType, applyFormat, removeFormat } from '@wordpress/rich-text';
import { useState, useEffect } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Popover, SelectControl } from '@wordpress/components';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Import the PrismJS theme you're using
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../constants';

const INLINE_CODE_FORMAT_NAME = XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-code';

// Register the format type
registerFormatType(INLINE_CODE_FORMAT_NAME, {
    title: 'Inline Code',
    tagName: 'code',
    className: null,
    edit({ isActive, value, onChange }) {

        const [language, setLanguage] = useState('');
        const [isVisible, setIsVisible] = useState(false);

        const applyLanguageClass = (lang) => {
            const newAttributes = {
                class: lang ? `language-${lang}` : '',
            };

            const newValue = applyFormat(
                removeFormat(value, INLINE_CODE_FORMAT_NAME),
                { type: INLINE_CODE_FORMAT_NAME, attributes: newAttributes }
            );
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

        // Apply PrismJS syntax highlighting when the content or language changes
        useEffect(() => {
            if (isActive) {
                Prism.highlightAll();
            }
        }, [language, value]);

        return (
            <>
                <RichTextToolbarButton
                    icon="editor-code"
                    title="Inline Code"
                    onClick={() => setIsVisible(!isVisible)}
                    isActive={isActive}
                />
                {isVisible && (
                    <Popover 
                        variant="toolbar"
                        noArrow={false}
                        offset={10}
                        placement="bottom-end"
                        onClose={() => setIsVisible(false)}>
                            <div style={{padding: '10px', width: '200px'}}>
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
                            </div>
                    </Popover>
                )}
            </>
        );
    },
});
