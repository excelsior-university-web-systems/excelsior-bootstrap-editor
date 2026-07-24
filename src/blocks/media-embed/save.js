import { useBlockProps } from '@wordpress/block-editor';
import { MediaEmbed } from '../../commons';

export default function Save( { attributes } ) {

    const { mediaTitle, mediaSource, responsive, width, height, minWidth, minHeight, maxWidth, maxHeight, floatingClasses } = attributes;
    const blockProps = useBlockProps.save( {
        className: `${ floatingClasses.length ? floatingClasses : 'mb-3'}`
    } );

    return (
        <div { ...blockProps }>
            <MediaEmbed
                mediaSource={ mediaSource }
                mediaTitle={ mediaTitle }
                responsive={ responsive }
                width={ width }
                height={ height }
                minWidth={ minWidth }
                minHeight={ minHeight }
                maxWidth={ maxWidth }
                maxHeight={ maxHeight }
            />
        </div>
    );

}
