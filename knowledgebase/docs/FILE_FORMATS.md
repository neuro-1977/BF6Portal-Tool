# Knowledgebase File Format Options

This document summarizes the supported and recommended file formats for the BF6Portal Tool knowledgebase, including screenshots, block data, help tips, and documentation. Use this as a reference when adding or updating knowledgebase content.

---

## 1. Screenshots & Images
- **Format:** PNG (preferred), JPG
- **Location:** `assets/img/`, `knowledgebase/screenshots/`, `Dump/`
- **Usage:** Block visual reference, UI/UX documentation, visual audits
- **Notes:** Use descriptive filenames (e.g., `Screenshot 2025-11-29 080341.png`).

## 2. Block Data & Definitions
- **Format:** JSON
- **Location:** `assets/` (e.g., `mod_data.json`, `rules_data.json`, etc.)
- **Usage:** Block definitions, categories, parameters, and help text
- **Notes:** Follow the documented schema in `README.md` and `EXPECTED_BLOCKS_REFERENCE.md`.

## 3. Help Tips & Quirky Messages
- **Format:** JavaScript (for arrays of strings), plain text, or JSON
- **Location:** `knowledgebase/quirky_ticker_messages.js`, `help_tips/`, `assets/block_help.json`
- **Usage:** Ticker messages, block help, onboarding tips
- **Notes:** Use UTF-8 encoding, keep messages concise and community-friendly.

## 4. Documentation & Reference
- **Format:** Markdown (`.md`)
- **Location:** `docs/`, `knowledgebase/docs/`, `README.md`, `PROMPT.md`
- **Usage:** Project documentation, block analysis, UI/UX guides, master prompts
- **Notes:** Use clear section headers, tables, and code blocks for clarity.

## 5. Concept Art & Mockups
- **Format:** SVG (preferred), PNG, JPG
- **Location:** `docs/`, `knowledgebase/svg/`, `assets/img/`
- **Usage:** UI mockups, concept diagrams, visual references
- **Notes:** SVG preferred for scalability and clarity; PNG/JPG for screenshots.

## 6. Miscellaneous
- **Text:** `.txt` for logs, TODOs, and missing info requests
- **Python:** `.py` for tools and scripts
- **Other:** Use standard, open formats whenever possible

---

**Always update this file when new formats or locations are added.**

_Last updated: 2025-11-29_