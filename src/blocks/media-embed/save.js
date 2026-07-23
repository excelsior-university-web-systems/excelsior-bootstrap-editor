import { useBlockProps } from '@wordpress/block-editor';
import { MediaEmbed } from '../../commons';

export default function Save( { attributes } ) {

    const { mediaTitle, mediaType, mediaSource, floatingClasses } = attributes;
    const blockProps = useBlockProps.save( {
        className: `${ floatingClasses.length ? floatingClasses : 'mb-3'}`
    } );

    return (
        <div { ...blockProps }>
            <MediaEmbed mediaType={ mediaType } mediaSource={ mediaSource } mediaTitle={ mediaTitle } />
        </div>
    );

}
