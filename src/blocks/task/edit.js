import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, __experimentalText as Text, SelectControl } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

export default function Edit( { attributes, setAttributes } ) {

    const { task, dueTime = dayjs.utc(new Date()), dueDayOfTheWeek } = attributes;

    const blockProps = useBlockProps( {
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
        <>
            <InspectorControls>
                <PanelBody title='Settings'>
                    <Text as="p" style={{"marginBottom": "16px"}}>
                        Due Day and Time (in EST/EDT)
                    </Text>
                    <SelectControl
                        value={dueDayOfTheWeek}
                        options={[
                            { label: 'Sunday', value: 'Sunday' },
                            { label: 'Monday', value: 'Monday' },
                            { label: 'Tuesday', value: 'Tuesday' },
                            { label: 'Wednesday', value: 'Wednesday' },
                            { label: 'Thursday', value: 'Thursday' },
                            { label: 'Friday', value: 'Friday' },
                            { label: 'Saturday', value: 'Saturday' }
                        ]}
                        onChange={(value) => setAttributes({ dueDayOfTheWeek: value })}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            timezone='America/New_York'
                            value={dayjs.utc(dueTime)}
                            onChange={(value) => setAttributes({ dueTime: value })}
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
                <br /> By {dueDayOfTheWeek} at {formattedTime} ET
            </li> 
        </>
    );
}
