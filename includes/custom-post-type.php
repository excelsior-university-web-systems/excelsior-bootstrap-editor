<?php
// Actions
add_action( 'init', 'register_excelsior_bootstrap_post_type' );
add_action( 'init', 'add_excelsior_bootstrap_capabilities' );
add_action( 'admin_enqueue_scripts', 'load_excelsior_bootstrap_editor_assets' );

function register_excelsior_bootstrap_post_type() {
    $args = array(
        'labels'              => array(
            'name'               => 'Excelsior Bootstrap Editor',
            'singular_name'      => 'Page',
            'add_new'            => 'Add New Page',
            'add_new_item'       => 'Add New Page',
            'edit_item'          => 'Edit Page',
            'new_item'           => 'New Page',
            'view_item'          => 'View Page',
            'view_items'         => 'View Pages',
            'search_items'       => 'Search Pages',
            'not_found'          => 'No pages found',
            'not_found_in_trash' => 'No pages found in trash',
            'all_items'          => 'All Pages',
            'attributes'         => 'Page Attributes',
        ),
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'capability_type'     => 'page',
        'map_meta_cap'        => true,
        'capabilities'        => array(
            'edit_post'          => 'edit_excelsior_bootstrap',
            'read_post'          => 'read_excelsior_bootstrap',
            'delete_post'        => 'delete_excelsior_bootstrap',
            'edit_posts'         => 'edit_excelsior_bootstraps',
            'edit_others_posts'  => 'edit_others_excelsior_bootstraps',
            'publish_posts'      => 'publish_excelsior_bootstraps',
            'read_private_posts' => 'read_private_excelsior_bootstraps',
        ),
        'supports'            => array( 'title', 'editor', 'author', 'revisions' ),
        'has_archive'         => false,
        'exclude_from_search' => true,
        'publicly_queryable'  => false,
        'show_in_nav_menus'   => false,
        'show_in_admin_bar'   => false,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-welcome-widgets-menus',
        'delete_with_user'    => false,
        'template'            => array(
            array( 'excelsior-bootstrap/namespace' ),
        ),
        'template_lock'       => 'all',
    );

    register_post_type( 'excelsior_bootstrap', $args );
}

function add_excelsior_bootstrap_capabilities() {
    $roles = array( 'administrator', 'editor' );

    foreach ( $roles as $role_name ) {

        $role = get_role ($role_name );
        
        if ( !$role ) continue;

        $role->add_cap( 'edit_excelsior_bootstrap' );
        $role->add_cap( 'read_excelsior_bootstrap' );
        $role->add_cap( 'delete_excelsior_bootstrap' );
        $role->add_cap( 'edit_excelsior_bootstraps' );
        $role->add_cap( 'edit_others_excelsior_bootstraps' );
        $role->add_cap( 'publish_excelsior_bootstraps' );
        $role->add_cap( 'read_private_excelsior_bootstraps' );

    }
}

function load_excelsior_bootstrap_editor_assets( $hook ) {
    global $post;
    
    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
        if ( 'excelsior_bootstrap' === $post->post_type ) {
            wp_enqueue_style( 'excelsior-bootstrap-editor-style', plugin_dir_url(__FILE__) . '../css/excelsior-bootstrap.css' );
            // wp_enqueue_script( 'excelsior-bootstrap-editor-script', plugin_dir_url(__FILE__) . '../js/excelsior-bootstrap.js', array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'), filemtime( plugin_dir_path(__FILE__) . '../js/excelsior-bootstrap.js' ), true );
        }
    }
}