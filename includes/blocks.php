<?php

function register_excelsior_bootstrap_blocks() {
    $blocks_dir = plugin_dir_path( __FILE__ ) . '../build/blocks/';
    
    foreach (glob($blocks_dir . '*', GLOB_ONLYDIR) as $block_dir) {
        register_block_type($block_dir);
    }
}


add_action('init', 'register_excelsior_bootstrap_blocks');

function excelsior_bootstrap_block_category( $categories, $post ) {
    return array_merge(
        array(
            array(
                'slug' => 'excelsior-bootstrap-blocks',
                'title' => 'Excelsior Bootstrap',
            ),
        ),
        $categories
    );
}

add_filter( 'block_categories_all', 'excelsior_bootstrap_block_category', 10, 2 );

function enqueue_icon_format_script() {
    wp_enqueue_script(
        'excelsior-bootstrap-inline-icon',
        plugins_url( '/build/icons/index.js', dirname(__FILE__) ),
        array( 'wp-rich-text', 'wp-element', 'wp-editor' )
    );
}
add_action( 'enqueue_block_editor_assets', 'enqueue_icon_format_script' );

?>