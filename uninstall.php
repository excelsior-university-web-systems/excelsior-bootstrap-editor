<?php
// Pages and their meta are intentionally kept so course content is not lost.
namespace ExcelsiorBootstrapEditor;

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'includes/constants.php';

function uninstall_site() {
    $type = XCLSR_BTSTRP_POST_TYPE.'s';
    // 'read' is a core capability and is intentionally not removed.
    $capabilities = array(
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

    // Every role, in case the capabilities were delegated beyond administrators.
    foreach ( wp_roles()->role_objects as $role ) {
        foreach ( $capabilities as $cap ) {
            if ( $role->has_cap( $cap ) ) {
                $role->remove_cap( $cap );
            }
        }
    }

    $options = array(
        'boots_editor_is_public',
        'boots_editor_hash_slug_option',
        'boots_editor_is_searchable',
        'boots_editor_show_wp_admin_bar',
        'boots_editor_allow_global_styles',
        'boots_editor_allowed_styles_scripts',
        'boots_editor_flush_rewrite',
        'boots_editor_caps_version',
    );

    foreach ( $options as $option ) {
        delete_option( $option );
    }

    delete_option( 'rewrite_rules' );
}

if ( is_multisite() ) {
    foreach ( get_sites( array( 'fields' => 'ids', 'number' => 0 ) ) as $site_id ) {
        switch_to_blog( $site_id );
        uninstall_site();
        restore_current_blog();
    }
} else {
    uninstall_site();
}
