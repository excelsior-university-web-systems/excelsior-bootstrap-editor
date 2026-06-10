import { RichText, useBlockProps } from '@wordpress/block-editor';

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

export default function Save({ attributes }) {
    const { styleType, content, narrowWidth } = attributes;
    const label = STYLE_LABELS[ styleType ] || STYLE_LABELS.tip;
    const blockProps = useBlockProps.save( {
        className: `info-box${styleType.length ? ' ' + styleType : ''}${narrowWidth ? ' w-75 mx-auto' : ''}`,
        role: 'alert'
    } );

    return (
        <div {...blockProps}>
            <p>
                <strong>
                    <i className={`bi ${label.icon}`} aria-hidden="true"></i>&nbsp;
                    {label.text}
                </strong>
                <RichText.Content
                    tagName="span"
                    value={content}
                />
            </p>
        </div>
    );
}
