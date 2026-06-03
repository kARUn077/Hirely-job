# Gemini Integration (PoC)

This file explains the minimal environment and usage for the Gemini skills-extraction endpoint added as a proof-of-concept.

Environment
- `GEMINI_API_KEY` (required) — your Gemini / OpenAI-compatible API key. The server also checks `OPENAI_API_KEY` as a fallback.
- `GEMINI_PROVIDER` (optional) — `openai` (default) or `google` to use Google Gemini/Generative API.
- Optional: `GEMINI_API_URL` — override the API URL (defaults to OpenAI or Google generated URL depending on provider).
- Optional: `GEMINI_MODEL` — override the model (defaults to `gpt-4o-mini` for OpenAI-style, `chat-bison` for Google-style if provider is `google`).

Google Gemini example
- Set `GEMINI_PROVIDER=google` and `GEMINI_API_KEY` to an OAuth Bearer token or service account access token. If you prefer to use an API key in the URL, you can set `GEMINI_API_URL` to the Google endpoint with `?key=YOUR_KEY` appended.

Example `.env` entries
```
GEMINI_PROVIDER=google
GEMINI_API_KEY=ya29....   # or use OPENAI_API_KEY for OpenAI-compatible providers
GEMINI_MODEL=chat-bison
# optionally override GEMINI_API_URL
# GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta2/models/chat-bison:generateMessage
```

Endpoint
- POST `/api/v1/gemini/skills`
  - Body: `{ "text": "<resume or plain text>" }`
  - Response: `{ success: true, skills: [...], raw: "<model raw output>" }`

Example curl
```bash
curl -X POST http://localhost:3000/api/v1/gemini/skills \
  -H "Content-Type: application/json" \
  -d '{"text":"Experienced Node.js, Express, MongoDB developer with Docker and AWS"}'
```

Notes
- The helper is at `backend/utils/gemini.js` and the controller is `backend/controllers/gemini.controller.js`.
- This PoC returns a parsed JSON array when possible; otherwise it falls back to simple splitting.
- Keep API keys secret; do not commit them to source control.

How to obtain Google Gemini credentials
--------------------------------------

1. Create or select a Google Cloud project:
  - Visit https://console.cloud.google.com and sign in.
  - Create a new project or select an existing one.

2. Enable the Generative AI / Vertex AI APIs:
  - In the console, go to "APIs & Services" → "Library".
  - Search for and enable "Generative AI API" (or "Vertex AI / Generative Language API").

3. Create a Service Account and download a JSON key (recommended):
  - Go to "IAM & Admin" → "Service Accounts" → "Create Service Account".
  - Give it a name (e.g., `gemini-sa`) and `Create`.
  - Grant the service account the minimum required roles (typically `Editor` or a custom role that allows calling the Generative API).
  - After creating, click the service account → "Keys" → "Add Key" → "Create new key" → choose JSON → download.

4. Configure your server to use the key:
  - Place the downloaded JSON somewhere safe on your server (do NOT commit it).
  - Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to the JSON path.

  Example (Linux/macOS):
  ```bash
  export GOOGLE_APPLICATION_CREDENTIALS="/home/you/keys/gemini-service-account.json"
  ```

  Example (Windows PowerShell):
  ```powershell
  $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\gemini-service-account.json"
  ```

5. (Optional) Use an API key instead:
  - If you prefer an API key, go to "APIs & Services" → "Credentials" → "Create Credentials" → "API key".
  - NOTE: API keys may have different quota/permission characteristics; using a service account is generally safer for server-to-server use.

6. Example `.env` entries (see `backend/.env.example`):
```
GEMINI_PROVIDER=google
GEMINI_API_KEY=          # optional API key or access token
GEMINI_MODEL=chat-bison
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json
```

Security notes
--------------
- Add your service account JSON path or any key files to `.gitignore` so they never get committed.
- For CI/CD or production, use secret managers (GCP Secret Manager, GitHub Actions Secrets, etc.) instead of plain files.

If you want, I can also add a small helper in `backend/utils/` that exchanges a service-account JSON for an access token at runtime — tell me and I'll scaffold it.
