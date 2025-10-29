import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from './allowed-blocks';

export default function Edit() {
    
    const blockProps = useBlockProps( {
        className: ""
    } );

    const TEMPLATE = [
        ['excelsior-bootstrap-editor/image'],
        [
            'core/group',
            {className: 'carousel-caption vh-sm-down'},
            [
                ['core/paragraph', {placeholder: 'Add slide caption...'}],
            ]
        ]

    ];

    return (
        <div {...blockProps}>
            <InnerBlocks template={TEMPLATE} allowedBlocks={ALLOWED_BLOCKS} templateLock='all' />
        </div>
    );
}
