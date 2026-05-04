# Copilot instructions for `second-drafts`

## Build, preview, and publish

This repository is a Quarto website. The source lives in the repo root, `posts/`, `maths/`, and `scribbles/`; rendered output goes to `docs/`.

- Full render: `quarto render`
- Make-based build: `make build`
- Live preview: `quarto preview`
- Render a single page while iterating: `quarto render index.qmd`, `quarto render maths/index.qmd`, `quarto render scribbles/index.qmd`, or `quarto render posts/maths/bayes-theorem.qmd`
- Clean generated output and Quarto/Jupyter caches: `make clean`

There are currently **no dedicated automated test or lint commands** configured at the repository root.

Treat `make deploy` and `make all` as publishing commands, not local validation steps: `deploy` runs `git pull`, `git add -A`, `git commit`, and `git push`.

## High-level architecture

This repo is a **Quarto website centered on content pages**.

- Root `.qmd` files provide site-level landing pages.
- `maths/` and `scribbles/` hold section landing pages.
- `posts/maths/` and `posts/scribbles/` hold the actual essays and tutorials.
- Interactive material that remains in the repo is typically embedded directly in pages with inline Observable JS (`{ojs}` blocks).

Site navigation is centralized in `_quarto.yml`. The homepage (`index.qmd`) and the section landing pages use Quarto listings, so content metadata drives how cards appear in the rendered site. When moving content, check `_quarto.yml`, listing sources, and relative links together.

## Key repository conventions

- **Preserve file history when moving or renaming content.** The README explicitly asks contributors to use `git mv` rather than ad hoc rename/move operations.
- **Keep front matter consistent on posts.** Listing pages depend on fields like `title`, `date`, `description`, `categories`, and `image`; missing metadata degrades homepage and section cards.
- **Treat `docs/` as generated output.** `_quarto.yml` sets `output-dir: docs`, so source edits should usually happen in `.qmd`, CSS, include files, or section-owned assets rather than in rendered HTML under `docs/`.
- **Read nearby files before “cleaning up.”** The README warns that the repo contains stale experiments, duplicate assets, mixed draft/polished content, and many relative links.
- **Interactive work is usually inline.** Existing interactive material is commonly embedded directly in `.qmd` pages with Observable JS rather than split into standalone sub-apps.
- **Shared chrome is partly include-based.** Section-level `_metadata.yml` files in `posts/maths/` and `posts/scribbles/` apply the back-navigation include for each subtree, so moved content inherits the correct chrome without duplicating front matter in every file.
