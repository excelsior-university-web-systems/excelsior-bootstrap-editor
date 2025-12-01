<?php
namespace ExcelsiorBootstrapEditor;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'constants.php';

add_action( 'current_screen', function() {

    $screen = get_current_screen();

    if ( $screen && $screen->post_type === XCLSR_BTSTRP_POST_TYPE ) {

        // Remove built-in core block patterns
		remove_theme_support( 'core-block-patterns' );
		add_filter( 'should_load_remote_block_patterns', '__return_false' );

        // Register pattern category for Excelsior Bootstrap - Online
        register_block_pattern_category(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns',
            array( 'label' => __( XCLSR_BTSTRP_LABEL, XCLSR_BTSTRP_POST_TYPE ) )
        );

        // Register patterns
        $patternDirectory = plugin_dir_path( __FILE__ ) . 'patterns/';
        $excelsiorEditorOnlinePatterns = array(
            array( 'slug' => 'homepage', 'title' => 'Homepage', 'file' => 'home.html' ),
            array( 'slug' => 'overview', 'title' => 'Overview', 'file' => 'overview.html' ),
            array( 'slug' => 'lesson', 'title' => 'Lesson', 'file' => 'lesson.html' ),
            array( 'slug' => 'discussion', 'title' => 'Discussion', 'file' => 'discussion.html' ),
            array( 'slug' => 'fivetabdiscussion', 'title' => '5-Tab Discussion', 'file' => '5-tab-discussion.html' ),
            array( 'slug' => 'assignment', 'title' => 'Assignment', 'file' => 'assignment.html' ),
            array( 'slug' => 'fivetabassignment', 'title' => '5-Tab Assignment', 'file' => '5-tab-assignment.html' ),
            array( 'slug' => 'livesession', 'title' => 'Live Session', 'file' => 'live-session.html' ),
            array( 'slug' => 'quizknowledgecheck', 'title' => 'Quiz / Knowledge Check', 'file' => 'quiz-knowledge-check.html' ),
            array( 'slug' => 'modulereflection', 'title' => 'Module Reflection', 'file' => 'module-reflection.html' ),
            array( 'slug' => 'instructornotes', 'title' => 'Instructor Notes', 'file' => 'instructor-notes.html' )
        );

        foreach ( $excelsiorEditorOnlinePatterns as $pattern ) {

            register_block_pattern(
                XCLSR_BTSTRP_EDITOR_PREFIX.'/'.$pattern['slug'],
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
