import { useBlockProps, InspectorControls  } from '@wordpress/block-editor';
import { TextControl, Button, PanelBody } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { formatAsHtmlId } from '../../commons';

export default function Edit( { attributes, setAttributes} ) {
    
    const { items } = attributes;
    const [newLinkLabel, setNewLinkLabel] = useState('');
    const [newLinkId, setNewLinkId] = useState('');
    const blockProps = useBlockProps({
        className: "page-content-nav"
    });

    // Add a new nav-item
    const addItem = () => {

        const formattedId = formatAsHtmlId(newLinkId);

        if ( newLinkLabel && newLinkId ) {
          setAttributes({
            items: [...items, { id: formattedId, label: newLinkLabel }]
          });
          setNewLinkLabel('');
          setNewLinkId('');
        }

    };

    // Update nav item
    const updateItem = (index, key, value) => {
        const newItems = [...items];
        if (key === 'id') {
          newItems[index][key] = formatAsHtmlId(value);
        } else {
          newItems[index][key] = value;
        }
        setAttributes({ items: newItems });
    };

    // Remove a nav-item
    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setAttributes({ items: newItems });
    };

    return (
        <>
        <InspectorControls>
            <PanelBody title='Settings'>
                <TextControl
                    label='Nav Item Label'
                    value={newLinkLabel}
                    onChange={(value) => setNewLinkLabel(value)}
                />
                <TextControl
                    label='Nav Item ID (for anchor)'
                    help='Nav item IDs can only contain letters, numbers, and hyphens (spaces will be replaced with hyphens). They cannot start with a number or include underscores, and special characters will be automatically removed.'
                    value={newLinkId}
                    onChange={(value) => setNewLinkId(value)}
                />
                <Button
                    variant='primary'
                    onClick={addItem}
                    text='Add New Item'
                />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <p className='text-secondary mb-1'><small>Page Navigation</small></p>
            {items.map((item, index) => (
              <div key={index} className='d-flex align-items-center'>
                <TextControl
                    label='Nav Item Label'
                    className='flex-grow-1 me-1'
                    value={item.label}
                    onChange={(value) => updateItem(index, 'label', value)}
                />
                <TextControl
                    label='Nav Item ID (for anchor)'
                    className='flex-shrink-1 me-1'
                    value={item.id}
                    onChange={(value) => updateItem(index, 'id', value)}
                />
                <Button
                    variant='link' 
                    className='d-block flex-shrink-1 text-danger mt-3'
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" focusable="false"><path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path></svg>}
                    onClick={() => removeItem(index)}
                    text='Remove' />
              </div>
            ))}
        </div>
      </>
    );
}
