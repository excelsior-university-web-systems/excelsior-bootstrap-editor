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
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/column', {}, [
            ['core/paragraph', {placeholder: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi consectetur, eveniet inventore autem cupiditate aliquam. Tempora debitis minima porro, odit error odio accusamus voluptatem laudantium eos, quia officia quo doloremque.'}]
        ]],
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/column', {}, [
            ['core/paragraph', {placeholder: 'A molestias autem hic error. Cupiditate, neque nisi nobis debitis perferendis laborum quos exercitationem in deserunt ducimus harum explicabo aperiam est illum distinctio! Earum soluta ullam voluptas debitis laborum dolorem!'}]
        ]],
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/column', {}, [
            ['core/paragraph', {placeholder: 'Architecto perspiciatis dignissimos, placeat maxime, aspernatur saepe dolores natus, maiores earum odio eaque repudiandae?'}]
        ]],
    ];
    
    const { colSize, cover } = attributes;
  
    const blockProps = useBlockProps( {
        className: ''
    } );

    if ( cover ) {
        return(
            <>
            <img src={xclsr_btstrp_block_preview.pluginUrl + cover} width='100%' height='auto' />
            </>
        );
    }

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

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings">
            <ToggleGroupControl
                label="Number of Columns"
                help="Select the maximum number of columns per row on full width."
                value={colSize}
                onChange={(value) => setAttributes({ colSize: value })}
                isBlock
            >
                <ToggleGroupControlOption value="2" label="2 Columns" />
                <ToggleGroupControlOption value="3" label="3 Columns" />
            </ToggleGroupControl>
            </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={[XCLSR_BTSTRP_EDITOR_PREFIX + '/column']}
                template={TEMPLATE}
                templateLock={false}
                orientation='horizontal'
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
    );
}
