from pathlib import Path

def main():
    repo_root = Path(__file__).resolve().parents[1]
    base_dir = repo_root / 'web_ui' / 'src' / 'generators'
    generated_file = base_dir / 'generated_bf6_generators.ts'
    target_file = base_dir / 'bf6_generators.ts'
    
    with generated_file.open('r', encoding='utf-8') as f:
        new_content = f.read()
        
    with target_file.open('a', encoding='utf-8') as f:
        f.write("\n// Auto-generated missing generators\n")
        f.write(new_content)
        
    print(f"Appended content from {generated_file} to {target_file}")

if __name__ == "__main__":
    main()
