import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    
    const { task, dueDate } = attributes;

    const blockProps = useBlockProps.save( {
        className: 'list-group-item'
    } );

    const dateTimeOptions = {
        weekday: 'long', // day of the week (e.g., Sunday)
        year: 'numeric', // full year (e.g., 2024)
        month: 'long',   // full month name (e.g., September)
        day: 'numeric',  // day of the month (e.g., 22)
        hour: 'numeric', // hour
        minute: 'numeric', // minute
        hour12: true,    // 12-hour time format
        timeZone: 'America/New_York',
        timeZoneName: 'short' // short timezone name (e.g., PDT)
    };

    const date = new Date(dueDate);
    const formattedDate = date.toLocaleString('en-US', dateTimeOptions);

    return (
        <li {...blockProps}>
            <RichText.Content
            value={task} />
            <br />
            By {formattedDate}
        </li>
    );
}
