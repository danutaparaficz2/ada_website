# Content Update Checklist

Use this checklist before publishing any content change.

## 1) Single Source of Truth
- Update content in _content.json_ first.
- The homepage and projects views are rendered automatically from content.json by data-renderer.js.
- If content is changed in content.json, the following pages update automatically after reload:
_	- ada_better.html
	- projects.html_
- Language labels and some UI text are also adjusted by language-switcher.js.

## 2) Required JSON Structure

### 2.1 Bilingual text pattern
- Any user-facing text that should switch language should use this structure:
	- { "en": "...", "de": "..." }

### 2.2 Minimum project fields (required)
Each project object in projects[] should include:
- id: unique anchor-safe identifier (example: eagle, murs).
- status: active or archive.
- title: bilingual object.
- badge: bilingual object.
- image: local path, usually images/filename.ext.
- altText: plain string for accessibility.
- description: bilingual object.

### 2.3 Recommended project fields (strongly recommended)
- shortTitle: short display title.
- meta: bilingual short context line (partners/domain/lead).
- details object containing one of these patterns:
	- paragraphs-based content:
		- subtitle (bilingual)
		- paragraphs (array of bilingual objects)
		- optional meta object (for contact/method/duration)
		- optional links array with href + bilingual label
		- optional credits string
	- html-based content:
		- html.en and html.de arrays with preformatted HTML blocks
		- optional credits string

### 2.4 Media and File Paths
- Store local media in images/.
- Use images/... paths in content.json for image and PDF links.


## 3) Copy-Paste Project Template
Use this as a starting point when adding a new project to projects[] in content.json.

```json
{
	"id": "new-project-id",
	"status": "active",
	"title": {
		"en": "Project NAME",
		"de": "Projekt NAME"
	},
	"shortTitle": "Project NAME",
	"badge": {
		"en": "Domain Label",
		"de": "Bereichslabel"
	},
	"image": "images/new-project-image.png",
	"altText": "Descriptive image alt text",
	"description": {
		"en": "One-sentence project summary in English.",
		"de": "Einzeilige Projektzusammenfassung auf Deutsch."
	},
	"meta": {
		"en": "Partner: Example A / Example B",
		"de": "Partner: Beispiel A / Beispiel B"
	},
	"details": {
		"subtitle": {
			"en": "Optional detail subtitle",
			"de": "Optionaler Detail-Untertitel"
		},
		"paragraphs": [
			{
				"en": "Paragraph 1 in English.",
				"de": "Absatz 1 auf Deutsch."
			},
			{
				"en": "Paragraph 2 in English.",
				"de": "Absatz 2 auf Deutsch."
			}
		],
		"meta": {
			"contact": {
				"en": "Contact Person or Partner",
				"de": "Ansprechperson oder Partner"
			}
		},
		"links": [
			{
				"href": "https://example.org",
				"label": {
					"en": "Open Resource",
					"de": "Ressource öffnen"
				}
			},
			{
				"href": "images/example-file.pdf",
				"label": {
					"en": "Download PDF",
					"de": "PDF herunterladen"
				}
			}
		],
		"credits": "Contributor One, Contributor Two"
	}
}
```
## 4) Automatic Bio Project Linking

### 4.1 How It Works
- All bio pages (bio-*.html) automatically display related projects from content.json.
- The bio-projects.js script runs on page load and matches projects to the current person.
- **No manual edits to bio pages are needed.** Update content.json only.

### 4.2 How Projects Get Linked to People

Projects appear on a bio page when the project entry in content.json matches the person through any of these methods (in priority order):

1. **Explicit "people" array** (strongest, recommended):
   - Add a `"people"` array to the project object in content.json.
   - List the bio page filenames (e.g., `["bio-aris.html", "bio-natasa.html"]`).
   - Example:
     ```json
     {
       "id": "my-project",
       "title": { "en": "Project Name", "de": "Projektname" },
       "people": ["bio-aris.html", "bio-natasa.html"],
       ...
     }
     ```

2. **HTML credits link** (medium strength):
   - In the project's `details.credits` field, include a link to the bio page.
   - Example: `"credits": "Led by <a href='bio-aris.html'>Aris Marcolongo</a>"`
   - The script detects the href and matches the project to that bio page.

3. **Credits text match** (weakest):
   - The script checks if a person's name appears in the credits text.
   - Only works if the name is a clear substring match.
   - Not reliable for common names.

### 4.3 Best Practice
- Always use the explicit `"people"` array for reliable and maintainable linking.
- Update this array whenever a project's key contributors change.

### 4.4 Language Support
- Project cards on bio pages inherit language switching from language-switcher.js.
- All bilingual text (title, description, meta) in the project entry automatically switches when users toggle language.
- No additional work required.

Notes:
- status must be either active or archive.
- id must be unique and URL-anchor safe (no spaces).
- Keep all local files under images/.
- Use html blocks only if paragraphs are not sufficient.
