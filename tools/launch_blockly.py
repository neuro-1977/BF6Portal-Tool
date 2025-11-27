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
WEB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "web_ui")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

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
