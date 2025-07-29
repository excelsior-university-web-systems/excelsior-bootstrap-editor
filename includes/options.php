<?php
namespace ExcelsiorBootstrapEditor;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'constants.php';

function register_boots_editor_settings_page() {
    add_submenu_page(
        'edit.php?post_type='.XCLSR_BTSTRP_POST_TYPE,
        'Excelsior Bootstrap Editor Settings',
        'Settings',
        'manage_options',
        XCLSR_BTSTRP_EDITOR_PREFIX.'-settings',
        __NAMESPACE__.'\\boots_editor_settings_page'
    );
}

add_action( 'admin_menu', __NAMESPACE__.'\\register_boots_editor_settings_page' );

function boots_editor_settings_page() {
    
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    ?>
    <div class="wrap">
        <h1>Excelsior Bootstrap Editor Settings</h1>
        <form action="options.php" method="post">
            <?php
                settings_errors();
                settings_fields( 'boots_editor_settings_group' );
                do_settings_sections( 'boots_editor_settings' );
                submit_button( 'Save Settings' );
            ?>
        </form>
    </div>
    <?php
}

function editor_register_settings() {
        
    /*** General ***/

    register_setting( 'boots_editor_settings_group', 'boots_editor_is_public', array(
        'type' => 'boolean',
        'sanitize_callback' => '\\rest_sanitize_boolean',
        'default' => false,
    ) );

    register_setting( 'boots_editor_settings_group', 'boots_editor_hash_slug_option', array(
        'type' => 'boolean',
        'sanitize_callback' => '\\rest_sanitize_boolean',
        'default' => false,
    ) );

    register_setting( 'boots_editor_settings_group', 'boots_editor_is_searchable', array(
        'type' => 'boolean',
        'sanitize_callback' => '\\rest_sanitize_boolean',
        'default' => false,
    ) );

    add_settings_section(
        'editor_general_section',
        'General',
        __NAMESPACE__.'\\editor_general_section',
        'boots_editor_settings'
    );

    add_settings_field(
        'boots_editor_is_public',
        'Visibility',
        __NAMESPACE__.'\\editor_is_public',
        'boots_editor_settings',
        'editor_general_section'
    );

    add_settings_field(
        'boots_editor_hash_slug_option',
        'Unlisted',
        __NAMESPACE__.'\\editor_hash_slug_option',
        'boots_editor_settings',
        'editor_general_section'
    );

    add_settings_field(
        'boots_editor_is_searchable',
        'Searchable',
        __NAMESPACE__.'\\editor_is_searchable',
        'boots_editor_settings',
        'editor_general_section'
    );

    /*** Styles and JavaScript ***/

    register_setting( 'boots_editor_settings_group', 'boots_editor_show_wp_admin_bar', array(
        'type' => 'boolean',
        'sanitize_callback' => '\\rest_sanitize_boolean',
        'default' => false,
    ) );

    register_setting( 'boots_editor_settings_group', 'boots_editor_allow_global_styles', array(
        'type' => 'boolean',
        'sanitize_callback' => '\\rest_sanitize_boolean',
        'default' => false,
    ) );

    register_setting( 'boots_editor_settings_group', 'boots_editor_allowed_styles_scripts', array(
        'type' => 'string',
        'sanitize_callback' => __NAMESPACE__.'\\editor_sanitize_styles_scripts',
        'default' => ''
    ) );

    add_settings_section(
        'editor_styles_scripts',
        'Styles and Scripts',
        __NAMESPACE__.'\\editor_styles_scripts_section',
        'boots_editor_settings'
    );

    add_settings_field(
        'boots_editor_show_wp_admin_bar',
        'Admin Bar',
        __NAMESPACE__.'\\editor_show_wp_admin_bar',
        'boots_editor_settings',
        'editor_styles_scripts'
    );

    add_settings_field(
        'boots_editor_allow_global_styles',
        'Global Styles',
        __NAMESPACE__.'\\editor_allow_global_styles',
        'boots_editor_settings',
        'editor_styles_scripts'
    );

    add_settings_field(
        'boots_editor_allowed_styles_scripts',
        'Handles',
        __NAMESPACE__.'\\editor_allowed_styles_scripts',
        'boots_editor_settings',
        'editor_styles_scripts'
    );
    
}

add_action( 'admin_init', __NAMESPACE__.'\\editor_register_settings' );

/*** General Setting Functions ***/

function editor_general_section() {
    echo '';
}

function editor_is_public() {
    $option = get_option( 'boots_editor_is_public', false );
    ?>
    <input id="boots_editor_is_public" type="checkbox" name="boots_editor_is_public" value="1" <?php checked( 1, $option, true ); ?> />
    <label for="boots_editor_is_public">Public</label>
    <p class="description">Display Excelsior Bootstrap pages on the front end with accessible URLs.</p>
    <?php
}

function editor_hash_slug_option() {
    $option = get_option( 'boots_editor_hash_slug_option', false );
    ?>
    <input id="boots_editor_hash_slug_option" type="checkbox" name="boots_editor_hash_slug_option" value="1" <?php checked( 1, $option, true ); ?> />
    <label for="boots_editor_hash_slug_option">Hash the last part of the URL (for Public only)</label>
    <p class="description">Ensure only users with the exact URLs can access posts.</p>
    <?php
}

function editor_is_searchable() {
    $option = get_option( 'boots_editor_is_searchable', false );
    ?>
    <input id="boots_editor_is_searchable" type="checkbox" name="boots_editor_is_searchable" value="1" <?php checked( 1, $option, true ); ?> />
    <label for="boots_editor_is_searchable">Include Excelsior Bootstrap pages in the front end search results (for Public only)</label>
    <?php
}

/*** Styles and JavaScript Section Functions ***/

function editor_styles_scripts_section() {
    ?>
    <p>Specify which registered styles and JavaScript files should be loaded for a single ReBlock post by entering their handles (unique identifiers) on separate lines.</p>

    <ul style="list-style: revert; padding: revert;">
        <li>Enter <strong>*</strong> (wildcard) to allow all registered styles and scripts.</li>

        <li>Enter one or more handles to load only the specified styles and scripts. <em>All others will be excluded.</em></li>

        <li>Leave the field <strong>empty</strong> to remove all registered styles and scripts.</li>
    </ul>

    <div style="background:#fff; border-left: 4px solid #0073aa; margin:13px 0; padding: 10px;">
        <p style="margin:0;"><strong>Note:</strong> This only applies to styles and scripts that are registered with WordPress using <code>wp_register_style()</code> and <code>wp_register_script()</code>. Any styles or scripts loaded by other means (e.g., hardcoded in the theme or loaded via external sources) are not affected by this setting.</p>
    </div>
    <?php
}

function editor_show_wp_admin_bar() {
    $option = get_option( 'boots_editor_show_wp_admin_bar', false );
    ?>
    <input id="boots_editor_show_wp_admin_bar" type="checkbox" name="boots_editor_show_wp_admin_bar" value="1" <?php checked( 1, $option, true ); ?> />
    <label for="boots_editor_show_wp_admin_bar">Show Admin Bar</label>
    <?php
}

function editor_allow_global_styles() {
    $option = get_option( 'boots_editor_allow_global_styles', false );
    ?>
    <input id="boots_editor_allow_global_styles" type="checkbox" name="boots_editor_allow_global_styles" value="1" <?php checked( 1, $option, true ); ?> />
    <label for="boots_editor_allow_global_styles">Allow WordPress global styles</label>
    <p class="description">Ensure block styling in the editor matches the front-end.</p>
    <?php
}

function editor_sanitize_styles_scripts( $input ) {
    $lines = preg_split( '/[\r\n]+/', $input );
    $lines = array_filter( array_map( 'trim', $lines ) );
    if ( in_array( '*', $lines ) ) {
        return '*';
    }
    if ( empty( $lines ) ) {
        return '';
    }
    return implode( ',', $lines );
}

function editor_allowed_styles_scripts() {
    $saved_styles = get_option( 'boots_editor_allowed_styles_scripts', '' );
    $selected_styles = str_replace( ',', "\n", $saved_styles );
    ?>
    <textarea id="boots_editor_allowed_styles_scripts" name="boots_editor_allowed_styles_scripts" rows="5" cols="50"><?php echo esc_textarea( $selected_styles ); ?></textarea>
    <?php
}

/*** ON OPTIONS UPDATE */

function editor_option_updated( $option, $old_value, $new_value ) {
    if ( 'boots_editor_hash_slug_option' === $option && $old_value !== $new_value ) {
        flush_rewrite_rules();
    }
}

add_action( 'updated_option', __NAMESPACE__.'\\editor_option_updated', 10, 3 );