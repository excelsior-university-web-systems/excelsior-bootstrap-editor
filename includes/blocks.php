<?php
namespace ExcelsiorBootstrapEditor;
require_once plugin_dir_path( __FILE__ ) . 'constants.php';

/*
  Automate the registration of custom Gutenberg blocks by dynamically loading
  all block directories from the blocks folder.
*/
add_action( 'init', function() {

    $blocks_dir = plugin_dir_path( __FILE__ ) . '../build/blocks/';
    
    foreach ( glob( $blocks_dir . '*', GLOB_ONLYDIR ) as $block_dir ) {
        register_block_type( $block_dir );
    }

} );

/*
  Add a custom block category named "Excelsior Bootstrap" within the Gutenberg editor,
  where blocks related to the Excelsior Bootstrap Editor plugin can be grouped together.
*/
add_filter( 'block_categories_all', function( $categories, $post ) {

    return array_merge(
        array(
            array(
                'slug' => XCLSR_BTSTRP_EDITOR_PREFIX.'-blocks',
                'title' => XCLSR_BTSTRP_LABEL,
            ),
        ),
        $categories
    );

} , 10, 2 );

/*
  Load specific JavaScript files that modify the block editor and
  add custom functionalities when editing excelsior_bootstrap_editor posts.
*/
add_action( 'enqueue_block_editor_assets', function() {

    global $post_type;

    if ( $post_type === XCLSR_BTSTRP_POST_TYPE ) {

        // editor modification script
        wp_enqueue_script(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-modification',
            plugins_url( '/build/editor/index.js', dirname(__FILE__) ),
            array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' )
        );

        // insert icon script
        wp_enqueue_script(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-inline-icon',
            plugins_url( '/build/icons/index.js', dirname(__FILE__) ),
            array( 'wp-rich-text', 'wp-element', 'wp-editor' )
        );

    }

} );

?>