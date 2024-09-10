import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    
    const { task, dueTime, dueDayOfTheWeek } = attributes;

    const blockProps = useBlockProps.save( {
        className: 'list-group-item'
    } );

    const timeOptions = {
        hour: 'numeric', // hour
        minute: 'numeric', // minute
        hour12: true,    // 12-hour time format
        timeZone: 'America/New_York'
    };

    const date = new Date(dueTime);
    const formattedTime = date.toLocaleString('en-US', timeOptions);

    return (
        <li {...blockProps}>
            <RichText.Content
            value={task} />
            <br />
            By By {dueDayOfTheWeek} at {formattedTime} ET
        </li>
    );
}
