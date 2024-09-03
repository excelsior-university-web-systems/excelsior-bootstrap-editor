import { useBlockProps, RichText } from '@wordpress/block-editor';
import { TimePicker  } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit( { attributes, setAttributes } ) {

    const { task, dueDate = new Date() } = attributes;

    const blockProps = useBlockProps( {
        className: 'list-group-item'
    } );

    return (
        <li {...blockProps}>
        <RichText
            tagName="span"
            value={task}
            placeholder='Task description...'
            onChange={(value) => setAttributes({ task: value })}
            allowedFormats={['core/bold', 'core/italic', XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
        />
        <TimePicker
            label="Due Date"
            currentTime={ dueDate }
            dateOrder="mdy"
            onChange={ ( newDate ) => setAttributes( {dueDate: newDate}) }
            is12Hour
            />
        </li> 
    );
}
