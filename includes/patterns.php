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
            array( 'slug' => 'homepage', 'title' => 'Homepage', 'file' => 'online-home.html' ),
            array( 'slug' => 'overview', 'title' => 'Overview', 'file' => 'online-overview.html' ),
            array( 'slug' => 'lesson', 'title' => 'Lesson', 'file' => 'online-lesson.html' ),
            array( 'slug' => 'lessonwithcards', 'title' => 'Lesson with Cards', 'file' => 'online-lesson-with-cards.html' ),
            array( 'slug' => 'lessonwithmedia', 'title' => 'Lesson with Media', 'file' => 'online-lesson-with-media.html' ),
            array( 'slug' => 'discussion', 'title' => 'Discussion', 'file' => 'online-discussion.html' ),
            array( 'slug' => 'assignment', 'title' => 'Assignment', 'file' => 'online-assignment.html' ),
            array( 'slug' => 'livesession', 'title' => 'Live Session', 'file' => 'online-live-session.html' ),
            array( 'slug' => 'quizknowledgecheck', 'title' => 'Quiz / Knowledge Check', 'file' => 'online-quiz-knowledge-check.html' ),
            array( 'slug' => 'modulereflection', 'title' => 'Module Reflection', 'file' => 'online-module-reflection.html' ),
            array( 'slug' => 'instructornotes', 'title' => 'Instructor Notes', 'file' => 'online-instructor-notes.html' )
        );

        // $excelsiorEditorHybridPatterns = array(
        //     array( 'slug' => 'hybrid-homepage', 'title' => 'Homepage (Hybrid)', 'file' => 'hybrid-home.html' ),
        //     array( 'slug' => 'hybrid-overview', 'title' => 'Overview (Hybrid)', 'file' => 'hybrid-overview.html' ),
        //     array( 'slug' => 'hybrid-lesson', 'title' => 'Lesson (Hybrid)', 'file' => 'hybrid-lesson.html' ),
        //     array( 'slug' => 'hybrid-lessonwithcards', 'title' => 'Lesson with Cards (Hybrid)', 'file' => 'hybrid-lesson-with-cards.html' ),
        //     array( 'slug' => 'hybrid-lessonwithmedia', 'title' => 'Lesson with Media (Hybrid)', 'file' => 'hybrid-lesson-with-media.html' ),
        //     array( 'slug' => 'hybrid-discussion', 'title' => 'Discussion (Hybrid)', 'file' => 'hybrid-discussion.html' ),
        //     array( 'slug' => 'hybrid-discussion-check-in', 'title' => 'Discussion Check-In (Hybrid)', 'file' => 'hybrid-discussion-check-in.html' ),
        //     array( 'slug' => 'hybrid-discussion-help', 'title' => 'Discussion Course Help (Hybrid)', 'file' => 'hybrid-discussion-help.html' ),
        //     array( 'slug' => 'hybrid-assignment', 'title' => 'Assignment (Hybrid)', 'file' => 'hybrid-assignment.html' ),
        //     array( 'slug' => 'hybrid-quizknowledgecheck', 'title' => 'Quiz / Knowledge Check (Hybrid)', 'file' => 'hybrid-quiz-knowledge-check.html' ),
        //     array( 'slug' => 'hybrid-modulereflection', 'title' => 'Module Reflection / Key Takeaways (Hybrid)', 'file' => 'hybrid-module-reflection.html' ),
        //     array( 'slug' => 'hybrid-instructornotes', 'title' => 'Instructor Notes (Hybrid)', 'file' => 'hybrid-instructor-notes.html' ),
        //     array( 'slug' => 'hybrid-session-sign-up', 'title' => 'Session Sign Up (Hybrid)', 'file' => 'hybrid-session-sign-up.html' ),
        //     array( 'slug' => 'hybrid-session', 'title' => 'Session (Hybrid)', 'file' => 'hybrid-session.html' ),
        //     array( 'slug' => 'hybrid-presentation-symposium', 'title' => 'Presentation Symposium (Hybrid)', 'file' => 'hybrid-presentation-symposium.html' )
        // );

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

        // foreach ( $excelsiorEditorHybridPatterns as $pattern ) {

        //     register_block_pattern(
        //         XCLSR_BTSTRP_EDITOR_PREFIX.'/'.$pattern['slug'],
        //         array(
        //             'title'      => __( $pattern['title'], XCLSR_BTSTRP_POST_TYPE ),
        //             'categories' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-hybrid-patterns' ),
        //             'postTypes'  => array( XCLSR_BTSTRP_POST_TYPE ),
        //             'blockTypes' => array( XCLSR_BTSTRP_EDITOR_PREFIX.'/container' ),
        //             'filePath'   => $patternDirectory.$pattern['file'],
        //             'viewportWidth' => 1042
        //         )
        //     );

        // }

    }

} );
