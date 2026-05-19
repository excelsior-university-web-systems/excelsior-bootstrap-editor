=== Excelsior Bootstrap Editor ===
Contributors: eslin87
Tags: bootstrap, css, js, editor, block
Requires at least: 6.0
Requires PHP: 8.0
Tested up to: 7.0
Stable tag: 1.1.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A WordPress plugin that provides custom blocks for creating Excelsior Bootstrap content pages.

== Description ==

Excelsior Bootstrap Editor enhances the block editor by providing custom blocks and patterns specifically designed for creating Excelsior Bootstrap–based content.

== Installation ==

This section describes how to install and activate the plugin.

= Requirements =

1. PHP 8.0 or higher.
2. The Gutenberg (Block) Editor enabled.

= Instructions =

1. Upload the `excelsior-bootstrap-editor` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Look for the **Excelsior Bootstrap Editor** menu item in the WordPress admin sidebar.

== Screenshots ==

1. Example Excelsior Bootstrap Editor blocks in use.

== Changelog ==

= 1.1.4 (2026-xx-xx) =
* Update Excelsior Bootstrap framework to version 1.1.15

= 1.1.3 (2026-05-13) =
* Add core/group as allowed parent
* Remove hardcoded 'Show' text from Collapsible button

= 1.1.2 (2026-05-13) =
* Allow core/group and core/spacer block.
* Conditionally register Bootstrap table variation so that regular table is still available for non-Excelsior Bootstrap context.

= 1.1.1 (2026-04-08) =
* Enabled Collapsible (Show/Hide) block support.

= 1.1.0 (2026-03-25) =
* New block for the Collapsible (Show/Hide) component (implemented but not available for use yet).
* Added new "Add an empty block" button at the end of the Content Canvas area.
* Heading size and style settings are now available outside of the Excelsior Bootstrap post type restriction.
* Unify Block Inserter Preview Handling.
* Table caption is now unhidden.

= 1.0.27 (2026-03-11) =
* Updated templates to add underlined header style to H2 headers.
* Updated homepage template to remove the "Your Instructor and Peers" button.
* Added a new icons: `check-square` and `bi-gear-fill`.
* Added the `bi-gear` (technical guide) icon to the horizontal rule block icon options.

= 1.0.26 (2026-02-11) =
* Disabled WordPress's stretchy text blocks within Excelsior Bootstrap blocks.

= 1.0.25 (2026-02-04) =
* Mobile responsive is toggled on by default for image block.
* Added `core/math` block support.
* Updated discussion pattern/template.

= 1.0.24 (2026-01-14) =
* Added new icons (`bi-lightbulb`, `bi-building-fill`, and `bi-globe`)
* Added margin bottom spacing to cards, tabs, and accordions.
* Updated instructor notes template.
* Updated Excelsior Bootstrap framework to version 1.0.14.

Previous release notes can be viewed in [CHANGELOG](CHANGELOG).