<?php

function register_excelsior_bootstrap_blocks() {
    register_block_type( plugin_dir_path( __FILE__ ) . '../build/namespace' );
    register_block_type( plugin_dir_path( __FILE__ ) . '../build/container' );
    register_block_type( plugin_dir_path( __FILE__ ) . '../build/accordion' );
    register_block_type( plugin_dir_path( __FILE__ ) . '../build/accordion-item' );
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

?>