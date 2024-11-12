# Excelsior Bootstrap Editor
_Version 1.0.4_

A WordPress plugin that helps with creating Excelsior Bootstrap content pages.

## Changelog

### Version 1.0.4
- Remove unnecessary `role="presentation"` attribute from tabs.
- Remove unnecessary `role="presentation"` attribute from card top image.

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