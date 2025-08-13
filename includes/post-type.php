<?php
namespace ExcelsiorBootstrapEditor;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'constants.php';

function add_excelsior_bootstrap_post_type() {

    $visibility     = get_option( 'boots_editor_is_public', false );
    $is_public      = ( $visibility == '1' );

    $searchability  = get_option( 'boots_editor_is_searchable', false );
    $is_searchable  = ( $searchability == '1' );

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
        'public'              => $is_public,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'map_meta_cap'        => true,
        'capabilities'        => array(
            'read'                   => 'read',
            'delete_posts'            => 'delete_'.XCLSR_BTSTRP_POST_TYPE.'s',
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
        'supports'            => array( 'title', 'editor', 'author', 'revisions', 'custom-fields' ),
        'has_archive'         => false,
        'exclude_from_search' => ! $is_searchable,
        'publicly_queryable'  => $is_public,
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

    \register_post_type( XCLSR_BTSTRP_POST_TYPE, $args );

    \register_post_meta( XCLSR_BTSTRP_POST_TYPE, XCLSR_BTSTRP_POST_TYPE.'_post_course_number', array(
        'type' => 'string',
        'show_in_rest' => true,
        'single' => true,
        'default' => '',
    ) );

    \register_post_meta( XCLSR_BTSTRP_POST_TYPE, XCLSR_BTSTRP_POST_TYPE.'_post_page_title', array(
        'type' => 'string',
        'show_in_rest' => true,
        'single' => true,
        'default' => '',
    ) );

    \register_post_meta( XCLSR_BTSTRP_POST_TYPE, XCLSR_BTSTRP_POST_TYPE.'_post_year', array(
        'type' => 'string',
        'show_in_rest' => true,
        'single' => true,
        'default' => '',
    ) );

    \ExcelsiorBootstrapEditor\add_excelsior_bootstrap_capabilities();
}

add_action( 'init', __NAMESPACE__.'\\add_excelsior_bootstrap_post_type' );

/*
  Assign custom capabilities (defined during post type registration)
  to administrator and editor user roles
*/
function add_excelsior_bootstrap_capabilities() {
    $roles = array( 'administrator' );

    foreach ( $roles as $role_name ) {

        $role = \get_role($role_name );
        
        if ( !$role ) continue;

        $role->add_cap( 'read' );
        $role->add_cap( 'delete_'.XCLSR_BTSTRP_POST_TYPE.'s' );
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

function set_empty_title_post_to_draft( $data ) {
    if ( $data['post_type'] === XCLSR_BTSTRP_POST_TYPE && $data['post_status'] === 'publish' ) {

        if ( empty( $data['post_title'] ) ) {
            $data['post_status'] = 'draft';
        }
    }

    return $data;
}

add_filter( 'wp_insert_post_data', __NAMESPACE__.'\\set_empty_title_post_to_draft', 10, 2 );

/**
 * Generates a hashed slug for new Excelsior Bootstrap page if slug hashing is enabled.
 *
 * - Applies only to posts of the excelsior_bootstrap post type.
 * - Checks the plugin option `editor_hash_slug_option` before applying.
 * - For new posts, generates a unique slug using microtime and a random password.
 * - Hashes the base string using MD5 to ensure a unique, fixed-length slug.
 *
 * @param array $data    Sanitized post data.
 * @param array $postarr Raw post data.
 * @return array Modified post data with hashed slug if applicable.
 */
function editor_hash_slug( $data, $postarr ) {
    if ( $data['post_type'] !== XCLSR_BTSTRP_POST_TYPE ) {
        return $data;
    }

    if ( ! get_option( 'boots_editor_hash_slug_option', false ) ) {
        return $data;
    }

    // Only generate slug if it's a new post
    $is_new_post = empty( $postarr['ID'] ) || get_post_status( $postarr['ID'] ) === false;

    if ( $is_new_post ) {
        $time = microtime( true );
        $rand = wp_generate_password( 6, false );
        $base = 'boots-editor-' . $time . '-' . $rand;

        $data['post_name'] = md5( $base );
    }

    return $data;
}

add_filter( 'wp_insert_post_data', __NAMESPACE__ . '\\editor_hash_slug', 10, 2 );

function course_and_year_filtering_dropdown() {
    global $typenow, $wpdb;

    if ( $typenow !== XCLSR_BTSTRP_POST_TYPE ) {
        return;
    }

    $course_number_meta_key = XCLSR_BTSTRP_POST_TYPE.'_post_course_number';
    $year_meta_key = XCLSR_BTSTRP_POST_TYPE.'_post_year';

    $course_numbers = $wpdb->get_col( $wpdb->prepare(
        "SELECT DISTINCT meta_value FROM $wpdb->postmeta WHERE meta_key = %s AND meta_value != '' ORDER BY meta_value ASC",
        $course_number_meta_key
    ) );

    $years = $wpdb->get_col( $wpdb->prepare(
        "SELECT DISTINCT meta_value FROM $wpdb->postmeta WHERE meta_key = %s AND meta_value != '' ORDER BY meta_value DESC",
        $year_meta_key
    ) );

    $selected_course = isset( $_GET['course_number'] ) ? sanitize_text_field( $_GET['course_number'] ) : '';
    $selected_year = isset( $_GET['year'] ) ? sanitize_text_field( $_GET['year'] ) : '';

    ?>
    <select name="course_number">
        <option value="">Filter by Course Number</option>
        <?php foreach ( $course_numbers as $value ) : ?>
            <option value="<?php echo esc_attr( $value ); ?>" <?php selected( $selected_course, $value ); ?>>
                <?php echo esc_html( $value ); ?>
            </option>
        <?php endforeach; ?>
    </select>
    <?php

    // Year Dropdown
    ?>
    <select name="year">
        <option value="">Filter by Year</option>
        <?php foreach ( $years as $value ) : ?>
            <option value="<?php echo esc_attr( $value ); ?>" <?php selected( $selected_year, $value ); ?>>
                <?php echo esc_html( $value ); ?>
            </option>
        <?php endforeach; ?>
    </select>
    <?php
}

add_action( 'restrict_manage_posts', __NAMESPACE__.'\\course_and_year_filtering_dropdown' );

function filter_posts_by_course_number_and_year( $query ) {
    global $pagenow;

    if ( is_admin() && $pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] === XCLSR_BTSTRP_POST_TYPE ) {
        $meta_query = array();

        // Filter by Course Number
        if ( !empty( $_GET['course_number'] ) ) {
            $meta_query[] = array(
                'key'     => XCLSR_BTSTRP_POST_TYPE.'_post_course_number',
                'value'   => sanitize_text_field( $_GET['course_number'] ),
                'compare' => '='
            );
        }

        // Filter by Year
        if ( !empty( $_GET['year'] ) ) {
            $meta_query[] = array(
                'key'     => XCLSR_BTSTRP_POST_TYPE.'_post_year',
                'value'   => sanitize_text_field( $_GET['year'] ),
                'compare' => '='
            );
        }

        if ( !empty( $meta_query ) ) {
            $query->set( 'meta_query', $meta_query );
        }
    }
}

add_action( 'pre_get_posts', __NAMESPACE__.'\\filter_posts_by_course_number_and_year' );

function add_course_number_and_year_query_var( $vars ) {
    $vars[] = 'course_number';
    $vars[] = 'year';
    return $vars;
}

add_filter( 'query_vars', __NAMESPACE__.'\\add_course_number_and_year_query_var' );

function hide_date_filter_dropdown() {
    global $typenow;

    if ( $typenow === XCLSR_BTSTRP_POST_TYPE ) {
        echo '<style>#filter-by-date{ display: none !important; }</style>';
    }
}

add_action('admin_head', __NAMESPACE__.'\\hide_date_filter_dropdown');

/**
 * Removes all styles and scripts on Excelsior Bootstrap single pages except allowed ones and enqueues the ReBlock frontend script.
 *
 * - Registers and enqueues the `reblock-single` script from the build directory.
 * - Passes the current post ID to JavaScript via `wp_localize_script`.
 * - Retains required assets such as global styles, Excelsior Bootstrap, and allowed user-defined handles.
 * - Optionally disables the WordPress admin bar and its associated styles.
 * - Dequeues all non-allowed styles and scripts for a clean front-end rendering.
 *
 * @return void
 */
function boots_remove_all_styles_and_scripts() {
    if ( !is_singular( XCLSR_BTSTRP_POST_TYPE ) ) {
        return;
    }

    global $wp_styles, $wp_scripts;
    $required[] = 'excelsior-bootstrap-editor-frontend';

    if ( !in_array('excelsior-bootstrap-editor-frontend', $wp_styles->queue, true ) ) {
        wp_enqueue_style( 'excelsior-bootstrap-editor-frontend' );
        wp_enqueue_script( 'excelsior-bootstrap-editor-frontend' );
    }

    // Disable admin bar if option is false
    if ( !get_option( 'boots_editor_show_wp_admin_bar', false ) ) {
        add_filter( 'show_admin_bar', '__return_false' );
        wp_dequeue_style( 'admin-bar' );
        wp_deregister_style( 'admin-bar' );
    }

    // Retain 'global-styles' if global styles are allowed
    if ( get_option( 'boots_editor_allow_global_styles', false ) ) {
        $required[] = 'global-styles';
    }

    $allowed_option = get_option( 'boots_editor_allowed_styles_scripts', '' );

    if ( $allowed_option === '*' ) {
        return;
    }

    $allowed = array_map( 'trim', explode( ',', $allowed_option ) );
    $combined = array_unique( array_merge( $required, $allowed ) );

    // Ensure admin-bar is preserved if admin bar is enabled
    if ( get_option( 'boots_editor_show_wp_admin_bar', false ) && !in_array( 'admin-bar', $combined, true ) ) {
        $combined[] = 'admin-bar';
    }

    // Ensure global-styles is removed if global styles are disabled
    if ( !get_option( 'boots_editor_allow_global_styles', true ) && in_array( 'global-styles', $combined, true ) ) {
        $global_styles_key = array_search( 'global-styles', $combined );
        unset( $combined[$global_styles_key] );
    }

    foreach ( $wp_styles->queue as $style ) {
        if ( !in_array( $style, $combined, true ) ) {
            wp_dequeue_style( $style );
            wp_deregister_style( $style );
        }
    }

    foreach ( $wp_scripts->queue as $script ) {
        if ( !in_array( $script, $combined, true ) ) {
            wp_dequeue_script( $script );
            wp_deregister_script( $script );
        }
    }
}

add_action( 'wp_enqueue_scripts', __NAMESPACE__.'\\boots_remove_all_styles_and_scripts', 999 );

/**
 * Loads a custom blank template for single posts.
 * - Returns the plugin-provided blank template if it exists.
 * - Falls back to the default template otherwise.
 *
 * @param string $template The default single post template path.
 * @return string The modified or original template path.
 */
function blank_single_template( $template ) {
    if ( is_singular( XCLSR_BTSTRP_POST_TYPE ) ) {
        $plugin_template = plugin_dir_path( __FILE__ ) . 'templates/blank.php';
        if ( file_exists( $plugin_template ) ) {
            return $plugin_template;
        }
    }
    
    return $template;
}

add_filter( 'single_template', __NAMESPACE__.'\\blank_single_template', 11 );
?>