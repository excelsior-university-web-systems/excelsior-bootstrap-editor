import { useBlockProps, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit( { attributes, setAttributes, context } ) {

    const { termName, termDefinition, hasIndentation } = attributes;
    const useIndentation = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/useIndentationForDefinitions'];

    useEffect(() => {
    
        if ( hasIndentation != useIndentation ) {
            setAttributes( {hasIndentation: useIndentation} );
        }

    }, [useIndentation]);

    const blockProps = useBlockProps({
        className: 'excelsior-definition-term',
    });

    return (
        <>
        <div {...blockProps}>
            <RichText
                tagName="dt"
                placeholder="Term"
                value={termName}
                className='term'
                onChange={(value) => setAttributes({ termName: value })}
                allowedFormats={['core/bold', 'core/italic']}
            />
            <RichText
                className={`definition mb-3 ${hasIndentation ? 'ms-3' : ''}`}
                placeholder='Definition'
                value={termDefinition}
                onChange={(value) => setAttributes({ termDefinition: value })}
                allowedFormats={['core/bold', 'core/italic', 'core/math', 'glyphwell/inline-equation']}
            />
        </div>
        </>
    );
}
