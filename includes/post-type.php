<?php
namespace ExcelsiorBootstrapEditor;
require_once plugin_dir_path( __FILE__ ) . 'constants.php';

/*
 Register a custom post type with specific labels, capabilities, and
 block template tailored Excelsior Bootstrap Editor plugin.
*/
add_action( 'init', function() {

    $args = array(
        'labels'                    => array(
            'name'                  => XCLSR_BTSTRP_POST_TYPE_NAME,
            'singular_name'         => 'Page',
            'add_new'               => 'Add New Page',
            'add_new_item'          => 'Add New Page',
            'edit_item'             => 'Edit Page',
            'new_item'              => 'New Page',
            'view_item'             => 'View Page',
            'view_items'            => 'View Pages',
            'search_items'          => 'Search Pages',
            'not_found'             => 'No pages found',
            'not_found_in_trash'    => 'No pages found in trash',
            'all_items'             => 'All Pages',
            'insert_into_item'      => 'Insert into page',
            'uploaded_to_this_item' => 'Uploaded to this page',
            'attributes'            => 'Page Attributes',
            'filter_items_list'     => 'Filter pages list',
            'items_list'            => 'Pages list',
            'item_published'        => 'Page published',
            'item_updated'          => 'Page updated',
            'item_trashed'          => 'Page trashed'
        ),
        'show_ui'             => true,
        'show_in_menu'        => true,
        'capability_type'     => 'page',
        'map_meta_cap'        => true,
        'capabilities'        => array(
            'edit_post'          => 'edit_'.XCLSR_BTSTRP_POST_TYPE,
            'read_post'          => 'read_'.XCLSR_BTSTRP_POST_TYPE,
            'delete_post'        => 'delete_'XCLSR_BTSTRP_POST_TYPE,
            'edit_posts'         => 'edit_'.XCLSR_BTSTRP_POST_TYPE,
            'edit_others_posts'  => 'edit_others_'.XCLSR_BTSTRP_POST_TYPE,
            'publish_posts'      => 'publish_'.XCLSR_BTSTRP_POST_TYPE,
            'read_private_posts' => 'read_private_'.XCLSR_BTSTRP_POST_TYPE,
        ),
        'supports'            => array( 'title', 'editor', 'author' ),
        'show_in_admin_bar'   => false,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-welcome-widgets-menus',
        'delete_with_user'    => false,
        'template'            => array(
            array( XCLSR_BTSTRP_EDITOR_PREFIX.'/namespace' ),
        ),
        'template_lock'       => 'insert',
    );

    register_post_type( XCLSR_BTSTRP_POST_TYPE, $args );
    add_excelsior_bootstrap_editor_capabilities();

} );

/*
  Assign custom capabilities (defined during post type registration)
  to administrator and editor user roles
*/
function add_excelsior_bootstrap_editor_capabilities() {

    $roles = array( 'administrator', 'editor' );

    foreach ( $roles as $role_name ) {

        $role = get_role($role_name );
        
        if ( !$role ) continue;

        // editing, reading, deleting, and publishing, as well as editing posts created by others
        $role->add_cap( 'edit_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'read_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'delete_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'edit_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'edit_others_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'publish_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'read_private_'.XCLSR_BTSTRP_POST_TYPE );

    }
}

/*
  Manage the styles loaded when editing or creating Excelsior Bootstrap Editor pages
*/
add_action( 'admin_enqueue_scripts', function ( $hook ) {

    global $post;
    
    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
        if ( XCLSR_BTSTRP_POST_TYPE === $post->post_type ) {

            //removes default WordPress styles that are usually loaded in the block editor
            wp_dequeue_style( 'wc-block-style' );
            wp_dequeue_style( 'wp-block-library' );
            wp_dequeue_style( 'wp-block-library-theme' );
            wp_dequeue_style( 'classic-theme-styles' );

            // CSS specifically for the block editor
            wp_enqueue_style( XCLSR_BTSTRP_EDITOR_PREFIX.'-style', plugin_dir_url(__FILE__) . '../css/editor-style.css', array(), false );

            // Main Excelsior Bootstrap style
            wp_enqueue_style( 'excelsior-bootstrap-style', plugin_dir_url(__FILE__) . '../css/excelsior-bootstrap.css', array(), true );

            // wp_enqueue_script( 'excelsior-bootstrap-editor-script', plugin_dir_url(__FILE__) . '../js/excelsior-bootstrap.js', array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'), filemtime( plugin_dir_path(__FILE__) . '../js/excelsior-bootstrap.js' ), true );

        }
    }

} );

?>