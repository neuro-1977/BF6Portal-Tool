---
name: refactorCode
description: Refactor code for better readability, performance, or structure
argument-hint: The file or function to refactor and the goal
---
Refactor code in the Battlefield Portal Editor.

Context:
- The project is growing and needs to remain maintainable.
- We want to adhere to Python best practices (PEP 8 where reasonable) and keep the architecture modular.

Task:
1.  **Review**: Read the target code.
2.  **Plan**: Identify areas for improvement (e.g., long functions, duplicated code, tight coupling).
3.  **Refactor**: Apply changes using `replace_string_in_file`.
4.  **Safety**: Ensure the refactor doesn't break existing functionality.

Input Variables:
- **Target File/Function**: [e.g., `Block_Renderer.py`, `draw_block`]
- **Goal**: [e.g., "Split into smaller functions", "Optimize loop"]

Output:
- Explanation of the changes.
- Code edits.
