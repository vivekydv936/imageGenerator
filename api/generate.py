# FILE: api/generate.py
# This is a Vercel Serverless Function, not a FastAPI server.

from http.server import BaseHTTPRequestHandler
import json
import os
import requests

# NOTE: You no longer need the python-dotenv library for Vercel.
# Vercel injects environment variables automatically.

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # Get the length of the incoming request body from the frontend
        content_length = int(self.headers['Content-Length'])
        # Read the data
        post_data = self.rfile.read(content_length)
        
        try:
            # Parse the JSON data to get the user's prompt
            body = json.loads(post_data)
            prompt = body.get('prompt')

            if not prompt:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'A prompt is required.'}).encode())
                return

            # Get the API Key from the environment variables set in Vercel
            API_KEY = os.getenv("GOOGLE_API_KEY")
            if not API_KEY:
                 raise ValueError("GOOGLE_API_KEY not found in Vercel environment variables.")

            # The direct API endpoint for the free Gemini image generation model
            API_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key={API_KEY}"

            # Construct the payload for the Google AI API
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseModalities": ['TEXT', 'IMAGE']},
            }
            
            headers = {'Content-Type': 'application/json'}

            # Make the request to the Google AI API
            api_response = requests.post(API_ENDPOINT, json=payload, headers=headers)
            api_response.raise_for_status()
            response_data = api_response.json()

            # Find the image data in the response
            image_b64 = None
            mime_type = "image/png" # default
            if "candidates" in response_data and response_data["candidates"]:
                candidate = response_data["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    image_part = next((part for part in candidate["content"]["parts"] if "inlineData" in part), None)
                    if image_part:
                        image_b64 = image_part["inlineData"].get("data")
                        mime_type = image_part["inlineData"].get("mimeType", "image/png")

            if image_b64:
                # Send a successful response back to the frontend
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_payload = {
                    "image_b64": image_b64,
                    "mime_type": mime_type
                }
                self.wfile.write(json.dumps(response_payload).encode())
            else:
                # If no image was found in the API response
                raise ValueError(f"API response did not contain image data. Response: {response_data}")

        except Exception as e:
            # Handle any errors during the process
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_message = f"An error occurred: {str(e)}"
            self.wfile.write(json.dumps({'detail': error_message}).encode())
            
        return
