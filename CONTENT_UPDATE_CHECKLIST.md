# Content Update Checklist

Use this checklist before publishing any content change.

## 1) Single Source of Truth
- Update content in _content.json_ (metadata) and _data/_ (projects, news, bios).
- Main files:
	- _content.json_ - site metadata, hero, research fields, navigation, UI labels
	- _data/projects.json_ - all projects
	- _data/bios.json_ - all person bios
	- _data/news.json_ - news items
- The homepage and projects views are rendered automatically by data-renderer.js.
- If content is changed, the following pages update automatically after reload:
	- _ada_better.html_
	- _projects.html_
	- _bio_template.html_
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
- Use images/... paths in data JSON files or content.json for image and PDF links.


## 3) Copy-Paste Project Template
Use this as a starting point when adding a new project to projects[] in data/projects.json.

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
- The shared bio page (bio_template.html) automatically displays related projects from data/projects.json.
- The bio-related-projects.js script runs on page load and matches projects to the current person.
- **No manual edits to per-person bio pages are needed.** Update data/projects.json and data/bios.json only.

### 4.2 How Projects Get Linked to People

Projects appear on a bio page when the project entry in data/projects.json matches the person through any of these methods (in priority order):

1. **Explicit "people" array** (strongest, recommended):
   - Add a `"people"` array to the project object in data/projects.json.
	- List the bio identifiers used by the shared bio template (e.g., `["bio-aris.html", "bio-natasa.html"]`, which map to `bio_template.html?bio=...`).
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
	- Example: `"credits": "Led by <a href='bio_template.html?bio=bio-aris.html'>Aris Marcolongo</a>"`
   - The script detects the href and matches the project to that bio page.

3. **Credits text match** (weakest):
   - The script checks if a person's name appears in the credits text.
   - Only works if the name is a clear substring match.
   - Not reliable for common names.

### 4.3 Best Practice
- Always use the explicit `"people"` array for reliable and maintainable linking.
- Update this array whenever a project's key contributors change.



Notes:
- status must be either active or archive.
- id must be unique and URL-anchor safe (no spaces).
- Keep all local files under images/.
- Use html blocks only if paragraphs are not sufficient.
