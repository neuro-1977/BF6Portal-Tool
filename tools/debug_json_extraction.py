
import re
import json

file_path = 'web_ui/src/blocks/bf6portal.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'createBlockDefinitionsFromJsonArray\(\s*(\[.*\])\s*\);', content, re.DOTALL)
if match:
    json_str = match.group(1)
    # json_str = re.sub(r'//.*', '', json_str) 
    # json_str = re.sub(r'/\*.*?\*/', '', json_str, flags=re.DOTALL)
    json_str = re.sub(r',\s*\]', ']', json_str)
    json_str = re.sub(r',\s*\}', '}', json_str)

    try:
        data = json.loads(json_str)
        print(f"Successfully parsed {len(data)} blocks via JSON.")
        print(f"First block: {data[0]}")
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        # print snippet around error
        start = max(0, e.pos - 50)
        end = min(len(json_str), e.pos + 50)
        print(f"Context: {json_str[start:end]}")

        # Try fallback
        print("Attempting fallback...")
        blocks = []
        object_pattern = re.compile(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', re.DOTALL)
        matches = object_pattern.findall(json_str)
        print(f"Fallback found {len(matches)} matches.")
        for i, m in enumerate(matches):
            try:
                b = json.loads(m)
                blocks.append(b)
                if b.get('type') == 'abort':
                    print("Found abort in fallback!")
            except:
                if i < 3:
                   print(f"Failed to parse match {i}: {m}")
else:
    print("Regex failed to find array.")
