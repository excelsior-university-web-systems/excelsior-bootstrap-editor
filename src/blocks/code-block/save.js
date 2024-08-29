import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    const { content, language, showLineNumbers } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<pre {...blockProps}>
			<code className={`language-${language}${showLineNumbers ? ' line-numbers' : ''}`}>
				{content}
			</code>
		</pre>
	);
}
