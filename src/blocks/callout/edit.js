import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Notice } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import metadata from './block.json';

const CALLOUT_HEADING_PREFIX = {
    supplemental: '<i class="bi bi-paperclip" role="presentation" aria-hidden="true">&nbsp;</i> Supplemental:',
    guide: '<i class="bi bi-lamp-fill" role="presentation" aria-hidden="true">&nbsp;</i> Spotlight:',
    skills: '<i class="bi bi-symmetry-vertical" role="presentation" aria-hidden="true">&nbsp;</i> Reflection:'
};

const getCalloutHeadingContent = ( styleType, currentContent = '' ) => {
    const prefix = CALLOUT_HEADING_PREFIX[styleType];

    if ( !prefix ) {
        return null;
    }

    const headingContent = currentContent || '';
    const titleStart = headingContent.indexOf( ':' );
    const titleContent = titleStart >= 0 ? headingContent.slice( titleStart + 1 ) : ' [title]';

    return prefix + titleContent;
};

export default function Edit ({ attributes, setAttributes, clientId }) {

    const { styleType } = attributes;
    const headingAttributes = {
        headingSizeClass: 'h5',
        level: 3,
        placeholder: 'Heading'
    };
    const innerBlocks = useSelect(
        ( select ) => select( 'core/block-editor' ).getBlocks( clientId ) || [],
        [ clientId ]
    );
    const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

    const defaultHeadingContent = getCalloutHeadingContent( styleType );

    if ( defaultHeadingContent ) {
        headingAttributes.content = defaultHeadingContent;
    }

    const TEMPLATE = [
        ['core/heading', headingAttributes],
        ['core/paragraph', {placeholder: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'}]
    ];
    
    const previewImage = metadata?.example?.attributes?.cover || '';
    const isPreview = useSelect(
        ( select ) => !!select( 'core/block-editor' ).getSettings()?.isPreviewMode,
        []
    );

    const blockProps = useBlockProps( {
        className: `callout callout-${styleType}`,
        role: 'complementary'
    } );
    const updateStyleType = ( value ) => {
        const headingBlock = innerBlocks.find( ( block ) => block.name === 'core/heading' );
        const nextHeadingContent = getCalloutHeadingContent( value, headingBlock?.attributes?.content );

        setAttributes( { styleType: value } );

        if ( headingBlock && nextHeadingContent ) {
            updateBlockAttributes( headingBlock.clientId, {
                content: nextHeadingContent
            } );
        }
    };

    if ( isPreview && previewImage ) {
        return <img src={xclsr_btstrp_block_preview.pluginUrl + previewImage} width='100%' height='auto' />;
    }

    return (
        <>
        <InspectorControls>
            <PanelBody title="Settings" className="deprecated">
            <Notice status="warning" isDismissible={false}>Quote style is deprecated. Do not use. It will be removed in the near future. Supplement style is not fully supported yet.</Notice>
            <SelectControl
                label="Styles"
                value={styleType}
                options={[
                    { label: 'Supplemental', value: 'supplemental' },
                    { label: 'Spotlight (formerly, Guide)', value: 'guide' },
                    { label: 'Quote (DEPRECATED)', value: 'quote' },
                    { label: 'Reflection (formerly, Skills)', value: 'skills' },
                ]}
                onChange={updateStyleType}
                __nextHasNoMarginBottom
                __next40pxDefaultSize
            />
            </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
                templateLock={false}
                renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
            />
        </div>
        </>
        
    );
}
