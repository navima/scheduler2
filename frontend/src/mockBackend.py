#!/usr/bin/env python3
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import os
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent
DUMMY_DATA_PATH = SCRIPT_DIR / 'dummyBackendRes.json'

class MockBackendHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Load the dummy data
        with open(DUMMY_DATA_PATH, 'r') as f:
            data = json.load(f)
        
        # Send response
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Custom logging to show requests
        print(f"[{self.client_address[0]}] {format % args}")

if __name__ == '__main__':
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, MockBackendHandler)
    print('Mock backend server running on http://localhost:8080')
    print('Serving data from:', DUMMY_DATA_PATH)
    print('Press Ctrl+C to stop the server')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down server...')
        httpd.shutdown()
        print('Server stopped.')
