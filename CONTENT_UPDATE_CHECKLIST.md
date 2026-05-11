# Content Update Checklist

Use this checklist before publishing any content change.

## 1) Single Source of Truth
- Update content in content.json first.
- The homepage and projects views are rendered automatically from content.json by data-renderer.js.
- If content is changed in content.json, the following pages update automatically after reload:
	- ada_better.html
	- projects.html
- Language labels and some UI text are also adjusted by language-switcher.js.

## 2) What Is Automatic vs Manual
- Automatic from content.json:
	- Site title/description text used by the renderer.
	- Hero section text and buttons.
	- Research fields.
	- Project cards (active and archive).
	- Project detail sections (including long-form detail blocks).
	- News card content.
- Manual (not generated from content.json):
	- Static biography pages bio-*.html.
	- Page-specific layout markup outside rendered content regions.

## 3) Required JSON Structure

### 3.1 Bilingual text pattern
- Any user-facing text that should switch language should use this structure:
	- { "en": "...", "de": "..." }

### 3.2 Minimum project fields (required)
Each project object in projects[] should include:
- id: unique anchor-safe identifier (example: eagle, murs).
- status: active or archive.
- title: bilingual object.
- badge: bilingual object.
- image: local path, usually images/filename.ext.
- altText: plain string for accessibility.
- description: bilingual object.

### 3.3 Recommended project fields (strongly recommended)
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

## 4) Media and File Paths
- Store local media in images/.
- Use images/... paths in content.json for image and PDF links.
- Keep altText accurate and specific to each image.
- For external resources, use full https links.

## 8) Copy-Paste Project Template
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

Notes:
- status must be either active or archive.
- id must be unique and URL-anchor safe (no spaces).
- Keep all local files under images/.
- Use html blocks only if paragraphs are not sufficient.
