# JSON-First Website Update Model (Handoff for Web Agency)

## Purpose
This website is designed so content updates are done by editing JSON files, not HTML templates.
The goal is fast, low-risk updates when new projects or bios are added.

## Core Idea
- One shared bio page template: `bio_template.html`
- Modular data folder: `data/` (for frequently-updated content)
- Root-level metadata file: `content.json` (site, hero, research fields, navigation, UI)
- JavaScript renders pages from JSON automatically.

Result: when the institute sends updated JSON files with predefined keys, all necessary pages are populated without manual page-by-page editing.

## Files and Responsibilities
- `content.json`
  - Site metadata (site info, hero, research fields, navigation, UI)
- `data/projects.json`
  - All active/archive projects and detail content
- `data/news.json`
  - News block content
- `data/bios.json`
  - All person bios under `bios`
  - Bio entries are keyed by bio identifier, e.g. `bio-ralf.html`
  - Keep this file HTML-free; store plain content fields and let `bio-renderer.js` build the page

- `bio_template.html`
  - Single HTML shell used for all people
  - Person is selected with URL query, e.g.:
    - `bio_template.html?bio=bio-ralf.html`

## Required Keywords for New Projects
For each new project in `data/projects.json` (array entry), include at minimum:
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
1. Institute sends updated files: `data/projects.json`, `data/news.json`, and/or `data/bios.json` (and optionally `content.json` if metadata changes).
2. Keep the same key names and structure.
3. Deploy JSON updates with related media files in `images/`.
4. No new HTML page per person is needed.

## Why This Model
- Faster updates
- Lower maintenance cost
- Fewer template-level bugs
- Consistent multilingual rendering
- Scales easily as projects and team members grow
