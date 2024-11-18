import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';
import { useEffect } from '@wordpress/element';

export default function Edit( {attributes, setAttributes} ) {

    const TEMPLATE = [
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/card', {}, []],
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/card', {}, []],
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/card', {}, []]
    ];

    const { colSize, cover } = attributes;
  
    const blockProps = useBlockProps( {
        className: ''
    } );

    useEffect(() => {
        // Select the wrapper that Gutenberg uses to wrap InnerBlocks
        const editorInnerBlocks = document.querySelector(
            `.block-editor-block-list__block[data-block="${blockProps['data-block']}"] .block-editor-block-list__layout`
        );

        // Apply the Bootstrap classes to this wrapper
        if (editorInnerBlocks) {
            // Remove previous column classes to avoid conflicts
            editorInnerBlocks.classList.remove('row-cols-1', 'row-cols-sm-2', 'row-cols-md-2', 'row-cols-md-3');
            // Apply the new column classes based on colSize
            editorInnerBlocks.classList.add('row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-' + colSize, 'g-3');
        }

        // Clean up the classes if the component unmounts or re-renders
        return () => {
            if (editorInnerBlocks) {
                editorInnerBlocks.classList.remove('row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-'+colSize, 'g-3');
            }
        };
    }, [blockProps['data-block'], colSize]);

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
    }
    
    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
            <ToggleGroupControl
                label="Number of cards per row"
                help="Select the maximum number of cards per row on a wide screen."
                value={colSize}
                onChange={(value) => setAttributes({ colSize: value })}
                isBlock
                __nextHasNoMarginBottom
                __next40pxDefaultSize
            >
                <ToggleGroupControlOption value="2" label="2" />
                <ToggleGroupControlOption value="3" label="3" />
                <ToggleGroupControlOption value="4" label="4" />
            </ToggleGroupControl>
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/card']}
                template={TEMPLATE}
                templateLock={false}
                orientation='horizontal'
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
    );
}
