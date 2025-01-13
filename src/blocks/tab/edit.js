import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { generateHtmlId, removeScriptTags } from '../../commons';
import { ALLOWED_BLOCKS } from './allowed-blocks';

export default function Edit({ attributes, setAttributes, clientId, context }) {
    const { title, uniqueId, isActive } = attributes;
    const blockProps = useBlockProps( {
        className: "tab-pane",
        role: "tabpanel"
    } );

    const activeTab = context?.[XCLSR_BTSTRP_EDITOR_PREFIX + '/activeTab'];

    // Recursive function to get all blocks of a specific type
    const getBlocksOfType = (blocks, blockType) => {
        return blocks.reduce((acc, block) => {
            if (block.name === blockType) {
                acc.push(block);
            }
            if (block.innerBlocks?.length) {
                acc = acc.concat(getBlocksOfType(block.innerBlocks, blockType));
            }
            return acc;
        }, []);
    };

    // Fetch all blocks of the specific type
    const sameTypeBlocks = useSelect((select) => {
        const allBlocks = select('core/block-editor').getBlocks();
        return getBlocksOfType(allBlocks, 'excelsior-bootstrap-editor/tab');
    }, []);

    useEffect( () => {
        // Check if uniqueId already exists in other blocks of the same type
        const isDuplicate = sameTypeBlocks.some(
            ( block ) => block.clientId !== clientId && block.attributes.uniqueId === uniqueId
        );
        
        // If duplicate found or no uniqueId, generate a new one
        if ( !uniqueId || isDuplicate ) {
            setAttributes( { uniqueId: generateHtmlId() } );
        }
    }, [] );

    useEffect(() => {
        
        if ( activeTab === uniqueId ) {
            setAttributes({ isActive: true });
        } else {
            setAttributes({ isActive: false });
        }

    }, [uniqueId, activeTab]);

    return (
        <div {...blockProps} id={`${uniqueId}-pane`} aria-labelledby={`${uniqueId}-tab`}>
            <RichText
                tagName='p'
                placeholder="Tab Title"
                className='fw-bold text-body-secondary'
                value={title}
                onChange={(value) => setAttributes({ title: removeScriptTags(value) })}
                allowedFormats={[XCLSR_BTSTRP_EDITOR_PREFIX + '/inline-icon']}
            />
            <InnerBlocks template={[['core/heading', {headingSizeClass: "h4"}],['core/paragraph']]} allowedBlocks={ALLOWED_BLOCKS} templateLock={false} />
        </div>
    );
}
