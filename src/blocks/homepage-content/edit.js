import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';
import { XCLSR_BTSTRP_EDITOR_PREFIX } from '../../constants';

export default function Edit() {

    const TEMPLATE = [
        ['core/heading', { content: 'Welcome to [Course Title]!' }],
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/iframe-embed', { floatingClasses: 'float-md-end ms-0 ms-md-3 mb-3 mb-md-0 ratio ratio-16x9 ratio-md-0' }],
        ['core/paragraph', { content: "[This course explores big data's impact on industries through the Internet of Things (IoT). Students study industry strategies for leveraging data in decision-making, and they learn to design data visualizations through processes like data modeling, processing (aggregation, filtering), mapping data to graphical attributes, and strategic visual encoding based on visual perception properties and the task(s) at hand.]" }],
        ['core/paragraph', { content: "To access your course materials, select the Modules option from the navigation menu." }],
        [XCLSR_BTSTRP_EDITOR_PREFIX + '/buttons', { className: 'mb-0' }, [
            [XCLSR_BTSTRP_EDITOR_PREFIX + '/button', { text: '<i class="bi bi-person-fill" role="presentation" aria-hidden="true">&nbsp;</i> Your Instructor and Peers', href: '#' }]
        ]]
    ];

    const blockProps = useBlockProps( {
        className: 'homepage-content clearfix'
    } );

    return (
        <>
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={TEMPLATE}
                    templateLock={false}
                />
            </div>
        </>
    );
}
