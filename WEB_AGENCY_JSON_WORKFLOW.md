# JSON-First Website Update Model (Handoff for Web Agency)

## Purpose
This website is designed so content updates are done by editing JSON files, not HTML templates.
The goal is fast, low-risk updates when new projects or bios are added.

## Core Idea
- One shared bio page template: `bio_template.html`
- One bio data source: `bios.json`
- One main content data source: `content.json`
- JavaScript renders pages from JSON automatically.

Result: when the institute sends updated JSON with predefined keys, all necessary pages are populated without manual page-by-page editing.

## Files and Responsibilities
- `content.json`
  - Main site content (home, projects, research fields, news, nav labels)
  - Top-level keys in current implementation:
    - `site`
    - `hero`
    - `researchFields`
    - `projects`
    - `news`
    - `navigation`
    - `ui`

- `bios.json`
  - All person bios in one file under `bios`
  - Bio entries are keyed by bio identifier, e.g. `bio-ralf.html`

- `bio_template.html`
  - Single HTML shell used for all people
  - Person is selected with URL query, e.g.:
    - `bio_template.html?bio=bio-ralf.html`

## Required Keywords for New Projects
For each new project in `content.json` -> `projects[]`, include at minimum:
- `id` (unique, URL-safe)
- `status` (`active` or `archive`)
- `title` (`en`/`de`)
- `badge` (`en`/`de`)
- `image`
- `altText`
- `description` (`en`/`de`)

Recommended:
- `shortTitle`
- `meta` (`en`/`de`)
- `details` (subtitle/paragraphs/meta/links or html blocks)
- `people` (array of bio identifiers, e.g. `"people": ["bio-danka.html", "bio-ralf.html"]`)

## Update Workflow (Agency + Institute)
1. Institute sends updated `content.json` and/or `bios.json`.
2. Keep the same key names and structure.
3. Deploy the JSON updates with related media files in `images/`.
4. No new HTML page per person is needed.

## Why This Model
- Faster updates
- Lower maintenance cost
- Fewer template-level bugs
- Consistent multilingual rendering
- Scales easily as projects and team members grow
