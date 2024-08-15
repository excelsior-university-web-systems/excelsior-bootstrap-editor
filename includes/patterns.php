<?php

function register_patterns() {

    $screen = get_current_screen();

    if ( $screen && $screen->post_type === 'excelsior_bootstrap' ) {

        // Unregister all block patterns
        $patterns = WP_Block_Patterns_Registry::get_instance()->get_all_registered();

        foreach ( $patterns as $pattern_name => $pattern ) {
            unregister_block_pattern( $pattern_name );
        }

        // Register pattern category for Excelsior Bootstrap
        register_block_pattern_category(
            'excelsior-bootstrap-patterns',
            array( 'label' => __( 'Excelsior Bootstrap', 'excelsior_bootstrap' ) )
        );

        // Register your custom pattern
        register_homepage_pattern();

    }

}

add_action( 'current_screen', 'register_patterns' );

function register_homepage_pattern() {
    $pattern_content = '
    <!-- wp:excelsior-bootstrap/image-banner /-->

    <!-- wp:excelsior-bootstrap/horizontal-rule -->
    <hr class="wp-block-excelsior-bootstrap-horizontal-rule decorative bi bi-house-door-fill large" role="presentation"/>
    <!-- /wp:excelsior-bootstrap/horizontal-rule -->

    <!-- wp:excelsior-bootstrap/homepage-content -->
    <div class="wp-block-excelsior-bootstrap-homepage-content homepage-content clearfix"><!-- wp:heading -->
        <h2 class="wp-block-heading">Welcome to [Course Title]!</h2>
        <!-- /wp:heading -->

        <!-- wp:excelsior-bootstrap/iframe-embed {"className":"float-md-end ms-0 ms-md-3 mb-3 mb-md-0 ratio ratio-16x9 ratio-md-0"} -->
        <div class="wp-block-excelsior-bootstrap-iframe-embed float-md-end ms-0 ms-md-3 mb-3 mb-md-0 ratio ratio-16x9 ratio-md-0"></div>
        <!-- /wp:excelsior-bootstrap/iframe-embed -->

        <!-- wp:paragraph -->
        <p>[This course explores big data\'s impact on industries through the Internet of Things (IoT). Students study industry strategies for leveraging data in decision-making, and they learn to design data visualizations through processes like data modeling, processing (aggregation, filtering), mapping data to graphical attributes, and strategic visual encoding based on visual perception properties and the task(s) at hand.]</p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph -->
        <p>To access your course materials, select the Modules option from the navigation menu.</p>
        <!-- /wp:paragraph -->

        <!-- wp:excelsior-bootstrap/buttons {"className":"mb-0"} -->
        <p class="wp-block-excelsior-bootstrap-buttons mb-0">
            <!-- wp:excelsior-bootstrap/button {"text":"\u003ci class=\u0022bi bi-person-fill\u0022 role=\u0022presentation\u0022 aria-hidden=\u0022true\u0022\u003e\u0026nbsp;\u003c/i\u003e Your Instructor and Peers"} -->
            <a class="wp-block-excelsior-bootstrap-button btn btn-internal" href="#"><i class="bi bi-person-fill" role="presentation" aria-hidden="true">&nbsp;</i> Your Instructor and Peers</a>
            <!-- /wp:excelsior-bootstrap/button -->
        </p>
        <!-- /wp:excelsior-bootstrap/buttons -->

    </div>
    <!-- /wp:excelsior-bootstrap/homepage-content -->

    <!-- wp:excelsior-bootstrap/start-here-banner -->
    <div class="wp-block-excelsior-bootstrap-start-here-banner start-here-banner">
        <!-- wp:heading {"level":3} -->
        <h3 class="wp-block-heading">Ready to get started?</h3>
        <!-- /wp:heading -->

        <!-- wp:paragraph -->
        <p>Before diving into the course and starting your exploration of the contents, visit the Getting Started icon to review course essentials (use of Canvas, Policies, and Support Resources), plan for success in the course, and introduce yourself.</p>
        <!-- /wp:paragraph -->

        <!-- wp:excelsior-bootstrap/buttons {"className":"mb-0"} -->
        <p class="wp-block-excelsior-bootstrap-buttons mb-0">
            <!-- wp:excelsior-bootstrap/button {"text":"Start Here","className":"btn-start-here btn-lg"} -->
            <a class="wp-block-excelsior-bootstrap-button btn btn-internal btn-start-here btn-lg" href="#">Start Here</a>
            <!-- /wp:excelsior-bootstrap/button -->
        </p>
        <!-- /wp:excelsior-bootstrap/buttons -->

    </div>
    <!-- /wp:excelsior-bootstrap/start-here-banner -->
    ';

    // Register the pattern
    register_block_pattern(
        'excelsior_bootstrap/homepage',
        array(
            'title'       => __( 'Homepage', 'excelsior_bootstrap' ),
            'content'     => trim( $pattern_content ),
            'categories'  => array( 'excelsior-bootstrap-patterns' ),
        )
    );
}
