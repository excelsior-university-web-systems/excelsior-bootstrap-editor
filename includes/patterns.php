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

        // Register pattern category for Excelsior Bootstrap (deprecated)
        register_block_pattern_category(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns-deprecated',
            array( 'label' => __( XCLSR_BTSTRP_LABEL . ' (DEPRECATED)', XCLSR_BTSTRP_POST_TYPE ) )
        );

        // Register pattern category for Excelsior Bootstrap (new)
        register_block_pattern_category(
            XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns-new',
            array( 'label' => __( XCLSR_BTSTRP_LABEL . ' (NEW)', XCLSR_BTSTRP_POST_TYPE ) )
        );

        // Register deprecated patterns
        $deprecatedPatternsDirectory = plugin_dir_path( __FILE__ ) . 'patterns/deprecated/';
        $excelsiorEditorDeprecatedPatterns = array(
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

        foreach ( $excelsiorEditorDeprecatedPatterns as $pattern ) {

            register_block_pattern(
                XCLSR_BTSTRP_EDITOR_PREFIX.'/'.$pattern['slug'],
                array(
                    'title'      => __( $pattern['title'], XCLSR_BTSTRP_POST_TYPE ),
                    'categories' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns-deprecated' ),
                    'postTypes'  => array( XCLSR_BTSTRP_POST_TYPE ),
                    'blockTypes' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'/container' ),
                    'filePath'   => $deprecatedPatternsDirectory.$pattern['file']
                )
            );

        }

        // Register new patterns
        $newPatternsDirectory = plugin_dir_path( __FILE__ ) . 'patterns/new/';
        $excelsiorEditorNewPatterns = array(
            array( 'slug' => 'new-homepage', 'title' => 'Homepage', 'file' => 'home.html' ),
            array( 'slug' => 'new-overview', 'title' => 'Overview', 'file' => 'overview.html' ),
            array( 'slug' => 'new-lesson', 'title' => 'Lesson', 'file' => 'lesson.html' ),
            array( 'slug' => 'new-discussion', 'title' => 'Discussion', 'file' => 'discussion.html' ),
            array( 'slug' => 'new-fivetabdiscussion', 'title' => '5-Tab Discussion', 'file' => '5-tab-discussion.html' ),
            array( 'slug' => 'new-assignment', 'title' => 'Assignment', 'file' => 'assignment.html' ),
            array( 'slug' => 'new-fivetabassignment', 'title' => '5-Tab Assignment', 'file' => '5-tab-assignment.html' ),
            array( 'slug' => 'new-livesession', 'title' => 'Live Session', 'file' => 'live-session.html' ),
            array( 'slug' => 'new-quizknowledgecheck', 'title' => 'Quiz / Knowledge Check', 'file' => 'quiz-knowledge-check.html' ),
            array( 'slug' => 'new-modulereflection', 'title' => 'Module Reflection', 'file' => 'module-reflection.html' ),
            array( 'slug' => 'new-instructornotes', 'title' => 'Instructor Notes', 'file' => 'instructor-notes.html' )
        );

        foreach ( $excelsiorEditorNewPatterns as $pattern ) {

            register_block_pattern(
                XCLSR_BTSTRP_EDITOR_PREFIX.'/'.$pattern['slug'],
                array(
                    'title'      => __( $pattern['title'], XCLSR_BTSTRP_POST_TYPE ),
                    'categories' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns-new' ),
                    'postTypes'  => array( XCLSR_BTSTRP_POST_TYPE ),
                    'blockTypes' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'/container' ),
                    'filePath'   => $newPatternsDirectory.$pattern['file']
                )
            );

        }

    }

} );
