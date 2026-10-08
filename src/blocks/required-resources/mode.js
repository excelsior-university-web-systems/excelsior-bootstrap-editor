import { createBlock } from '@wordpress/blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export const GROUP_BLOCK = XCLSR_BTSTRP_EDITOR_PREFIX + '/required-resources-group';

export const convertRequiredResources = ( block, mode ) => {
    const groups = block.innerBlocks;
    const resources = groups.flatMap( ( group ) => group.innerBlocks );
    const contextContent = mode === 'advanced'
        ? block.attributes.contextContent || ''
        : groups.map( ( group ) => ( group.attributes.contextContent || '' ).trim() )
            .filter( Boolean ).join( ' ' );
    const group = createBlock( GROUP_BLOCK, {
        ...groups[ 0 ]?.attributes,
        mode,
        contextContent: mode === 'advanced' ? contextContent : '',
        lock: { ...groups[ 0 ]?.attributes.lock, remove: true },
    }, resources.map( ( resource ) => ( {
        ...resource,
        attributes: {
            ...resource.attributes,
            lock: { ...resource.attributes.lock, remove: resources.length <= 1 },
        },
    } ) ) );

    return {
        ...block,
        attributes: {
            ...block.attributes,
            mode,
            contextContent: mode === 'simple' ? contextContent : '',
        },
        innerBlocks: [ group ],
    };
};
