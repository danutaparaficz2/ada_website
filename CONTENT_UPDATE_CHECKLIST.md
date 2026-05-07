# Content Update Checklist

Use this checklist before publishing any content change.

## 1) Navigation and Structure
- Keep the same top navigation labels on all pages: About, Research, Projects, Team, Publications, News, Contact.
- Verify each menu item points to the same destination on every page.
- Do not duplicate full project descriptions across profile pages.
- Keep canonical project details in projects.html.

## 2) Links and Destinations
- Check all new links are local and correct (no broken anchors, no wrong profile links).
- Use local profile pages for people references where available.
- Remove or avoid outdated external profile links if a local page exists.
- Confirm key anchors still exist in ada_better.html (home-view, projects, news, contact).

## 3) Content Consistency
- Keep project names, tags, and spelling identical across pages.
- Keep image filenames consistent with existing assets.
- Preserve full archive project descriptions when moving or refactoring content.
- Use clear section headings and predictable page flow.

## 4) Media and Visuals
- Ensure each project card has the correct corresponding image.
- Confirm alt text exists and matches the content.
- Keep card styling and spacing consistent with existing design patterns.

## 5) QA Before Commit
- Open each edited page and click through all modified links.
- Verify no accidental text regressions (button labels, headings, section titles).
- Run git status and review changed files before commit.
- Commit with a clear message describing the content update scope.

## 6) Release Notes (Optional but Recommended)
- Note what pages changed.
- Note what was added, removed, or redirected.
- Note any follow-up items still pending.
