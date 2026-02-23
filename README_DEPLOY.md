Deployment instructions

Render (recommended, simple):
1. Create an account at https://render.com and connect your GitHub account.
2. Create a new Web Service and select your `Programming-Arena` repo.
3. Branch: `main`; Root: `/`.
4. Build command: `pip install -r requirements.txt`.
5. Start command: `gunicorn app:app --bind 0.0.0.0:$PORT`.
6. Add environment variable `PORT` if required by Render.
7. Deploy. After deploy, note the service URL (e.g., `https://your-app.onrender.com`).

Railway (alternative):
1. Create a project on https://railway.app and connect GitHub.
2. Deploy from the `main` branch, or use their GitHub integration.
3. Set the start command to `gunicorn app:app --bind 0.0.0.0:$PORT`.

Update static frontend:
1. Open `docs/index.html` and replace `REPLACE_WITH_API_URL` with your deployed API base URL.
2. Commit and push; GitHub Pages will serve `docs/` at `https://<username>.github.io/Programming-Arena/`.

Notes:
- The `docs/` frontend is static and uses `window.API_BASE` to point to the deployed Flask API. You will need to modify frontend JS to call endpoints (e.g., fetch(`${window.API_BASE}/api/cards`) ).
- If you want, I can modify `docs/static/script.js` to call `GET /api/cards` and render cards dynamically from the API.
