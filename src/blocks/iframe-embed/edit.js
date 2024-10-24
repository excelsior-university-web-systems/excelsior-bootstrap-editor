import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { removeScriptTags } from '../../commons';

export default function Edit( { attributes, setAttributes } ) {

    const { embedCode, floatingClasses } = attributes;
    const [tempEmbedCode, setTempEmbedCode] = useState( embedCode );

    const stripScriptTags = ( html ) => {
        setTempEmbedCode( removeScriptTags( html ) );
    };

    const onInsertEmbedCode = () => {
        if ( tempEmbedCode ) {
            setAttributes( { embedCode: removeScriptTags( tempEmbedCode ) } );
        }
    };

    return (
        <>
        <InspectorControls>
            
        { embedCode && (
            <PanelBody title="Settings">
                
                <TextareaControl
                    label="Embed Code"
                    help="Replace the embed code to update. No script tags are allowed."
                    value={ tempEmbedCode } 
                    onChange={ ( newEmbedCode ) => stripScriptTags( newEmbedCode ) }
                    rows="12"
                />
                <Button
                    variant='primary'
                    text='Update'
                    onClick={ onInsertEmbedCode }
                />
            </PanelBody>     
        ) }
            
        </InspectorControls>
        <div {...useBlockProps()}>
        { embedCode ? (
            
            <div className={floatingClasses} dangerouslySetInnerHTML={{ __html: embedCode }} />

        ) : (

            <div className='excelsior-iframe-embed-insert'>
                <TextareaControl
                    label="Embed Code"
                    value={ tempEmbedCode } 
                    placeholder="Paste embed code in here. No script tags are allow."
                    onChange={ ( newEmbedCode ) => stripScriptTags( newEmbedCode ) }
                    rows="6"
                />
                <Button
                    variant='primary'
                    text='Insert'
                    onClick={onInsertEmbedCode}
                />
            </div>

        ) }
        </div>
        </>
        
    );

}
