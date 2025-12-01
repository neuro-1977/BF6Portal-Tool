# Screenshot Naming Conventions and Asset Mapping

## Naming Conventions
- Use lowercase, underscores for spaces, and group by feature or block type.
- For block screenshots: `block_<blocktype>_<shortdesc>.png`
- For menus/UI: `menu_<feature>.jpg` or `ui_<feature>.jpg`
- For general screenshots: `screenshot_<desc>.png`
- For help images: `help_<feature>.jpg`

## Asset Mapping
- All screenshots and UI images are tracked in `SCREENSHOT_AUDIT.md` (BF6Portal) and `BLOCK_SCREENSHOT_RECORD.md` (blocks/).
- As new block screenshots are added, update the `BLOCK_SCREENSHOT_RECORD.md` with the block type and description.
- If you rename or move an asset, update the audit files to keep the mapping current.

## Example Asset Map
| Asset File                        | Usage/Reference Location         |
|-----------------------------------|----------------------------------|
| block_math_addition.png           | Block help, documentation        |
| menu_rules.jpg                    | UI menu, documentation           |
| screenshot_ui_overview.png        | General UI overview              |

---

Keep this file up to date as you add or rename assets. This will ensure clarity and make future automation/documentation easier.
