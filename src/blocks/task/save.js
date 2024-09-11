import { RichText, useBlockProps } from '@wordpress/block-editor';
import { convertTo12HourFormat } from '../../commons';

export default function Save( { attributes } ) {
    
    const { task, dueTime, dueDayOfTheWeek, timezone } = attributes;

    const blockProps = useBlockProps.save( {
        className: 'list-group-item'
    } );

    return (
        <li {...blockProps}>
            <RichText.Content
            value={task} />
            <br />
            By {dueDayOfTheWeek} at {convertTo12HourFormat(dueTime)} {timezone}
        </li>
    );
}
