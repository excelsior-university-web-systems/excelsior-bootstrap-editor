<?php
/**
 * Plugin Name: Excelsior Bootstrap Editor
 * Plugin URI:  https://github.com/excelsior-university-web-systems/excelsior-bootstrap-editor
 * Description: Excelsior Bootstrap Editor enhances the editing experience by providing blocks specifically designed for Excelsior Bootstrap-based content.
 * Author:      Ethan Lin
 * Author URI:  https://profiles.wordpress.org/eslin87/
 * Version:     1.0.17
 * License:     GPLv2 or later
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'includes/post-type.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/blocks.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/patterns.php';