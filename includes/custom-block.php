<?php

function register_excelsior_bootstrap_block() {
    // Automatically load dependencies and version.
    $asset_file = include(plugin_dir_path(__FILE__) . 'build/index.asset.php');

    // Register the block editor script.
    wp_register_script(
        'excelsior-bootstrap-editor-script',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );

    // Register the block.
    register_block_type('excelsior-bootstrap/editor', array(
        'editor_script' => 'excelsior-bootstrap-editor-script',
        'render_callback' => 'render_excelsior_bootstrap_block'
    ));
}
add_action('init', 'register_excelsior_bootstrap_block');

function render_excelsior_bootstrap_block($attributes, $content) {
    return '<div id="excelsior-bootstrap"><div class="page-container">' . $content . '</div></div>';
}
