<?php
namespace ExcelsiorBootstrapEditor;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'constants.php';

function add_learning_path_taxonomy() {
    $labels = array(
        'name'                       => 'Learning Path Versions',
        'singular_name'              => 'Learning Path Version',
        'search_items'               => 'Search Learning Path Versions',
        'popular_items'              => 'Popular Learning Path Versions',
        'all_items'                  => 'All Learning Path Versions',
        'edit_item'                  => 'Edit Learning Path Version',
        'update_item'                => 'Update Learning Path Version',
        'add_new_item'               => 'Add New Learning Path Version',
        'new_item_name'              => 'New Learning Path Version Number',
        'separate_items_with_commas' => 'Separate learning path versions with commas',
        'add_or_remove_items'        => 'Add or remove learning path versions',
        'choose_from_most_used'      => 'Choose from the most used learning path versions',
        'not_found'                  => 'No learning path versions found',
        'menu_name'                  => 'Learning Path Versions',
    );

    \register_taxonomy(
        XCLSR_BTSTRP_LEARNING_PATH_TAXONOMY,
        XCLSR_BTSTRP_POST_TYPE,
        array(
            'labels'            => $labels,
            'public'            => false,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_nav_menus' => false,
            'show_tagcloud'     => false,
            'show_in_rest'      => true,
            'hierarchical'      => false,
            'meta_box_cb'       => false,
            'capabilities'      => array(
                'manage_terms' => 'edit_others_' . XCLSR_BTSTRP_POST_TYPE . 's',
                'edit_terms'   => 'edit_others_' . XCLSR_BTSTRP_POST_TYPE . 's',
                'delete_terms' => 'edit_others_' . XCLSR_BTSTRP_POST_TYPE . 's',
                'assign_terms' => 'edit_others_' . XCLSR_BTSTRP_POST_TYPE . 's',
            ),
        )
    );
}

add_action( 'init', __NAMESPACE__ . '\\add_learning_path_taxonomy' );

function limit_learning_path_to_one_term( $object_id, $terms, $tt_ids, $taxonomy ) {
    static $is_enforcing = false;

    if ( $is_enforcing || $taxonomy !== XCLSR_BTSTRP_LEARNING_PATH_TAXONOMY ) {
        return;
    }

    if ( get_post_type( $object_id ) !== XCLSR_BTSTRP_POST_TYPE ) {
        return;
    }

    $assigned_terms = get_the_terms( $object_id, XCLSR_BTSTRP_LEARNING_PATH_TAXONOMY );

    if ( is_wp_error( $assigned_terms ) || empty( $assigned_terms ) || count( $assigned_terms ) <= 1 ) {
        return;
    }

    $term_to_keep = null;

    if ( ! empty( $tt_ids ) ) {
        $term_to_keep = get_term_by( 'term_taxonomy_id', (int) reset( $tt_ids ), XCLSR_BTSTRP_LEARNING_PATH_TAXONOMY );
    }

    if ( ! $term_to_keep || is_wp_error( $term_to_keep ) ) {
        $term_to_keep = reset( $assigned_terms );
    }

    $is_enforcing = true;
    wp_set_object_terms( $object_id, (int) $term_to_keep->term_id, XCLSR_BTSTRP_LEARNING_PATH_TAXONOMY, false );
    $is_enforcing = false;
}

add_action( 'set_object_terms', __NAMESPACE__ . '\\limit_learning_path_to_one_term', 10, 4 );
