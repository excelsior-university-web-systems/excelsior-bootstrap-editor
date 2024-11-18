import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { convertTo12HourFormat } from '../../commons';
import { TimeInput } from '@mantine/dates';
import { MantineProvider } from '@mantine/core';

export default function Edit( { attributes, setAttributes } ) {

    const { task, dueTime, dueDayOfTheWeek, timezone, noDueDate } = attributes;

    const blockProps = useBlockProps( {
        className: 'list-group-item'
    } );

    return (
        <>
            <InspectorControls>
                <PanelBody title='Due Date Settings'>
                    <ToggleControl
                        label="No Due Date"
                        help="Toggle on to remove due date."
                        checked={noDueDate}
                        onChange={(value) => setAttributes({ noDueDate: value })}
                        __nextHasNoMarginBottom
                    />
                    {!noDueDate && (
                        <>
                        <SelectControl
                            label="Day of the Week"
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
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                        />
                        <MantineProvider>
                            <TimeInput
                                variant="unstyled"
                                label="Time"
                                value={dueTime}
                                onChange={(event) => setAttributes({dueTime: event.currentTarget.value})}
                            />
                        </MantineProvider>
                        <SelectControl
                            label="Time Zone"
                            value={timezone}
                            help="Use ET, CT, or PT for consistency across U.S. regions. Other time zones (EST vs EDT, CST vs CDT, and PST vs PDT) may cause confusion."
                            options={[
                                { label: 'ET - Eastern Time', value: 'ET' },
                                { label: 'CT - Central Time', value: 'CT' },
                                { label: 'PT - Pacific Time', value: 'PT' }
                            ]}
                            onChange={(value) => setAttributes({ timezone: value })}
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                        />
                        </>
                    )}
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
                {!noDueDate && (
                    <>
                    <br /> By {dueDayOfTheWeek} at {convertTo12HourFormat(dueTime)} {timezone}
                    </>
                ) }
                
            </li> 
        </>
    );
}
