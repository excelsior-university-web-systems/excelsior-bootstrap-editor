import { useBlockProps } from '@wordpress/block-editor';
import { MediaEmbed } from '../../commons';

export default function Save( { attributes } ) {

    const { mediaTitle, mediaType, mediaSource } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div { ...blockProps }>
            <MediaEmbed mediaType={ mediaType } mediaSource={ mediaSource } mediaTitle={ mediaTitle } />
        </div>
    );

}
