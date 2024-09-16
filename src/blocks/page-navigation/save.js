import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes }) {

    const { items } = attributes;
    const blockProps = useBlockProps.save({
        id: "page-content-nav"
    });

    return (
        <div {...blockProps}>
            <a id="page-content-mobile-nav-btn" role="button" href="#page-content-links" data-bs-toggle="collapse" aria-expanded="false" aria-controls="page-content-links"><i className="bi bi-list"></i> On this page</a>
            <div id="page-content-links" className="collapse">
            <nav>
                <ul className="nav">
                {items.map((item, index) => (
                    <li className="nav-item" key={index}>
                    <a className="nav-link" href={`#${item.id}`}>
                        {item.label}
                    </a>
                    </li>
                ))}
                </ul>
            </nav>
            </div>
        </div>
    );
}
