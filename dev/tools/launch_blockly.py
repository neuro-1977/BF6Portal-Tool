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

DEFAULT_PORT = 8000
FALLBACK_PORT = 8010
PORT = DEFAULT_PORT


# --- Robust project root detection ---
def find_project_root(start_dir):
    cur = os.path.abspath(start_dir)
    while True:
        web = os.path.join(cur, "web_ui")
        assets = os.path.join(cur, "assets")
        if os.path.isdir(web) and os.path.isdir(assets):
            return cur
        parent = os.path.dirname(cur)
        if parent == cur:
            break
        cur = parent
    return None

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = find_project_root(SCRIPT_DIR)
if not ROOT_DIR:
    print("CRITICAL ERROR: Could not find project root containing 'web_ui' and 'assets'.")
    input("Press Enter to exit...")
    sys.exit(1)
WEB_DIR = os.path.join(ROOT_DIR, "web_ui")
ASSETS_DIR = os.path.join(ROOT_DIR, "assets")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve from web_ui by default, but we will override for / to serve blockly if present
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def log_message(self, format, *args):
        sys.stderr.write("[HTTP] %s - - [%s] %s\n" % (
            self.client_address[0],
            self.log_date_time_string(),
            format%args))


    def do_GET(self):
        print(f"[DIAG] GET request for: {self.path}")
        # Serve vendor/blockly/index.html for root requests if it exists, else fallback to web_ui/index.html
        if self.path in ('/', '/index.html', '/index.htm'):
            blockly_index = os.path.join(ROOT_DIR, 'vendor', 'blockly', 'index.html')
            if os.path.exists(blockly_index):
                try:
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    with open(blockly_index, 'rb') as f:
                        self.wfile.write(f.read())
                except Exception as e:
                    print(f"[DIAG] Exception serving blockly index: {e}")
                    import traceback
                    traceback.print_exc()
                    self.send_error(500, f"Internal server error: {e}")
                return
            else:
                self.path = '/index.html'
                self.directory = WEB_DIR
        try:
            super().do_GET()
        except Exception as e:
            print(f"[DIAG] Exception in do_GET: {e}")
            import traceback
            traceback.print_exc()
            self.send_error(500, f"Internal server error: {e}")

    def translate_path(self, path):
        # Handle /assets/ request by mapping to the actual assets directory
        if path.startswith("/assets/"):
            path = path[len("/assets/") :]
            resolved = os.path.join(ASSETS_DIR, path)
            print(f"[DIAG] translate_path: {path} -> {resolved}")
            return resolved
        # Handle /vendor/blockly/ requests by mapping to project root
        if path.startswith("/vendor/blockly/"):
            rel = path.lstrip("/")
            resolved = os.path.join(ROOT_DIR, rel)
            print(f"[DIAG] translate_path: {path} -> {resolved}")
            return resolved
        resolved = super().translate_path(path)
        print(f"[DIAG] translate_path: {path} -> {resolved}")
        return resolved

    def guess_type(self, path):
        # Force correct MIME type for .js files
        if path.endswith('.js'):
            return 'application/javascript'
        return super().guess_type(path)

def main():
    print(f"[DIAG] Running script: {__file__}")
    import os
    print(f"[DIAG] Current working directory: {os.getcwd()}")
    try:
        # Verify directories exist
        if not os.path.exists(WEB_DIR):
            print(f"CRITICAL ERROR: Web UI directory not found at: {WEB_DIR}")
            print("Ensure the 'web_ui' folder exists.")
            input("Press Enter to exit...")
            return

        # Do NOT change to web directory; serve from project root so /vendor/blockly/ works

        # Allow port reuse to prevent "Address already in use" errors
        socketserver.TCPServer.allow_reuse_address = True

        # Try default port, fallback if in use
        global PORT
        try:
            httpd = socketserver.TCPServer(("", DEFAULT_PORT), Handler)
            PORT = DEFAULT_PORT
            print(f"[DIAG] Using default port {DEFAULT_PORT}")
        except OSError as e:
            print(f"[DIAG] Port {DEFAULT_PORT} unavailable: {e}")
            try:
                httpd = socketserver.TCPServer(("", FALLBACK_PORT), Handler)
                PORT = FALLBACK_PORT
                print(f"[DIAG] Using fallback port {FALLBACK_PORT}")
            except OSError as e2:
                print(f"CRITICAL ERROR: Both ports {DEFAULT_PORT} and {FALLBACK_PORT} unavailable.")
                print(f"Details: {e2}")
                input("Press Enter to exit...")
                return

        with httpd:
            print(f"Serving at http://localhost:{PORT}")
            print("Press Ctrl+C to stop.")
            # Open browser automatically
            try:
                webbrowser.open(f"http://localhost:{PORT}")
            except Exception as e:
                print(f"[DIAG] Could not open browser: {e}")
            print("[DIAG] About to call serve_forever()...")
            try:
                httpd.serve_forever()
                print("[DIAG] serve_forever() exited normally (unexpected)")
            except KeyboardInterrupt:
                print("\nStopping server...")
                httpd.server_close()
            except Exception as e:
                print(f"[DIAG] Exception in serve_forever: {e}")
                import traceback
                traceback.print_exc()
                httpd.server_close()
            print("[DIAG] After serve_forever() block")
    except Exception as e:
        print(f"\nAn error occurred: {e}")
        import traceback
        traceback.print_exc()
        print("\n")
        input("Press Enter to exit...")
                
    except Exception as e:
        print(f"\nAn error occurred: {e}")
        import traceback
        traceback.print_exc()
        print("\n")
        input("Press Enter to exit...")

if __name__ == "__main__":
    main()
