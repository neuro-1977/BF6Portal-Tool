# Convenience PowerShell script to create venv (if needed), install deps, and run the editor
if (-Not (Test-Path .venv)) {
    python -m venv .venv
}

# Activate venv for this session
. .\.venv\Scripts\Activate.ps1

# Install dependencies (only if needed)
pip install -r requirements.txt

# Run the editor
python .\source\Block_Editor.py
