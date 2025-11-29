# Convenience PowerShell script to create venv (if needed), install deps, and run the editor
$VenvPython = ".\.venv\Scripts\python.exe"

if (-Not (Test-Path .venv)) {
    Write-Host "Creating virtual environment..."
    python -m venv .venv
}

if (Test-Path $VenvPython) {
    Write-Host "Using virtual environment python..."
    # Install dependencies
    & $VenvPython -m pip install -r requirements.txt
    
     # Add source to PYTHONPATH
    $env:PYTHONPATH = "source"
    # Run the editor
    & $VenvPython tools/launch_blockly.py
} else {
    Write-Error "Virtual environment python not found at $VenvPython"
}
