import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, __experimentalText as Text } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

export default function Edit( { attributes, setAttributes } ) {

    const { task, dueDate = dayjs.utc(new Date()) } = attributes;

    const blockProps = useBlockProps( {
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
        <>
            <InspectorControls>
                <PanelBody title='Settings'>
                    <Text>
                        Task Due Date
                    </Text>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            timezone='America/New_York'
                            value={dayjs.utc(dueDate)}
                            onChange={(value) => setAttributes({ dueDate: value })}
                        />
                    </LocalizationProvider>
                </PanelBody>
            </InspectorControls>
            <li {...blockProps}>
                <RichText
                    tagName="span"
                    value={task}
                    placeholder='Task description...'
                    onChange={(value) => setAttributes({ task: value })}
                    allowedFormats={['core/bold', 'core/italic', XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
                />
                <br /> By {formattedDate} 
            </li> 
        </>
    );
}
