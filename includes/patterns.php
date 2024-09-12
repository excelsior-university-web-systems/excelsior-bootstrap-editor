<?php
namespace ExcelsiorBootstrapEditor;
require_once plugin_dir_path( __FILE__ ) . 'constants.php';

add_action( 'current_screen', function() {

    $screen = get_current_screen();

    if ( $screen && $screen->post_type === XCLSR_BTSTRP_POST_TYPE ) {

        // Unregister all block patterns
        $patterns = \WP_Block_Patterns_Registry::get_instance()->get_all_registered();

        foreach ( $patterns as $pattern_name => $pattern ) {
            unregister_block_pattern( $pattern_name );
        }

        // Register pattern category for Excelsior Bootstrap
        register_block_pattern_category(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns',
            array( 'label' => __( XCLSR_BTSTRP_LABEL, XCLSR_BTSTRP_POST_TYPE ) )
        );

        // Register patterns
        $patternDirectory = plugin_dir_path( __FILE__ ) . 'patterns/';
        $excelsiorEditorPatterns = array(
            array( 'slug' => '/homepage', 'title' => 'Homepage', 'file' => 'home.html' ),
            array( 'slug' => '/lesson', 'title' => 'Lesson', 'file' => 'lesson.html' ),
            array( 'slug' => '/lessonwithcards', 'title' => 'Lesson with Cards', 'file' => 'lesson-with-cards.html' ),
            array( 'slug' => '/lessonwithmedia', 'title' => 'Lesson with media', 'file' => 'lesson-with-media.html' )
        );

        foreach ( $excelsiorEditorPatterns as $pattern ) {

            register_block_pattern(
                XCLSR_BTSTRP_POST_TYPE.$pattern['slug'],
                array(
                    'title'      => __( $pattern['title'], XCLSR_BTSTRP_POST_TYPE ),
                    'categories' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns' ),
                    'postTypes'  => array( XCLSR_BTSTRP_POST_TYPE ),
                    'blockTypes' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'/container' ),
                    'filePath'   => $patternDirectory.$pattern['file']
                )
            );

        }

    }

} );