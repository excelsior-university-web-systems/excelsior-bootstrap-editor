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
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'map_meta_cap'        => true,
        'capabilities'        => array(
            'read'                   => 'read',
            'edit_post'              => 'edit_'.XCLSR_BTSTRP_POST_TYPE,
            'read_post'              => 'read_'.XCLSR_BTSTRP_POST_TYPE,
            'delete_post'            => 'delete_'.XCLSR_BTSTRP_POST_TYPE,
            'edit_posts'             => 'edit_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'edit_others_posts'      => 'edit_others_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'publish_posts'          => 'publish_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'read_private_posts'     => 'read_private_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'delete_private_posts'   => 'delete_private_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'delete_published_posts' => 'delete_published_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'delete_others_posts'    => 'delete_others_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'edit_private_posts'     => 'edit_private_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'edit_published_posts'   => 'edit_published_'.XCLSR_BTSTRP_POST_TYPE.'s',
            'create_posts'           => 'edit_'.XCLSR_BTSTRP_POST_TYPE.'s'
        ),
        'supports'            => array( 'title', 'editor', 'author', 'custom-fields' ),
        'has_archive'         => false,
        'exclude_from_search' => true,
        'publicly_queryable'  => false,
        'show_in_nav_menus'   => false,
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

    register_post_meta( XCLSR_BTSTRP_POST_TYPE, XCLSR_BTSTRP_POST_TYPE.'_post_course_number', array(
        'type' => 'string',
        'show_in_rest' => true,
        'single' => true,
        'default' => '',
    ) );

    register_post_meta( XCLSR_BTSTRP_POST_TYPE, XCLSR_BTSTRP_POST_TYPE.'_post_page_title', array(
        'type' => 'string',
        'show_in_rest' => true,
        'single' => true,
        'default' => '',
    ) );

    register_post_meta( XCLSR_BTSTRP_POST_TYPE, XCLSR_BTSTRP_POST_TYPE.'_post_year', array(
        'type' => 'string',
        'show_in_rest' => true,
        'single' => true,
        'default' => date("Y"),
    ) );

    \ExcelsiorBootstrapEditor\add_excelsior_bootstrap_capabilities();

} );

/*
  Assign custom capabilities (defined during post type registration)
  to administrator and editor user roles
*/
function add_excelsior_bootstrap_capabilities() {
    $roles = array( 'administrator', 'editor' );

    foreach ( $roles as $role_name ) {

        $role = get_role ($role_name );
        
        if ( !$role ) continue;

        $role->add_cap( 'read' );
        $role->add_cap( 'edit_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'read_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'delete_'.XCLSR_BTSTRP_POST_TYPE );
        $role->add_cap( 'edit_'.XCLSR_BTSTRP_POST_TYPE.'s' );
        $role->add_cap( 'edit_others_'.XCLSR_BTSTRP_POST_TYPE.'s' );
        $role->add_cap( 'publish_'.XCLSR_BTSTRP_POST_TYPE.'s' );
        $role->add_cap( 'read_private_'.XCLSR_BTSTRP_POST_TYPE.'s' );
        $role->add_cap( 'delete_private_'.XCLSR_BTSTRP_POST_TYPE.'s' );
        $role->add_cap( 'delete_published_'.XCLSR_BTSTRP_POST_TYPE.'s' );
        $role->add_cap( 'delete_others_'.XCLSR_BTSTRP_POST_TYPE.'s' );
        $role->add_cap( 'edit_private_'.XCLSR_BTSTRP_POST_TYPE.'s' );
        $role->add_cap( 'edit_published_'.XCLSR_BTSTRP_POST_TYPE.'s' );

    }
}

add_filter( 'wp_insert_post_data', function( $data ) {

    if ( $data['post_type'] === XCLSR_BTSTRP_POST_TYPE && $data['post_status'] === 'publish' ) {

        if ( empty( $data['post_title'] ) ) {
            $data['post_status'] = 'draft';
        }
    }

    return $data;

}, 10, 2 );

?>