<?php
/**
 * Plugin Name: Excelsior Bootstrap
 * Plugin URI:  https://github.com/excelsior-university-web-systems/excelsior-bootstrap-editor
 * Description: Excelsior Bootstrap enhances the editing experience by providing blocks specifically designed for Excelsior Bootstrap-based content.
 * Author:      Ethan Lin
 * Author URI:  https://profiles.wordpress.org/eslin87/
 * Version:     1.2.2
 * License:     GPLv2 or later
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'includes/post-type.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/blocks.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/patterns.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/options.php';