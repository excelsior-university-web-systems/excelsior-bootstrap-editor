<?php
/**
 * Plugin Name: Excelsior Bootstrap Editor
 * Description: Excelsior Bootstrap Editor enhances the editing experience by providing blocks specifically designed for Excelsior Bootstrap-based content.
 * Version: 1.0.0
 * Author: Ethan Lin
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

require_once plugin_dir_path( __FILE__ ) . 'includes/post-type.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/blocks.php';
