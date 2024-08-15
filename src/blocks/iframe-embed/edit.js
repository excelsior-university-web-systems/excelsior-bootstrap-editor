import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {

    const { embedCode } = attributes;

    // Sanitize to strip out <script> tags
    const sanitizeEmbedCode = ( input ) => {
        
        const tempElement = document.createElement( 'div' );
        tempElement.innerHTML = input;

        const scripts = tempElement.querySelectorAll( 'script' );
        scripts.forEach( (script) => script.remove() );

        return tempElement.innerHTML;

    };

    const onChangeEmbedCode = ( value ) => {
        const sanitizedValue = sanitizeEmbedCode( value );
        setAttributes( { embedCode: sanitizedValue } );
    };

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
                <TextareaControl
                    label="Embed Code"
                    help="Replace the embed code to update. No script tags are allowed."
                    value={embedCode}
                    onChange={onChangeEmbedCode}
                    rows="12"
                />
            </PanelBody>
        </InspectorControls>
        { embedCode ? (
            
            <div {...useBlockProps()} dangerouslySetInnerHTML={{ __html: embedCode }} />

            ) : (

                <div className='block-editor-block-list__block wp-block-excelsior-bootstrap-iframe-embed excelsior-iframe-embed-insert '>
                    <TextareaControl
                        label="Embed Code"
                        value={embedCode}
                        onChange={onChangeEmbedCode}
                        placeholder="Paste embed code in here. No script tags are allow."
                        rows="6"
                    />
                </div>

            ) }
        
        </>
        
    );

}
