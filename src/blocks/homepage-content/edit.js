import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';

const TEMPLATE = [
    ['core/heading', { content: 'Welcome to [Course Title]!' }],
    ['core/paragraph', { content: "[This course explores big data's impact on industries through the Internet of Things (IoT). Students study industry strategies for leveraging data in decision-making, and they learn to design data visualizations through processes like data modeling, processing (aggregation, filtering), mapping data to graphical attributes, and strategic visual encoding based on visual perception properties and the task(s) at hand.]" }],
    ['core/paragraph', { content: "To access your course materials, select the Modules option from the navigation menu." }],
    ['excelsior-bootstrap/buttons', {}, [
        ['excelsior-bootstrap/button', { text: '<i class="bi bi-person-fill" role="presentation" aria-hidden="true">&nbsp;</i> Your Instructor and Peers', href: '#' }]
    ]]
];

export default function Edit() {

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
                    renderAppender={() => <InnerBlocks.DefaultBlockAppender />}
                />
            </div>
        </>
    );
}
