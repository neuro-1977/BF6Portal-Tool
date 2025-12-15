import re
import os

index_d_ts_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '=Resources=', 'portal-docs-json', 'index.d.ts')

def analyze_index_d_ts(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Count exported functions
    functions = re.findall(r'export function (\w+)\(', content)
    print(f"Total exported functions: {len(functions)}")
    print(f"Unique exported functions: {len(set(functions))}")

    # Count namespaces
    namespaces = re.findall(r'declare namespace (\w+)', content)
    print(f"Namespaces: {namespaces}")

    # Count events (functions starting with On)
    events = [f for f in functions if f.startswith('On')]
    print(f"Total events: {len(events)}")
    print(f"Unique events: {len(set(events))}")

    # Sample some functions
    print("\nSample functions:")
    for f in list(set(functions))[:10]:
        print(f"- {f}")

    # Check for Enums (export enum ...)
    enums = re.findall(r'export enum (\w+)', content)
    print(f"\nTotal Enums: {len(enums)}")
    print(f"Sample Enums: {enums[:5]}")

if __name__ == "__main__":
    analyze_index_d_ts(index_d_ts_path)
