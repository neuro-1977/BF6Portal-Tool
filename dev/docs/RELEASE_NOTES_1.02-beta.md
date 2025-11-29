# 1.0.4beta (2025-11-27)

- Web UI sidebar/toolbox is now always expanded and flat, matching the official Portal system. All categories/blocks are visible under group headers, no nested categories.
- Packaging improvements: PyInstaller spec updated to include all modules and assets, preventing missing module errors in the executable.

# 1.02-beta (2025-11-27)

- Sidebar/menu UI now matches the official Battlefield Portal: always-expanded, flat list with all categories/blocks visible under group separators. No expand/collapse arrows. Group headers are non-interactive separators with icons. This fixes the previous issue where only group headers were visible.

# 1.0.3 (2025-11-27)

- Sidebar/menu UI now matches the official Battlefield Portal: always-expanded, flat list with all categories/blocks visible under group separators. No expand/collapse arrows. Group headers are non-interactive separators with icons. This fixes the previous issue where only group headers were visible.

# Release 1.02-beta

## Highlights

- **Import/Export Parity with Official Battlefield Portal**
  - Import and export workspaces in JSON format, preserving block layout, snapping, and TypeScript code.
  - Imported workspaces match the official Battlefield Portal editor layout and logic, including block snapping and grouping.
- **TypeScript Generation**
  - Each block generates TypeScript code that matches the official Portal scripting system, ensuring functional parity.
- **Snapping and Layout**
  - All snapping, block placement, and export logic now mirrors the official Portal editor.
- **Beta Status**
  - This project is in active beta. Please report issues and feature requests on GitHub.

---

## Upgrade Notes
- Restart the editor after updating to ensure all new features are loaded.
- Review the README for updated usage instructions.

---

Thank you for using BF6 Portal Tool!
