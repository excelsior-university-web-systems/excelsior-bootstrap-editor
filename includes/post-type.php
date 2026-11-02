<?php
namespace ExcelsiorBootstrapEditor;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'constants.php';
require_once plugin_dir_path( __FILE__ ) . 'class-rest-posts-controller.php';

function is_public() {
    return get_option( 'boots_editor_is_public', false ) == '1';
}

function is_unlisted() {
    return is_public() && (bool) get_option( 'boots_editor_hash_slug_option', false );
}

// A REST listing would reveal every unlisted URL, so only public, listed pages are open.
function rest_reads_require_auth() {
    return ! is_public() || is_unlisted();
}

function current_user_can_read_rest() {
    return ! rest_reads_require_auth() || current_user_can( 'edit_'.XCLSR_BTSTRP_POST_TYPE.'s' );
}

function rest_read_permission_error() {
    if ( current_user_can_read_rest() ) {
        return null;
    }

    return new \WP_Error(
        'rest_forbidden',
        'Sorry, you are not allowed to view these pages.',
        array( 'status' => rest_authorization_required_code() )
    );
}

function add_excelsior_bootstrap_post_type() {

    $is_public      = is_public();

    $searchability  = get_option( 'boots_editor_is_searchable', false );
    $is_searchable  = ( $searchability == '1' ) && ! is_unlisted();

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
        'rest_controller_class' => __NAMESPACE__.'\\REST_Posts_Controller',
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
        'sanitize_callback' => __NAMESPACE__.'\\sanitize_course_number_meta',
        'auth_callback' => __NAMESPACE__.'\\can_edit_post_meta',
    ) );

    \register_post_meta( XCLSR_BTSTRP_POST_TYPE, XCLSR_BTSTRP_POST_TYPE.'_post_page_title', array(
        'type' => 'string',
        'show_in_rest' => true,
        'single' => true,
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => __NAMESPACE__.'\\can_edit_post_meta',
    ) );

    \register_post_meta( XCLSR_BTSTRP_POST_TYPE, XCLSR_BTSTRP_POST_TYPE.'_post_year', array(
        'type' => 'string',
        'show_in_rest' => true,
        'single' => true,
        'default' => '',
        'sanitize_callback' => __NAMESPACE__.'\\sanitize_year_meta',
        'auth_callback' => __NAMESPACE__.'\\can_edit_post_meta',
    ) );
}

add_action( 'init', __NAMESPACE__.'\\add_excelsior_bootstrap_post_type' );

function can_edit_post_meta( $allowed, $meta_key, $post_id ) {
    return current_user_can( 'edit_post', $post_id );
}

// Mirrors formatCourseNumber() in the editor: no whitespace, uppercase.
function sanitize_course_number_meta( $value ) {
    return strtoupper( preg_replace( '/\s+/', '', sanitize_text_field( (string) $value ) ) );
}

function sanitize_year_meta( $value ) {
    $value = trim( (string) $value );

    if ( preg_match( '/^\d{4}$/', $value ) && (int) $value >= 2000 && (int) $value <= 2100 ) {
        return $value;
    }

    return '';
}

function get_excelsior_bootstrap_capabilities() {
    $type = XCLSR_BTSTRP_POST_TYPE.'s';

    return array(
        'delete_'.$type,
        'edit_'.$type,
        'edit_others_'.$type,
        'publish_'.$type,
        'read_private_'.$type,
        'delete_private_'.$type,
        'delete_published_'.$type,
        'delete_others_'.$type,
        'edit_private_'.$type,
        'edit_published_'.$type,
    );
}

/*
  Assign custom capabilities (defined during post type registration)
  to the administrator role
*/
function add_excelsior_bootstrap_capabilities() {
    $roles = array( 'administrator' );

    foreach ( $roles as $role_name ) {

        $role = \get_role($role_name );

        if ( !$role ) continue;

        foreach ( get_excelsior_bootstrap_capabilities() as $cap ) {
            $role->add_cap( $cap );
        }

    }
}

// Covers sites updated without reactivation and subsites of a network activation.
function maybe_upgrade_capabilities() {
    if ( get_option( 'boots_editor_caps_version' ) === XCLSR_BTSTRP_CAPS_VERSION ) {
        return;
    }

    add_excelsior_bootstrap_capabilities();
    update_option( 'boots_editor_caps_version', XCLSR_BTSTRP_CAPS_VERSION );
    schedule_rewrite_flush();
}

add_action( 'admin_init', __NAMESPACE__.'\\maybe_upgrade_capabilities' );

function on_activation() {
    add_excelsior_bootstrap_post_type();
    add_excelsior_bootstrap_capabilities();
    update_option( 'boots_editor_caps_version', XCLSR_BTSTRP_CAPS_VERSION );
    flush_rewrite_rules();
}

// Capabilities are kept so a temporary deactivation does not remove access; uninstall.php removes them.
function on_deactivation() {
    unregister_post_type( XCLSR_BTSTRP_POST_TYPE );
    flush_rewrite_rules();
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
 * - Generates a random 32-character hex slug for new posts or posts without a slug.
 * - Hashed slugs cannot be replaced, apart from WordPress's `__trashed` suffix.
 * - Readable slugs are left unchanged so shared links keep working.
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

    $is_new_post = empty( $postarr['ID'] ) || get_post_status( $postarr['ID'] ) === false;
    $stored_slug = $is_new_post ? '' : (string) get_post_field( 'post_name', $postarr['ID'], 'raw' );

    if ( $stored_slug === '' ) {
        $data['post_name'] = bin2hex( random_bytes( 16 ) );
        return $data;
    }

    $without_trash_suffix = function( $slug ) {
        return preg_replace( '/__trashed$/', '', (string) $slug );
    };

    if ( preg_match( '/^[a-f0-9]{32}(__trashed)?$/', $stored_slug ) && $without_trash_suffix( $data['post_name'] ) !== $without_trash_suffix( $stored_slug ) ) {
        $data['post_name'] = $stored_slug;
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

    $selected_course = isset( $_GET['course_number'] ) ? sanitize_text_field( wp_unslash( $_GET['course_number'] ) ) : '';
    $selected_year = isset( $_GET['year'] ) ? sanitize_text_field( wp_unslash( $_GET['year'] ) ) : '';

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
                'value'   => sanitize_text_field( wp_unslash( $_GET['course_number'] ) ),
                'compare' => '='
            );
        }

        // Filter by Year
        if ( !empty( $_GET['year'] ) ) {
            $meta_query[] = array(
                'key'     => XCLSR_BTSTRP_POST_TYPE.'_post_year',
                'value'   => sanitize_text_field( wp_unslash( $_GET['year'] ) ),
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

/*
  Returns a 404 for unlisted pages requested without their exact slug (e.g., `?p=123`,
  listings, feeds). Runs before `redirect_canonical`, which would otherwise redirect an
  ID-based request to the hashed URL. Users who can edit the page (e.g., previews) are exempt.
*/
function enforce_unlisted_urls() {
    if ( ! is_unlisted() ) {
        return;
    }

    global $wp_query;

    $requested_post_types = (array) $wp_query->get( 'post_type' );

    if ( ! is_singular( XCLSR_BTSTRP_POST_TYPE ) && ! in_array( XCLSR_BTSTRP_POST_TYPE, $requested_post_types, true ) ) {
        return;
    }

    if ( is_singular( XCLSR_BTSTRP_POST_TYPE ) && ! is_feed() ) {
        $post = get_queried_object();

        if ( $post instanceof \WP_Post ) {
            if ( current_user_can( 'edit_post', $post->ID ) ) {
                return;
            }

            $requested_slug = sanitize_title_for_query( (string) $wp_query->get( 'name' ) );

            if ( $requested_slug !== '' && $requested_slug === $post->post_name ) {
                return;
            }
        }
    }

    $wp_query->set_404();
    status_header( 404 );
    nocache_headers();
    remove_action( 'template_redirect', 'redirect_canonical' );
}

add_action( 'template_redirect', __NAMESPACE__.'\\enforce_unlisted_urls', 0 );

// These links and headers reveal post IDs or neighboring pages.
function remove_identifying_head_links() {
    if ( ! is_singular( XCLSR_BTSTRP_POST_TYPE ) ) {
        return;
    }

    remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10 );
    remove_action( 'wp_head', 'wp_shortlink_wp_head', 10 );
    remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );
    remove_action( 'template_redirect', 'wp_shortlink_header', 11 );
    remove_action( 'template_redirect', 'rest_output_link_header', 11 );
}

add_action( 'template_redirect', __NAMESPACE__.'\\remove_identifying_head_links', 1 );

function exclude_unlisted_from_sitemaps( $post_types ) {
    if ( is_unlisted() ) {
        unset( $post_types[ XCLSR_BTSTRP_POST_TYPE ] );
    }

    return $post_types;
}

add_filter( 'wp_sitemaps_post_types', __NAMESPACE__.'\\exclude_unlisted_from_sitemaps' );

function exclude_from_rest_search( $query_args ) {
    if ( current_user_can_read_rest() ) {
        return $query_args;
    }

    $post_types = array_values( array_diff( (array) $query_args['post_type'], array( XCLSR_BTSTRP_POST_TYPE ) ) );

    if ( empty( $post_types ) ) {
        $query_args['post__in'] = array( 0 );
    } else {
        $query_args['post_type'] = $post_types;
    }

    return $query_args;
}

add_filter( 'rest_post_search_query', __NAMESPACE__.'\\exclude_from_rest_search' );

// Stops /wp/v2/users from listing authors only because they published pages.
function exclude_from_rest_author_listing( $prepared_args ) {
    if ( current_user_can_read_rest() || empty( $prepared_args['has_published_posts'] ) || ! is_array( $prepared_args['has_published_posts'] ) ) {
        return $prepared_args;
    }

    $post_types = array_values( array_diff( $prepared_args['has_published_posts'], array( XCLSR_BTSTRP_POST_TYPE ) ) );

    if ( ! empty( $post_types ) ) {
        $prepared_args['has_published_posts'] = $post_types;
    }

    return $prepared_args;
}

add_filter( 'rest_user_query', __NAMESPACE__.'\\exclude_from_rest_author_listing' );
?>