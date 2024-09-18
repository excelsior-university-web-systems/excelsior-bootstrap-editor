import { InspectorControls, useBlockProps, BlockControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Modal, TextareaControl, Button, ToolbarGroup, ToolbarButton, ToggleControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import Prism from 'prismjs';

Prism.manual = true;

export default function Edit({ attributes, setAttributes, isSelected }) {

    const { content, language, showLineNumbers, cover } = attributes;
    const [tempCode, setTempCode] = useState(content || '');
    const [isEditing, setEditing] = useState(false);
    const blockProps = useBlockProps();
    const openEditingModal = () => setEditing(true);
    const closeEditingModal = () => setEditing(false);

    const updateLanguage = (lang) => {
        setAttributes({ language: lang });
    };

    const onInsertCode = () => {
        setAttributes({ content: tempCode.trim() });
        closeEditingModal();
    };

    useEffect(() => {

        const codeElement = document.querySelector(`[data-block="${blockProps['data-block']}"] code`);
        const preElement = codeElement?.closest('pre');

        if ( preElement ) {

            if ( showLineNumbers ) {
                preElement.classList.add('line-numbers');
            } else {
                preElement.classList.remove('line-numbers');
            }

            Prism.highlightElement( codeElement );

        }

    }, [content, language, showLineNumbers]);

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
    }
    
    return (
        <>
            {content && (
                <BlockControls>
                    <ToolbarGroup>
                        <ToolbarButton
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                                    <path d="m19 7-3-3-8.5 8.5-1 4 4-1L19 7Zm-7 11.5H5V20h7v-1.5Z"></path>
                                </svg>
                            }
                            title="Edit Code"
                            onClick={openEditingModal}
                            isActive={isSelected}
                        />
                    </ToolbarGroup>
                </BlockControls>
            )}

            {isEditing && (
                <Modal
                    title="Edit Code Block"
                    onRequestClose={closeEditingModal}
                    shouldCloseOnClickOutside={false}
                    shouldCloseOnEsc={true}
                    focusOnMount="firstContentElement"
                    size="large"
                >
                    <TextareaControl
                        value={tempCode}
                        onChange={(newCode) => setTempCode(newCode)}
                        rows="10"
                    />
                    <Button
                        variant="primary"
                        onClick={onInsertCode}
                        text="Update"
                    />
                </Modal>
            )}

            <InspectorControls>
                <PanelBody title="Settings">
                    <SelectControl
                        label="Language"
                        value={language}
                        options={[
                            { label: 'C', value: 'c' },
                            { label: 'C#', value: 'csharp' },
                            { label: 'C++', value: 'cpp' },
                            { label: 'CSS', value: 'css' },
                            { label: 'HTML/XML', value: 'markup' },
                            { label: 'Java', value: 'java' },
                            { label: 'JavaScript', value: 'javascript' },
                            { label: 'Python', value: 'python' },
                            { label: 'R', value: 'r' }
                        ]}
                        onChange={updateLanguage}
                    />
                    <ToggleControl
                        label="Show line numbers"
                        checked={showLineNumbers}
                        onChange={(value) => setAttributes({ showLineNumbers: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {content ? (
                    <pre>
                        <code className={`language-${language}`}>
                            {content}
                        </code>
                    </pre>
                ) : (
                    <>
                        <SelectControl
                            label="Language"
                            value={language}
                            options={[
                                { label: 'C', value: 'c' },
                                { label: 'C#', value: 'csharp' },
                                { label: 'C++', value: 'cpp' },
                                { label: 'CSS', value: 'css' },
                                { label: 'HTML/XML', value: 'markup' },
                                { label: 'Java', value: 'java' },
                                { label: 'JavaScript', value: 'javascript' },
                                { label: 'Python', value: 'python' },
                                { label: 'R', value: 'r' }
                            ]}
                            onChange={updateLanguage}
                        />
                        <TextareaControl
                            value={tempCode}
                            placeholder="Enter code..."
                            onChange={(newCode) => setTempCode(newCode)}
                            rows="10"
                        />
                        <Button
                            variant="primary"
                            onClick={onInsertCode}
                            text="Insert Code"
                        />
                    </>
                )}
            </div>
        </>
    );
}