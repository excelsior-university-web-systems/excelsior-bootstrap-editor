import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, __experimentalSpacer as Spacer } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { MediaEmbed } from '../../commons';

export default function Edit( { attributes, setAttributes } ) {

    const { mediaTitle, mediaType, mediaSource } = attributes;

    const updateMediaType = ( value ) => {
        setAttributes( { mediaType: value } );
    };

    return (
        <>
        <InspectorControls>    
            <PanelBody title="Settings">
                <TextControl
                    label="Media Title"
                    value={ mediaTitle }
                    onChange={ ( value ) => setAttributes( { mediaTitle: value } ) }
                    __next40pxDefaultSize={true}
                />
                <SelectControl
                    label="Media Type"
                    value={mediaType}
                    options={[
                        { label: 'Generic Video Player', value: 'gvp' },
                        { label: 'YouTube', value: 'yt' },
                        { label: 'Storybook+', value: 'sbplus' },
                    ]}
                    onChange={updateMediaType}
                    __next40pxDefaultSize={true}
                />
                <TextControl
                    label="Media Source"
                    help="Enter the media source URL or ID."
                    value={ mediaSource }
                    onChange={ ( value ) => setAttributes( { mediaSource: value.trim() } ) }
                    __nextHasNoMarginBottom
                />
            </PanelBody> 
        </InspectorControls>
        <div {...useBlockProps()}>
            { mediaType && mediaSource ? (

                <MediaEmbed mediaType={ mediaType } mediaSource={ mediaSource } mediaTitle={ mediaTitle } preview />

            ) : (

                <div className='excelsior-media-embed-insert'>
                    <TextControl
                        label="Media Title"
                        value={ mediaTitle }
                        onChange={ ( value ) => setAttributes( { mediaTitle: value } ) }
                    />
                    <Spacer />
                    <SelectControl
                        label="Media Type"
                        value={mediaType}
                        options={[
                            { label: 'Generic Video Player', value: 'gvp' },
                            { label: 'YouTube', value: 'yt' },
                            { label: 'Storybook+', value: 'sbplus' },
                        ]}
                        onChange={updateMediaType}
                    />
                    <Spacer />
                    <TextControl
                        label="Media Source"
                        help="Enter the media source URL or ID."
                        value={ mediaSource }
                        onChange={ ( value ) => setAttributes( { mediaSource: value } ) }
                    />
                </div>

            ) }
        </div>
        </>
        
    );

}
