import os

def main():
    base_dir = r"d:\=Code=\BF6Portal Tool\web_ui\src\generators"
    generated_file = os.path.join(base_dir, "generated_bf6_generators.ts")
    target_file = os.path.join(base_dir, "bf6_generators.ts")
    
    with open(generated_file, 'r', encoding='utf-8') as f:
        new_content = f.read()
        
    with open(target_file, 'a', encoding='utf-8') as f:
        f.write("\n// Auto-generated missing generators\n")
        f.write(new_content)
        
    print(f"Appended content from {generated_file} to {target_file}")

if __name__ == "__main__":
    main()
