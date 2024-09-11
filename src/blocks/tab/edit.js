import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { generateHtmlId } from '../../commons';
import { ALLOWED_BLOCKS } from './allowed-blocks';

export default function Edit({ attributes, setAttributes, context }) {
    const { title, uniqueId, isActive, headingLevel, headingClass } = attributes;
    const blockProps = useBlockProps( {
        className: "tab-pane",
        role: "tabpanel"
    } );

    const activeTab = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/activeTab'];
    const tabHeadingLevel = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/tabHeadingLevel'];
    const tabHeadingLevelClass = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/tabHeadingLevelClass'];

    const sanitizeHtml = ( input ) => {
        
        const tempElement = document.createElement( 'div' );
        tempElement.innerHTML = input;

        const scripts = tempElement.querySelectorAll( 'script' );
        scripts.forEach( (script) => script.remove() );

        return tempElement.innerHTML;

    };

    useEffect(() => {

        if (!uniqueId) {
            setAttributes({ uniqueId: generateHtmlId() });
        }

        if ( !isActive ) {
            if ( activeTab === uniqueId ) {
                setAttributes({ isActive: true });
            }
        }

    }, [uniqueId]);

    useEffect(() => {

        if ( headingLevel != tabHeadingLevel ) {
            setAttributes( {headingLevel: tabHeadingLevel} );
        }

        if ( headingClass != tabHeadingLevelClass ) {
            setAttributes( {headingClass: tabHeadingLevelClass} );
        }

    }, [tabHeadingLevel, tabHeadingLevelClass]);

    return (
        <div {...blockProps} id={`${uniqueId}-pane`} aria-labelledby={`${uniqueId}-tab`}>
            <RichText
                tagName={headingLevel}
                placeholder="Tab Title"
                className={headingClass}
                value={title}
                onChange={(value) => setAttributes({ title: sanitizeHtml(value) })}
                allowedFormats={['core/bold', 'core/italic', XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
            />
            <InnerBlocks template={[['core/paragraph']]} allowedBlocks={ALLOWED_BLOCKS} templateLock={false} />
        </div>
    );
}
