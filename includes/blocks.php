<?php
namespace ExcelsiorBootstrapEditor;
require_once plugin_dir_path( __FILE__ ) . 'constants.php';

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
  Automate the registration of custom Gutenberg blocks by dynamically loading
  all block directories from the blocks folder. Load specific JavaScript files that modify
  the block editor and add custom functionalities when editing excelsior_bootstrap_editor posts.
*/
add_action( 'enqueue_block_editor_assets', function() {

    global $post_type;

    wp_register_script(
        XCLSR_BTSTRP_EDITOR_PREFIX.'-blocks-script',
        plugins_url( '/build/blocks/index.js', dirname(__FILE__) ),
        array( 'wp-blocks', 'wp-dom-ready', 'wp-element' ),
        XCLSR_BTSTRP_EDITOR_VERSION
    );

    wp_register_style(
        XCLSR_BTSTRP_EDITOR_PREFIX.'-style',
        plugin_dir_url(__FILE__) . '../css/editor-style.css',
        array(),
        XCLSR_BTSTRP_EDITOR_VERSION
    );

    wp_register_style(
        XCLSR_BTSTRP_EDITOR_PREFIX.'-frontend-style',
        plugin_dir_url(__FILE__) . '../css/excelsior-bootstrap.css',
        array(),
        '1.0.7'
    );

    $blocks_file = plugin_dir_path(__FILE__) . '../build/blocks/blocks.json';
    $blocks = json_decode( file_get_contents( $blocks_file ), true );
    
    // register each blocks 
    if ( !empty( $blocks['blocks'] ) ) {
        foreach ( $blocks['blocks'] as $block ) {
            register_block_type( plugin_dir_path(__FILE__) . '../build/blocks/' . $block, array(
                'editor_script' => XCLSR_BTSTRP_EDITOR_PREFIX.'-blocks-script',
                'editor_style'  => XCLSR_BTSTRP_EDITOR_PREFIX.'-style',
                'style'         => XCLSR_BTSTRP_EDITOR_PREFIX.'-frontend-style'
            ) );
        }
    }

    // editor block preview
    wp_localize_script( XCLSR_BTSTRP_EDITOR_PREFIX.'-blocks-script', 'xclsr_btstrp_block_preview', array(
        'pluginUrl' => plugin_dir_url( dirname(__FILE__) )
    ) );

    // core table modification
    wp_enqueue_script(
        XCLSR_BTSTRP_EDITOR_PREFIX.'-core-table-modification',
        plugins_url( '/build/table/index.js', dirname(__FILE__) ),
        array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
        XCLSR_BTSTRP_EDITOR_VERSION
    );

    // insert icon script
    wp_enqueue_script(
        XCLSR_BTSTRP_EDITOR_PREFIX.'-inline-icon',
        plugins_url( '/build/icons/index.js', dirname(__FILE__) ),
        array( 'wp-rich-text', 'wp-element', 'wp-editor' ),
        XCLSR_BTSTRP_EDITOR_VERSION
    );

    //insert inline code script
    wp_enqueue_script(
        XCLSR_BTSTRP_EDITOR_PREFIX.'-inline-code',
        plugins_url( '/build/inline-code/index.js', dirname(__FILE__) ),
        array( 'wp-rich-text', 'wp-element', 'wp-editor' ),
        XCLSR_BTSTRP_EDITOR_VERSION
    );

    if ( $post_type === XCLSR_BTSTRP_POST_TYPE ) {

        // editor modification script/style
        wp_enqueue_script(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-modification',
            plugins_url( '/build/editor/index.js', dirname(__FILE__) ),
            array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
            XCLSR_BTSTRP_EDITOR_VERSION
        );

        wp_enqueue_style(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-wp-editor-style',
            plugin_dir_url(__FILE__) . '../css/wp-editor-style.css',
            array(),
            XCLSR_BTSTRP_EDITOR_VERSION
        );

    }

} );

?>