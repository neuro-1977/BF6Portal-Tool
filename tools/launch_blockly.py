"""
BLOCKLY LAUNCHER
----------------
Starts a local web server to host the new Blockly-based editor.
Usage: python tools/launch_blockly.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB_DIR = os.path.join(ROOT_DIR, "web_ui")
ASSETS_DIR = os.path.join(ROOT_DIR, "assets")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def translate_path(self, path):
        # Handle /assets/ request by mapping to the actual assets directory
        if path.startswith("/assets/"):
            path = path[len("/assets/"):]
            return os.path.join(ASSETS_DIR, path)
        return super().translate_path(path)

def main():
    # Change to web directory so serving works correctly
    os.chdir(WEB_DIR)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        
        # Open browser automatically
        webbrowser.open(f"http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server...")
            httpd.server_close()

if __name__ == "__main__":
    main()
