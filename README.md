# Excelsior Bootstrap Editor
_Version 1.0.8_

A WordPress plugin that helps with creating Excelsior Bootstrap content pages.

## Changelog

### Version 1.0.8 (01/22/2025)
- Add 3 new styles to horizontal rule: basic, red (default), blue, and purple.
- Update Excelsior Bootstrap framework

### Version 1.0.7 (01/15/2025)
- Add new icons.
- Add some hybrid course templates (but not activated).
- Update Instructor Notes template with the reminder box.
- Fix the issue where the tab and accordion items duplicate with the same ID and `show active` classes. This causes an ID conflict, resulting in subsequence tab content being displayed unintentionally.
- Minor fixes and improvements.

### Version 1.0.6 (12/18/2024)
- Add instructor notes patterns
- Fix Get Code button disabled state appearance. It is now more prominent that the button is disabled.
- Remove background colors, preset text colors, and typography settings when creating a Excelsior Bootstrap page. Those settings remain intact when editing outside of Excelsior Bootstrap Editor.
- Allow WordPress's core classic and custom HTML blocks.

### Version 1.0.5 (12/04/2024)
- Remove conflicting responsive classes from floated iframe embed block. Floated element is not responsive by nature because it requires fixed width and height.
- Remove built-in WordPress core block patterns from the editor.

### Version 1.0.4 (11/20/2024)
- Remove unnecessary `role="presentation"` attribute from tabs.
- Remove unnecessary `role="presentation"` attribute from card top image.
- Insert inline Excelsior Bootstrap icon button will only appear in the toolbar for blocks within the Excelsior Bootstrap container when used outside the editor.
- Support up to WordPress version 6.7

### Version 1.0.3 (11/06/2024)
- Excelsior Bootstrap is now available for use in any WordPress post type. To start, insert the "Excelsior Bootstrap" block on to the page.
- Adjust the lock settings for all templates/patterns. Patterns added to new pages will now have the updated lock settings, while existing pages (with patterns added before the release) will remain unchanged.
- Fix an issue where script tags are not properly striped from iframe embed.
- Change "Review" to "Overview" tab content for assignment and discussion patterns/templates. Also, remove repeated expectation and grading information in the "Complete" and "Submit" tabs.
- Change the "list of tasks" under the "Agenda" tab to a basic list for the live session pattern/template.
- Minor backend adjustments

### Version 1.0.2 (10/23/2024)
- Remove the `role` attribute from the `img` tag when the `alt` attribute is empty (indicating the image is decorative). For assistive technologies like screen readers, it's not recommended to add the `role` attribute for decorative images, as it can cause confusion. An empty `alt` tag is sufficient for assistive technologies to recognize the image as decorative.
- Adjust the custom post type capabilities to allow users to delete their own posts, whether they are published or in draft form.
- Add cache-busting technique to the "Get Code" functionality, which should minimize the need for frequent cache purging.
- Fix the issue where the first tab wasn't showing after deleting a tab. Now, when a tab is deleted from a tab group or container, the first tab will correctly apply the necessary classes to ensure it displays properly.
- Add label to horizontal rule icons.
- Add a new Quiz or Knowledge Check template/pattern.

### Version 1.0.1
- Removed "Welcome to Module #!" header in the Overview pattern.

### Version 1.0.0 (09/20/2024)
- Initial release.
- All Excelsior Bootstrap component, except carousel, tooltip, and popover.