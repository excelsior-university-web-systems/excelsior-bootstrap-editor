import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { selectedIcon, size, decorative, noIcon, styleType } = attributes;
    const determineClassNames = () => {
        if ( styleType !== 'basic' ) {
            return `decorative ${styleType !== 'red' ? styleType : '' } ${ noIcon ? '' : `bi ${selectedIcon}${size !== 'regular' ? ' ' + size : '' }`}`
        }
        return '';
    };
    const blockProps = useBlockProps.save( {
        className: determineClassNames(),
        role: decorative ? 'presentation' : undefined
    } );

    return (
        <hr {...blockProps} />
    );
}
