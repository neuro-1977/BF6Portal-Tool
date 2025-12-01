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

# Determine paths dynamically to support both Dev (tools/) and Release (root/) execution
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

if os.path.exists(os.path.join(SCRIPT_DIR, "web_ui")):
    # Release mode: Script is in root, web_ui is next to it
    ROOT_DIR = SCRIPT_DIR
else:
    # Dev mode: Script is in tools/, web_ui is in parent
    ROOT_DIR = os.path.dirname(SCRIPT_DIR)

WEB_DIR = os.path.join(ROOT_DIR, "web_ui")
ASSETS_DIR = os.path.join(ROOT_DIR, "assets")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def translate_path(self, path):
        # Handle /assets/ request by mapping to the actual assets directory
        if path.startswith("/assets/"):
            path = path[len("/assets/") :]
            return os.path.join(ASSETS_DIR, path)
        return super().translate_path(path)

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

        # Change to web directory so serving works correctly
        os.chdir(WEB_DIR)

        # Allow port reuse to prevent "Address already in use" errors
        socketserver.TCPServer.allow_reuse_address = True

        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Serving at http://localhost:{PORT}")
            print("Press Ctrl+C to stop.")
            # Open browser automatically
            webbrowser.open(f"http://localhost:{PORT}")
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
