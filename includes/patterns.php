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
        \ExcelsiorBootstrapEditor\register_excelsior_bootstrap_editor_homepage_pattern();
        \ExcelsiorBootstrapEditor\register_excelsior_bootstrap_editor_lesson_pattern();
        \ExcelsiorBootstrapEditor\register_excelsior_bootstrap_editor_lesson_with_cards_pattern();
        \ExcelsiorBootstrapEditor\register_excelsior_bootstrap_editor_lesson_with_media_pattern();

    }

} );

/*
  Add a predefined layout (or block pattern) for the homepage.
*/
function register_excelsior_bootstrap_editor_homepage_pattern() {

    $pattern_content = '
    <!-- wp:excelsior-bootstrap-editor/image-banner /-->

    <!-- wp:excelsior-bootstrap-editor/horizontal-rule -->
    <hr class="wp-block-excelsior-bootstrap-editor-horizontal-rule decorative bi bi-house-door-fill large" role="presentation"/>
    <!-- /wp:excelsior-bootstrap-editor/horizontal-rule -->

    <!-- wp:excelsior-bootstrap-editor/homepage-content -->
    <div class="wp-block-excelsior-bootstrap-editor-homepage-content homepage-content clearfix"><!-- wp:heading -->
        <h2 class="wp-block-heading">Welcome to [Course Title]!</h2>
        <!-- /wp:heading -->

        <!-- wp:excelsior-bootstrap-editor/iframe-embed {"className":"float-md-end ms-0 ms-md-3 mb-3 mb-md-0 ratio ratio-16x9 ratio-md-0"} -->
        <div class="wp-block-excelsior-bootstrap-editor-iframe-embed float-md-end ms-0 ms-md-3 mb-3 mb-md-0 ratio ratio-16x9 ratio-md-0"></div>
        <!-- /wp:excelsior-bootstrap-editor/iframe-embed -->

        <!-- wp:paragraph -->
        <p>[This course explores big data\'s impact on industries through the Internet of Things (IoT). Students study industry strategies for leveraging data in decision-making, and they learn to design data visualizations through processes like data modeling, processing (aggregation, filtering), mapping data to graphical attributes, and strategic visual encoding based on visual perception properties and the task(s) at hand.]</p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph -->
        <p>To access your course materials, select the Modules option from the navigation menu.</p>
        <!-- /wp:paragraph -->

        <!-- wp:excelsior-bootstrap-editor/buttons {"className":"mb-0"} -->
        <p class="wp-block-excelsior-bootstrap-editor-buttons mb-0">
            <!-- wp:excelsior-bootstrap-editor/button {"text":"\u003ci class=\u0022bi bi-person-fill\u0022 role=\u0022presentation\u0022 aria-hidden=\u0022true\u0022\u003e\u0026nbsp;\u003c/i\u003e Your Instructor and Peers"} -->
            <a class="wp-block-excelsior-bootstrap-editor-button btn btn-internal" href="#"><i class="bi bi-person-fill" role="presentation" aria-hidden="true">&nbsp;</i> Your Instructor and Peers</a>
            <!-- /wp:excelsior-bootstrap-editor/button -->
        </p>
        <!-- /wp:excelsior-bootstrap-editor/buttons -->

    </div>
    <!-- /wp:excelsior-bootstrap-editor/homepage-content -->

    <!-- wp:excelsior-bootstrap-editor/start-here-banner -->
    <div class="wp-block-excelsior-bootstrap-editor-start-here-banner start-here-banner">
        <div class="col offset-md-5">
            <!-- wp:heading {"level":3} -->
            <h3 class="wp-block-heading">Ready to get started?</h3>
            <!-- /wp:heading -->

            <!-- wp:paragraph -->
            <p>Before diving into the course and starting your exploration of the contents, visit the Getting Started icon to review course essentials (use of Canvas, Policies, and Support Resources), plan for success in the course, and introduce yourself.</p>
            <!-- /wp:paragraph -->

            <!-- wp:excelsior-bootstrap-editor/buttons {"className":"mb-0"} -->
            <p class="wp-block-excelsior-bootstrap-editor-buttons mb-0">
                <!-- wp:excelsior-bootstrap-editor/button {"text":"Start Here","className":"btn-start-here btn-lg"} -->
                <a class="wp-block-excelsior-bootstrap-editor-button btn btn-internal btn-start-here btn-lg" href="#">Start Here</a>
                <!-- /wp:excelsior-bootstrap-editor/button -->
            </p>
            <!-- /wp:excelsior-bootstrap-editor/buttons -->
        </div>
    </div>
    <!-- /wp:excelsior-bootstrap-editor/start-here-banner -->
    ';

    // Register the pattern
    register_block_pattern(
        XCLSR_BTSTRP_POST_TYPE.'/homepage',
        array(
            'title'       => __( 'Homepage', XCLSR_BTSTRP_POST_TYPE ),
            'content'     => trim( $pattern_content ),
            'categories'  => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns' ),
            'postTypes' => array( XCLSR_BTSTRP_POST_TYPE )
        )
    );

}

/*
  Add a predefined layout (or block pattern) for the lesson page.
*/
function register_excelsior_bootstrap_editor_lesson_pattern() {

    $pattern_content = '
    <!-- wp:excelsior-bootstrap-editor/horizontal-rule {"selectedIcon":"bi-search"} -->
    <hr class="wp-block-excelsior-bootstrap-editor-horizontal-rule decorative bi bi-search large" role="presentation"/>
    <!-- /wp:excelsior-bootstrap-editor/horizontal-rule -->

    <!-- wp:paragraph -->
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat <a href="#" target="_blank" rel="noreferrer noopener">cupidatat non proident</a>, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <!-- /wp:paragraph -->

    <!-- wp:list -->
    <ul class="wp-block-list">
        <!-- wp:list-item -->
        <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
        <!-- /wp:list-item -->

        <!-- wp:list-item -->
        <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
        <!-- /wp:list-item -->
    </ul>
    <!-- /wp:list -->

    <!-- wp:heading -->
    <h2 class="wp-block-heading">Header</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph -->
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea <strong>commodo consequat</strong>. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <!-- /wp:paragraph -->

    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">Sub-Header</h3>
    <!-- /wp:heading -->

    <!-- wp:paragraph -->
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <!-- /wp:paragraph -->

    <!-- wp:excelsior-bootstrap-editor/horizontal-rule {"noIcon":true} -->
    <hr class="wp-block-excelsior-bootstrap-editor-horizontal-rule decorative" role="presentation"/>
    <!-- /wp:excelsior-bootstrap-editor/horizontal-rule -->
    ';

    // Register the pattern
    register_block_pattern(
        XCLSR_BTSTRP_POST_TYPE.'/lesson',
        array(
            'title'       => __( 'Lesson', XCLSR_BTSTRP_POST_TYPE ),
            'content'     => trim( $pattern_content ),
            'categories'  => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns' ),
            'postTypes' => array( XCLSR_BTSTRP_POST_TYPE )
        )
    );

}

/*
  Add a predefined layout (or block pattern) for the lesson page with cards.
*/
function register_excelsior_bootstrap_editor_lesson_with_cards_pattern() {

    $pattern_content = '
    <!-- wp:excelsior-bootstrap-editor/horizontal-rule {"selectedIcon":"bi-search"} -->
    <hr class="wp-block-excelsior-bootstrap-editor-horizontal-rule decorative bi bi-search large" role="presentation"/>
    <!-- /wp:excelsior-bootstrap-editor/horizontal-rule -->

    <!-- wp:heading -->
    <h2 class="wp-block-heading">[Header]</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph -->
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <!-- /wp:paragraph -->

    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">Key Concepts</h3>
    <!-- /wp:heading -->

    <!-- wp:excelsior-bootstrap-editor/cards -->
    <div class="wp-block-excelsior-bootstrap-editor-cards row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"><!-- wp:excelsior-bootstrap-editor/card {"imgUrl":""} -->
    <div class="wp-block-excelsior-bootstrap-editor-card col"><div class="card h-100"><img class="card-img-top" src="" alt="" role="presentation"/><div class="card-body"><!-- wp:heading {"level":4,"placeholder":"Card Title","className":"h5 card-title"} -->
    <h4 class="wp-block-heading h5 card-title">Concept 1</h4>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"placeholder":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.","className":"card-text"} -->
    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pharetra et ultrices neque ornare aenean.</p>
    <!-- /wp:paragraph --></div></div></div>
    <!-- /wp:excelsior-bootstrap-editor/card -->

    <!-- wp:excelsior-bootstrap-editor/card {"imgUrl":""} -->
    <div class="wp-block-excelsior-bootstrap-editor-card col"><div class="card h-100"><img class="card-img-top" src="" alt="" role="presentation"/><div class="card-body"><!-- wp:heading {"level":4,"placeholder":"Card Title","className":"h5 card-title"} -->
    <h4 class="wp-block-heading h5 card-title">Concept 2</h4>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"placeholder":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.","className":"card-text"} -->
    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pharetra et ultrices neque ornare aenean.</p>
    <!-- /wp:paragraph --></div></div></div>
    <!-- /wp:excelsior-bootstrap-editor/card -->

    <!-- wp:excelsior-bootstrap-editor/card {"imgUrl":""} -->
    <div class="wp-block-excelsior-bootstrap-editor-card col"><div class="card h-100"><img class="card-img-top" src="" alt="" role="presentation"/><div class="card-body"><!-- wp:heading {"level":4,"placeholder":"Card Title","className":"h5 card-title"} -->
    <h4 class="wp-block-heading h5 card-title">Concept 3</h4>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"placeholder":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.","className":"card-text"} -->
    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pharetra et ultrices neque ornare aenean.</p>
    <!-- /wp:paragraph --></div></div></div>
    <!-- /wp:excelsior-bootstrap-editor/card --></div>
    <!-- /wp:excelsior-bootstrap-editor/cards -->

    <!-- wp:excelsior-bootstrap-editor/horizontal-rule {"noIcon":true} -->
    <hr class="wp-block-excelsior-bootstrap-editor-horizontal-rule decorative" role="presentation"/>
    <!-- /wp:excelsior-bootstrap-editor/horizontal-rule -->
    ';

    // Register the pattern
    register_block_pattern(
        XCLSR_BTSTRP_POST_TYPE.'/lessonwithcards',
        array(
            'title'       => __( 'Lesson with Cards', XCLSR_BTSTRP_POST_TYPE ),
            'content'     => trim( $pattern_content ),
            'categories'  => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns' ),
            'postTypes' => array( XCLSR_BTSTRP_POST_TYPE )
        )
    );

}

/*
  Add a predefined layout (or block pattern) for the lesson page with media.
*/
function register_excelsior_bootstrap_editor_lesson_with_media_pattern() {

    $pattern_content = '
    <!-- wp:excelsior-bootstrap-editor/horizontal-rule {"selectedIcon":"bi-search"} -->
    <hr class="wp-block-excelsior-bootstrap-editor-horizontal-rule decorative bi bi-search large" role="presentation"/>
    <!-- /wp:excelsior-bootstrap-editor/horizontal-rule -->

    <!-- wp:paragraph -->
    <p>In this activity, you will...</p>
    <!-- /wp:paragraph -->

    <!-- wp:excelsior-bootstrap-editor/iframe-embed -->
    <div class="wp-block-excelsior-bootstrap-editor-iframe-embed"></div>
    <!-- /wp:excelsior-bootstrap-editor/iframe-embed -->

    <!-- wp:excelsior-bootstrap-editor/horizontal-rule {"noIcon":true} -->
    <hr class="wp-block-excelsior-bootstrap-editor-horizontal-rule decorative" role="presentation"/>
    <!-- /wp:excelsior-bootstrap-editor/horizontal-rule -->
    ';

    // Register the pattern
    register_block_pattern(
        XCLSR_BTSTRP_POST_TYPE.'/lessonwithmedia',
        array(
            'title'       => __( 'Lesson with Media', XCLSR_BTSTRP_POST_TYPE ),
            'content'     => trim( $pattern_content ),
            'categories'  => array( XCLSR_BTSTRP_EDITOR_PREFIX.'-patterns' ),
            'postTypes' => array( XCLSR_BTSTRP_POST_TYPE )
        )
    );

}