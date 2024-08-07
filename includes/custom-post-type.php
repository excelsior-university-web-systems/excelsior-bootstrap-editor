<?php

function register_excelsior_bootstrap_post_type() {
    $args = array(
        'label'               => 'Excelsior Bootstrap Editor',
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'capability_type'     => 'post',
        'supports'            => array( 'title', 'editor', 'author', 'revisions' ),
        'has_archive'         => false,
        'exclude_from_search' => true,
        'publicly_queryable'  => false,
        'show_in_nav_menus'   => false,
        'show_in_admin_bar'   => false,
        'menu_icon'           => 'dashicons-welcome-widgets-menus',
        'delete_with_user'    => false,
        'template'            => array(
            array( 'excelsior-bootstrap/editor' ),
        ),
        'template_lock'       => 'all',
    );

    register_post_type( 'excelsior_bootstrap', $args );
}
add_action( 'init', 'register_excelsior_bootstrap_post_type' );

function load_excelsior_bootstrap_editor_assets( $hook ) {
    global $post;
    
    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
        if ( 'excelsior_bootstrap' === $post->post_type ) {
            wp_enqueue_style( 'excelsior-bootstrap-editor-style', plugin_dir_url(__FILE__) . '../css/excelsior-bootstrap.css' );
            wp_enqueue_script( 'excelsior-bootstrap-editor-script', plugin_dir_url(__FILE__) . '../js/excelsior-bootstrap.js', array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'), filemtime( plugin_dir_path(__FILE__) . '../js/excelsior-bootstrap.js' ), true );
        }
    }
}
add_action( 'admin_enqueue_scripts', 'load_excelsior_bootstrap_editor_assets' );

function restrict_blocks_for_excelsior_bootstrap( $allowed_block_types, $post ) {
    if ( $post->post_type !== 'excelsior_bootstrap' ) {
        return $allowed_block_types;
    }

    return array(
        'core/heading',
        'core/paragraph',
        'core/list',
        'core/list-item',
        'core/image',
        'excelsior-bootstrap/editor',
    );
}
add_filter( 'allowed_block_types_all', 'restrict_blocks_for_excelsior_bootstrap', 10, 2 );