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

// Register Excelsior Bootstrap frontend style once
add_action( 'init', function() {

    wp_register_script(
        XCLSR_BTSTRP_EDITOR_PREFIX.'-frontend-script',
        plugin_dir_url(__FILE__) . '../js/excelsior-bootstrap.js',
        array(),
        '1.0.8',
        array(
            'strategy' => 'defer',
            'in_footer' => true
        )
    );

    wp_register_style(
        XCLSR_BTSTRP_EDITOR_PREFIX.'-frontend-style',
        plugin_dir_url(__FILE__) . '../css/excelsior-bootstrap.css',
        array(),
        '1.0.8'
    );

} );

/*
  Automate the registration of custom Gutenberg blocks by dynamically loading
  all block directories from the blocks folder. Load specific JavaScript files that modify
  the block editor and add custom functionalities when editing excelsior_bootstrap_editor posts.
*/
add_action( 'enqueue_block_editor_assets', function() {

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

    $blocks_file = plugin_dir_path(__FILE__) . '../build/blocks/blocks.json';
    $blocks = json_decode( file_get_contents( $blocks_file ), true );
    
    // register each blocks 
    if ( !empty( $blocks['blocks'] ) ) {
        foreach ( $blocks['blocks'] as $block ) {
            register_block_type( plugin_dir_path(__FILE__) . '../build/blocks/' . $block, array(
                'editor_script_handles' => [XCLSR_BTSTRP_EDITOR_PREFIX.'-blocks-script'],
                'editor_style_handles'  => [XCLSR_BTSTRP_EDITOR_PREFIX.'-style', XCLSR_BTSTRP_EDITOR_PREFIX.'-frontend-style']
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

    global $post_type;
    if ( $post_type === XCLSR_BTSTRP_POST_TYPE ) {

        // editor modification script/style
        wp_enqueue_script(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-modification',
            plugins_url( '/build/editor/index.js', dirname(__FILE__) ),
            array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
            XCLSR_BTSTRP_EDITOR_VERSION
        );

    }

} );

add_action( 'enqueue_block_assets', function() {

    global $post_type;

    if ( $post_type === XCLSR_BTSTRP_POST_TYPE ) {

        wp_enqueue_style(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-wp-editor-style',
            plugin_dir_url(__FILE__) . '../css/wp-editor-style.css',
            array(),
            XCLSR_BTSTRP_EDITOR_VERSION
        );

    }
    
} );

// Enqueue frontend assets
add_action( 'wp_enqueue_scripts', function() {

    if ( has_block( XCLSR_BTSTRP_EDITOR_PREFIX.'/namespace' ) ) {

        if ( is_singular() ) {

            wp_enqueue_script( XCLSR_BTSTRP_EDITOR_PREFIX.'-frontend-script' );
            wp_enqueue_style( XCLSR_BTSTRP_EDITOR_PREFIX.'-frontend-style' );

            // dequeue and deregister Learning Center Theme's Bootstrap script
            if ( wp_script_is( 'main-bootstrap' ) || wp_script_is( 'main-bootstrap', 'registered' ) || wp_script_is( 'main-bootstrap', 'done' ) ) {
                wp_dequeue_script( 'main-bootstrap' );
                wp_deregister_script( 'main-bootstrap' );
            }

        }

    }

}, 20 );

add_filter( 'block_editor_settings_all', function( $editor_settings, $editor_context ) {
    
    if ( $editor_context->post->post_type === XCLSR_BTSTRP_POST_TYPE ) {
        $editor_settings['titlePlaceholder'] = TITLE_PLACEHOLDER;
        $editor_settings['disableCustomFontSizes'] = true;
        $editor_settings['disableCustomGradients'] = true;
        $editor_settings['enableCustomLineHeight'] = false;
        $editor_settings['enableCustomSpacing'] = false;
        $editor_settings['enableCustomUnits'] = false;
        $editor_settings['__experimentalFeatures']['typography']['fontStyle'] = false;
        $editor_settings['__experimentalFeatures']['typography']['letterSpacing'] = false;
        $editor_settings['__experimentalFeatures']['typography']['dropCap'] = false;
        $editor_settings['__experimentalFeatures']['typography']['fontSizes'] = [];
        $editor_settings['__experimentalFeatures']['typography']['fontWeight'] = false;
        $editor_settings['__experimentalFeatures']['typography']['textDecoration'] = false;
        $editor_settings['__experimentalFeatures']['typography']['textTransform'] = false;
        $editor_settings['__experimentalFeatures']['color']['background'] = false;
        $editor_settings['__experimentalFeatures']['color']['defaultPalette'] = false;
    }

    return $editor_settings;

}, 10, 2 );

?>