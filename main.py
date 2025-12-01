import http.server
import socketserver
import os

PORT = 8000
WEB_UI_DIR = "web_ui"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_UI_DIR, **kwargs)

if __name__ == "__main__":
    # Change the current working directory to the location of this script
    # to ensure WEB_UI_DIR is found relative to main.py
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving web_ui directory at http://localhost:{PORT}")
        httpd.serve_forever()