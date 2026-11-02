<?php
namespace ExcelsiorBootstrapEditor;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'constants.php';

/*
  The framework's "Enlarge Image" modal inserts decoded alt text into an HTML string,
  where a straight double quote would end the attribute and allow markup injection.
  Replace it with a typographic quote on every page that loads the framework.
*/
function neutralize_image_alt_quotes( $content ) {
    if ( ! is_string( $content ) || false === stripos( $content, '<img' ) ) {
        return $content;
    }

    if ( ! has_block( XCLSR_BTSTRP_EDITOR_PREFIX.'/namespace' ) ) {
        return $content;
    }

    $processor = new \WP_HTML_Tag_Processor( $content );

    while ( $processor->next_tag( 'img' ) ) {
        $alt = $processor->get_attribute( 'alt' );

        if ( is_string( $alt ) && false !== strpos( $alt, '"' ) ) {
            $processor->set_attribute( 'alt', str_replace( '"', "\u{201D}", $alt ) );
        }
    }

    return $processor->get_updated_html();
}

// Runs after do_blocks (9) and wp_filter_content_tags (12).
add_filter( 'the_content', __NAMESPACE__.'\\neutralize_image_alt_quotes', 20 );
