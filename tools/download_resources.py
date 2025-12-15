import os
import urllib.request

resources_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), '=Resources=', 'portal-docs-json')
os.makedirs(resources_dir, exist_ok=True)

files_to_download = {
    "enabled_blocks.json": "https://raw.githubusercontent.com/battlefield-portal-community/portal-docs/main/generators/blocks_json/data/enabled_blocks.json",
    "index.d.ts": "https://raw.githubusercontent.com/battlefield-portal-community/portal-docs/main/generators/santiago/mod/index.d.ts",
    "Rule.json": "https://raw.githubusercontent.com/battlefield-portal-community/portal-docs/main/generators/blocks_json/docs_json/Rule.json",
    "Teleport.json": "https://raw.githubusercontent.com/battlefield-portal-community/portal-docs/main/generators/blocks_json/docs_json/Teleport.json",
    "translations.json": "https://raw.githubusercontent.com/battlefield-portal-community/portal-docs/main/generators/blocks_json/data/translations.json",
    "clean_names": "https://raw.githubusercontent.com/battlefield-portal-community/portal-docs/main/generators/blocks_json/data/clean_names"
}

for filename, url in files_to_download.items():
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, os.path.join(resources_dir, filename))
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
