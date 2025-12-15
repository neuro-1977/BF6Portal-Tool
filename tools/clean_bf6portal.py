
path = 'web_ui/src/blocks/bf6portal.ts'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() == '// Generator stubs':
        break
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Truncated {path} at '// Generator stubs'")
