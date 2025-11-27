@echo off
REM Convenience script to run the editor without PowerShell restrictions

if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

if exist .venv\Scripts\python.exe (
    echo Installing dependencies...
    .venv\Scripts\python.exe -m pip install -r requirements.txt
    
    echo Starting Block Editor...
    .venv\Scripts\python.exe source\Block_Editor.py
) else (
    echo Error: Virtual environment python not found.
    echo Please ensure python is installed and added to PATH.
    pause
)
