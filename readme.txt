=== Excelsior Bootstrap ===
Contributors: eslin87
Tags: bootstrap, css, js, editor, block
Requires at least: 6.0
Requires PHP: 8.0
Tested up to: 7.1
Stable tag: 1.3.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A WordPress plugin that provides custom blocks for creating Excelsior Bootstrap content pages.

== Description ==

Excelsior Bootstrap enhances the block editor by providing custom blocks and patterns specifically designed for creating Excelsior Bootstrap–based content.

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

= 1.3.0 (2026-08-26) =
* NEW - Definitions block. Create a collection of key terms and their corresponding definitions.
* NEW - Key Terms and Definition template
* NEW - `alphabet-uppercase` icon is now available and is used as the page type icon for the Key Terms and Definitions page.
* NEW - Media Embed block. Instead of using the iFrame Embed block to enter a raw HTML embed code, the Media Embed block makes it easier to insert media just by pasting a source: a YouTube link, an Excelsior player (Storybook+, generic video player, or audio player) or .xml URL, or a network/SMB file path. The media type is detected automatically and the correct embed code is applied. Embeds are responsive by default, with optional fixed width/height and min/max size controls.
* NEW - Image block in Image and Text block now support the option to place the floated image before or after the text content on devices with narrow screens.
* NEW - Cards block now has an aspect ratio constraint. The default aspect ratio is 16:9. A setting option is also available to change the aspect ratio.
* NEW - Required Resources block. Create a collection of required resources including context.
* NEW - Add learning path taxonomy support. Also add a Learning Path Version selector to the editor sidebar.
* Update block icons for accordion, accordion item, tabs, and tab. Block editor only. No effects on Excelsior Bootstrap framework.
* Remove most of WordPress classes when get the HTML code.
* Rename "Get Code" button texts to "Get HTML Code".
* Add created and updated timestamp and learning path version in the HTML retrieved by the "Get HTML Code" button.
* Add a loading state to "Get HTML Code" button. When user click the button, the button texts will be changed to "Retrieving code..." and be disabled. Button texts will revert back to "Get HTML Code" after the HTML code modal is closed.
* Update the Homepage template to use the new Media Embed block instead of iFrame Embed block.
* Prevent line breaks in several one-line RichText fields (stop `Enter` and `Shift + Enter` from inserting newlines).


= 1.2.3 (2026-07-22) =
* Allow the equation block from Glyphwell - Visual Equation Editor plugin.

= 1.2.2 (2026-07-15) =
* Allow equation block from Equation Editor plugin.
* Default accordions to open state on page load.

= 1.2.1 (2026-06-17) =
* Revert restrictions placed on the accordions block.
* Added source URL setting option to the image block.
* Updated new Excelsior Bootstrap templates.
* Updated icons for the horizontal rule block and icon library.
* Removed "Supplemental" style for callout block.

= 1.2.0 (2026-06-10) =
* Renamed plugin to Excelsior Bootstrap (removing the "Editor" from title).
* Updated horizontal rule block with new page type icons and remove other styles; deprecated existing icons.
* Made the button block to add blue buttons only.
* Deprecated all color options except Light for the Cards block.
* Cards block now enforces minimum of two cards.
* Cards block now disallow nesting of callout, tip box, code block, task group, and blockquote blocks.
* Tabs block now enforces minimum of two tabs.
* Tabs block now disallow nesting of horizontal rule and accordion blocks.
* Accordion block is now open by default and enforces minimal of 2 accordion items.
* Accordion block now disallow nesting of horizontal rule and tabs blocks.
* Callout block now disallow nesting of buttons, code block, task group, and iframe embed.
* Callout block now pre-fills the heading based on the selected style.
* Mark columns and tip box blocks as deprecated.
* Mark collapsible block's style as deprecated.
* Mark Quote style as deprecated for Callout block.
* Added Supplemental style placeholder in Callout block.
* Added the new Info Box block (tip box block replacement).
* Added new icons and deprecated many icons.
* Heading block no longer has options to change the text color.
* Added soft character limit and warning to image block alt and caption.
* Fixed an issue with code block not preview the syntax highlighting preview in the block editor.

= 1.1.4 (2026-05-27) =
* Updated Excelsior Bootstrap framework to version 1.1.15
* Allow the insert WordPress patterns

= 1.1.3 (2026-05-13) =
* Added core/group as allowed parent
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