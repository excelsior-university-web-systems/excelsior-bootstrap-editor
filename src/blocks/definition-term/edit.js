import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit( { attributes, setAttributes } ) {

    const { termName } = attributes;

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
            <dd className='description'>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={[['core/paragraph']]}
                    templateLock={false}
                    renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                />
            </dd>
        </div>
        </>
    );
}
