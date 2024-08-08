<?php
/**
 * Plugin Name: Excelsior Bootstrap Editor
 * Description: A plugin to create page contents with Excelsior Bootstrap.
 * Version: 1.0.0
 * Author: Ethan Lin
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

require_once plugin_dir_path( __FILE__ ) . 'includes/post-type.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/blocks.php';
