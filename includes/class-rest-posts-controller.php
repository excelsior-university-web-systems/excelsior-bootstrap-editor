<?php
namespace ExcelsiorBootstrapEditor;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'constants.php';

/*
  Core lets anyone read published posts over REST even when the post type is not public.
  Require the edit capability unless pages are public and not unlisted.
*/
class REST_Posts_Controller extends \WP_REST_Posts_Controller {

    public function get_items_permissions_check( $request ) {
        $error = rest_read_permission_error();

        if ( $error ) {
            return $error;
        }

        return parent::get_items_permissions_check( $request );
    }

    public function get_item_permissions_check( $request ) {
        $error = rest_read_permission_error();

        if ( $error ) {
            return $error;
        }

        return parent::get_item_permissions_check( $request );
    }

}
