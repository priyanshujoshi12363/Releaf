# ReLeaf

A gamified platform for environmental education. Players work through learning
modules (video, notes, quiz, mini-game), earn XP, level up, form clans and chat
with EcoBot.

```
backend/                  Express + MongoDB REST API
frontend/my-react-app/    React + Vite single-page app
```

## Requirements

- Node.js 20 or newer
- A MongoDB database (Atlas or local)
- Cloudinary account (avatar uploads)
- OpenRouter API key (EcoBot chat)

## Running locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values
npm run dev               # http://localhost:5000
```

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 2. Frontend

```bash
cd frontend/my-react-app
npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```

The dev server proxies `/api/*` to the backend, so the browser only ever talks
to its own origin. Point `VITE_DEV_API_PROXY_TARGET` somewhere else if your API
is not on port 5000.

## Configuration

### Backend (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | no | `development` or `production` |
| `PORT` | no | Defaults to `5000` |
| `MONGODB_URI` | **yes** | MongoDB connection string |
| `JWT_SECRET` | **yes** | Signing key; 32+ characters in production |
| `JWT_EXPIRES_IN` | no | Token lifetime, defaults to `7d` |
| `CORS_ORIGINS` | no | Comma-separated allow-list of browser origins |
| `CLOUDINARY_CLOUD_NAME` | **yes** | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | **yes** | Cloudinary key |
| `CLOUDINARY_API_SECRET` | **yes** | Cloudinary secret |
| `OPENROUTER_API_KEY` | **yes** | OpenRouter key for EcoBot |
| `OPENROUTER_BASE_URL` | no | Defaults to the OpenRouter API |
| `OPENROUTER_MODEL` | no | Defaults to `deepseek/deepseek-chat` |

The process refuses to start if a required variable is missing, so a
misconfigured deploy fails immediately instead of erroring on first request.

### Frontend (`frontend/my-react-app/.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | API prefix. Leave as `/api` to use the proxy. |
| `VITE_DEV_API_PROXY_TARGET` | Where the dev server forwards `/api` |

## Keeping the API origin private

The frontend never contains the backend hostname. It calls same-origin `/api/*`
paths, which are forwarded to the real API:

- **Development** — the Vite dev server proxies `/api` (`vite.config.js`).
- **Production** — Netlify proxies `/api/*` at the edge (`netlify.toml`).

To change where production points, edit the redirect in `netlify.toml`; no
frontend code or rebuild logic changes.

## API

All routes except `POST /auth/register` and `POST /auth/login` require an
`Authorization: Bearer <token>` header, and only ever act on the account that
the token belongs to.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Liveness and database status |
| `POST` | `/auth/register` | Create an account (multipart, `Avatar` file) |
| `POST` | `/auth/login` | Exchange credentials for a token |
| `GET` | `/auth/game/:studentId` | Full player record |
| `POST` | `/auth/Xp` | Award XP for a topic |
| `POST` | `/auth/quize/:studentId` | Store a quiz score |
| `GET` | `/auth/wholedata/:studentId` | All eight topic scores |
| `GET` | `/auth/intro/:studentId` | Introduction topic score |
| `GET` | `/auth/convo/:studentId` | Conservation topic score |
| `POST` | `/auth/create/clan/:playerId` | Create a clan (multipart, `avatar` file) |
| `GET` | `/auth/clan/:studentId` | The caller's clan |
| `POST` | `/auth/join` | Join a clan by code |
| `POST` | `/chat` | Ask EcoBot a question |

Errors are always `{ "success": false, "message": "..." }`, with an optional
`errors` array of `{ field, message }` for validation failures.

## Testing and linting

```bash
cd backend
npm test            # 22 integration tests against an in-memory MongoDB
npm run lint

cd frontend/my-react-app
npm run lint
npm run build
```

## Deployment

**Backend (Render).** Root directory `backend`, build `npm install`, start
`npm start`. Set every required variable from the table above in the Render
dashboard. Add the deployed frontend origin to `CORS_ORIGINS`.

**Frontend (Netlify).** `netlify.toml` already declares the base directory,
build command, publish directory, SPA fallback and the `/api` proxy. Update the
proxy target if the backend URL changes.
