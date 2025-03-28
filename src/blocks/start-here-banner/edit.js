import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

const TEMPLATE = [
    ['core/heading', { content: "Ready to get started?", level: 3  }],
    ['core/paragraph', { content: "Before diving into the course and starting your exploration of the contents, visit the Getting Started icon to review course essentials (use of Canvas, Policies, and Support Resources), plan for success in the course, and introduce yourself." }],
    [XCLSR_BTSTRP_EDITOR_PREFIX + '/buttons', { className: 'mb-0' }, [
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/button', { className: 'btn-start-here btn-lg', text: 'Start Here', href: '#' }]
    ]]
];

export default function Edit() {

    const blockProps = useBlockProps( {
        className: 'start-here-banner'
    } );

    return (
        <>
            <div {...blockProps}>
                <div className='col offset-md-5'>
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        templateLock={true}
                    />
                </div>
            </div>
        </>
    );
}
