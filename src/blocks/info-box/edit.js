import { RichText, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import metadata from './block.json';
import { preventLineBreaks } from '../../commons';

const STYLE_LABELS = {
    tip: {
        icon: 'bi-lightbulb-fill',
        text: 'Tip: '
    },
    note: {
        icon: 'bi-stickies-fill',
        text: 'Note: '
    },
    reminder: {
        icon: 'bi-bell-fill',
        text: 'Reminder: '
    }
};

export default function Edit ({ attributes, setAttributes }) {

    const { styleType, content, narrowWidth } = attributes;
    const label = STYLE_LABELS[ styleType ] || STYLE_LABELS.tip;
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps( {
        className: `info-box${styleType.length ? ' ' + styleType : ''}${narrowWidth ? ' w-75 mx-auto' : ''}`,
        role: 'alert'
    } );

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <SelectControl
                    label="Styles"
                    value={styleType}
                    options={[
                        { label: 'Tip', value: 'tip' },
                        { label: 'Reminder', value: 'reminder' },
                        { label: 'Note', value: 'note' },
                    ]}
                    onChange={(value) => setAttributes({ styleType: value })}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                />
                <ToggleControl
                    label="Narrow Width"
                    help="Toggle on to make the width shorter and center aligned."
                    checked={narrowWidth}
                    onChange={(value) => setAttributes({ narrowWidth: value })}
                    __nextHasNoMarginBottom
                />
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <p>
                <strong>
                    <i className={`bi ${label.icon}`} aria-hidden="true"></i>&nbsp;
                    {label.text}
                </strong>
                <RichText
                    tagName="span"
                    value={content}
                    placeholder="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                    onChange={(value) => setAttributes({ content: value })}
                    multiline={false}
                    onKeyDown={preventLineBreaks}
                />
            </p>
        </div>
        </>
        
    );
}
