<?php
namespace ExcelsiorBootstrapEditor;
require_once plugin_dir_path( __FILE__ ) . 'constants.php';

add_action( 'current_screen', function() {

    $screen = get_current_screen();

    if ( $screen && $screen->post_type === XCLSR_BTSTRP_POST_TYPE ) {

        // Remove built-in core block patterns
		remove_theme_support( 'core-block-patterns' );
		add_filter( 'should_load_remote_block_patterns', '__return_false' );

        // Register pattern category for Excelsior Bootstrap - Online
        register_block_pattern_category(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-online-patterns',
            array( 'label' => __( XCLSR_BTSTRP_LABEL.' - Online', XCLSR_BTSTRP_POST_TYPE ) )
        );

        // Register pattern category for Excelsior Bootstrap - Hybrid
        register_block_pattern_category(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-hybrid-patterns',
            array( 'label' => __( XCLSR_BTSTRP_LABEL.' - Hybrid', XCLSR_BTSTRP_POST_TYPE ) )
        );

        // Register patterns
        $patternDirectory = plugin_dir_path( __FILE__ ) . 'patterns/';
        $excelsiorEditorOnlinePatterns = array(
            array( 'slug' => 'homepage', 'title' => 'Homepage', 'file' => 'home.html' ),
            array( 'slug' => 'overview', 'title' => 'Overview', 'file' => 'overview.html' ),
            array( 'slug' => 'lesson', 'title' => 'Lesson', 'file' => 'lesson.html' ),
            array( 'slug' => 'lessonwithcards', 'title' => 'Lesson with Cards', 'file' => 'lesson-with-cards.html' ),
            array( 'slug' => 'lessonwithmedia', 'title' => 'Lesson with media', 'file' => 'lesson-with-media.html' ),
            array( 'slug' => 'discussion', 'title' => 'Discussion', 'file' => 'discussion.html' ),
            array( 'slug' => 'assignment', 'title' => 'Assignment', 'file' => 'assignment.html' ),
            array( 'slug' => 'livesession', 'title' => 'Live Session', 'file' => 'live-session.html' ),
            array( 'slug' => 'quizknowledgecheck', 'title' => 'Quiz / Knowledge Check', 'file' => 'quiz-knowledge-check.html' ),
            array( 'slug' => 'modulereflection', 'title' => 'Module Reflection', 'file' => 'module-reflection.html' )
        );

        foreach ( $excelsiorEditorOnlinePatterns as $pattern ) {

            register_block_pattern(
                XCLSR_BTSTRP_EDITOR_PREFIX.'/'.$pattern['slug'],
                array(
                    'title'      => __( $pattern['title'], XCLSR_BTSTRP_POST_TYPE ),
                    'categories' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-online-patterns' ),
                    'postTypes'  => array( XCLSR_BTSTRP_POST_TYPE ),
                    'blockTypes' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'/container' ),
                    'filePath'   => $patternDirectory.$pattern['file'],
                    'viewportWidth' => 1042
                )
            );

        }

    }

} );
