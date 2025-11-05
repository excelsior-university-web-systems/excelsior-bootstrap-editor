# Excelsior Bootstrap Editor #
**Contributors:** [eslin87](https://profiles.wordpress.org/eslin87/)  
**Tags:** bootstrap, css, js, editor, block  
**Requires at least:** 5.0  
**Requires PHP:** 8.0  
**Tested up to:** 6.8  
**Stable tag:** 1.0.22  
**License:** GPLv2 or later  
**License URI:** https://www.gnu.org/licenses/gpl-2.0.html  

A WordPress plugin that provides custom blocks for creating Excelsior Bootstrap content pages.

## Description ##

Excelsior Bootstrap Editor enhances the block editor by providing custom blocks and patterns specifically designed for creating Excelsior Bootstrap–based content.

## Installation ##

This section describes how to install and activate the plugin.

### Requirements ###

1. PHP 8.0 or higher.
2. The Gutenberg (Block) Editor enabled.

### Instructions ###

1. Upload the `excelsior-bootstrap-editor` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Look for the **Excelsior Bootstrap Editor** menu item in the WordPress admin sidebar.

## Screenshots ##

### 1. Example Excelsior Bootstrap Editor blocks in use. ###
![Example Excelsior Bootstrap Editor blocks in use.](.wordpress-org/screenshot-1.png)


## Changelog ##

### 1.0.22 (2025-11-05) ###
* Inline code format default to none when on language is selected so that it will have Bootstrap's default inline code typography style. Note: the gray background is not part of Bootstrap but rather Canvas LMS's.
* Added 'enlargeable' option to card block images.
* New: Carousel block
* Unregistered "Footnote" format form the rich text toolbar.
* Updated Excelsior Bootstrap framework to version 1.0.13.

### 1.0.21 (2025-10-01) ###
* Added a new “Enlargeable” setting to the Image block, allowing images to expand to the full browser width.
* Fixed an issue where floated image retained it floating classes when moved to its own block.
* Updated Excelsior Bootstrap framework to version 1.0.12.

### 1.0.20 (2025-08-13) ###
* Added background color support to the Card block.

### 1.0.19 (2025-07-30) ###
* Removed download link format from the “Failed to load image” message.
* Added a settings page for configuring post visibility, searchability, slug hashing, and asset management.
* Updated post registration to use new setting options.
* Added a blank template for displaying Excelsior Bootstrap pages without additional WordPress overhead.

### 1.0.18 (2025-07-22) ###
* Fixed Image and Text block alignment when image size is set to “Actual”.
* Updated the “Failed to load image” message for clarity.
* Updated packages to the latest versions.

### 1.0.17 (2025-07-02) ###
* Reworked Blockquote block to support nested Image and Text blocks.

### 1.0.16 (2025-06-18) ###
* Disabled the back-to-top button when used in ReBlock to prevent accessibility issues with screen readers.
* Added `bi-bookmark-star` icon.
* Replaced the “play” icon with the “bookmark star” icon for the Introduction tab in the Module Overview pattern.
* Added a new option to center-align images in the Image block.
* Updated Excelsior Bootstrap framework.

### 1.0.15 (2025-05-21) ###
* Updated Excelsior Bootstrap framework (CSS and JS).

### 1.0.14 (2025-05-14) ###
* Updated Excelsior Bootstrap framework (CSS and JS).
* Added support for Blockquote block for quotations.
* Accordion items are now closed by default on page load. Added a toggle control in the editor for expanding/collapsing during editing.
* Added option to change accordion header font size.
* Minor fixes and improvements.

### 1.0.13 (2025-04-09) ###
* Removed LMS Common block from approved block list.
* Added ReBlock block to approved block list.

### 1.0.12 (2025-04-02) ###
* Fixed issue where required field notices appeared incorrectly after saving/publishing.

### 1.0.11 (2025-03-26) ###
* Added filter by course number and year.
* Moved `images` folder into the `public` folder.
* Allowed LMS Common Block inside the container.
* Allowed iFrame Embed block inside Callout and Tipbox blocks.
* Updated Instructor Notes pattern with additional content.
* Updated Discussion pattern with “Prompt Suggestions” callout in the reply tab.
* Updated language in the Home Page pattern.
* Fixed editing issue with iFrame Embed textarea.

### 1.0.10 (2025-03-12) ###
* Corrected day label: replaced Saturday with Sunday in Overview and Discussion patterns.

### 1.0.9 (2025-02-26) ###
* Added new icons.

### 1.0.8 (2025-01-22) ###
* Added three new horizontal rule styles: basic, blue, and purple (red remains default).
* Updated Excelsior Bootstrap framework.

### 1.0.7 (2025-01-15) ###
* Added new icons.
* Added hybrid course templates (not activated by default).
* Updated Instructor Notes template with reminder box.
* Fixed issue with duplicate IDs in tabs and accordions causing incorrect content display.
* Minor fixes and improvements.

### 1.0.6 (2024-12-18) ###
* Added Instructor Notes patterns.
* Improved disabled state appearance of the Get Code button.
* Removed background colors, preset text colors, and typography settings from Excelsior Bootstrap pages. These settings remain available outside of the editor.
* Allowed WordPress Core Classic and Custom HTML blocks.

### 1.0.5 (2024-12-04) ###
* Removed conflicting responsive classes from floated iFrame Embed block.
* Removed built-in WordPress Core block patterns from the editor.

### 1.0.4 (2024-11-20) ###
* Removed unnecessary `role="presentation"` attributes from tabs and card images.
* Restricted Excelsior Bootstrap inline icon button to blocks inside the container.
* Verified compatibility with WordPress 6.7.

### 1.0.3 (2024-11-06) ###
* Excelsior Bootstrap is now available for any WordPress post type. Insert the “Excelsior Bootstrap” block to start.
* Updated lock settings for all templates/patterns. New patterns use updated locks, while existing ones remain unchanged.
* Fixed issue where script tags were not stripped from iFrame embeds.
* Updated patterns: changed “Review” to “Overview” for assignments/discussions and removed redundant grading info.
* Simplified “Agenda” tab list for live session pattern.
* Minor backend adjustments.

### 1.0.2 (2024-10-23) ###
* Removed `role` attribute from decorative images (`alt=""`).
* Adjusted CPT capabilities to allow authors to delete their own posts.
* Added cache-busting to Get Code functionality.
* Fixed issue where first tab didn’t display after deletion.
* Added labels to horizontal rule icons.
* Added Quiz/Knowledge Check pattern.

### 1.0.1 ###
* Removed “Welcome to Module #!” header in Overview pattern.

### 1.0.0 (2024-09-20) ###
* Initial release.
* Included all Excelsior Bootstrap components except carousel, tooltip, and popover.