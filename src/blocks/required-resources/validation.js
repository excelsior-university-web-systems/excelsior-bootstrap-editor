import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

const REQUIRED_RESOURCES = XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources';
const RESOURCE_GROUP = XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group';
const RESOURCE_ITEM = XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group-item';

export const hasRichTextContent = ( html ) => {
    const content = document.createElement( 'div' );
    content.innerHTML = html || '';
    return !!content.textContent.replace( /\u200B/g, '' ).trim();
};

export const hasMissingRequiredResourceContent = ( blocks ) => blocks.some( ( block ) => {
    const children = block.innerBlocks || [];
    if ( block.name === REQUIRED_RESOURCES && block.attributes.mode === 'advanced' ) {
        const groups = children.filter( ( child ) => child.name === RESOURCE_GROUP );
        if ( !groups.length || groups.some( ( group ) => {
            const resources = ( group.innerBlocks || [] ).filter( ( child ) => child.name === RESOURCE_ITEM );
            return !hasRichTextContent( group.attributes.contextContent ) || !resources.length ||
                resources.some( ( resource ) => !hasRichTextContent( resource.attributes.resource ) );
        } ) ) {
            return true;
        }
    }
    return hasMissingRequiredResourceContent( children );
} );
