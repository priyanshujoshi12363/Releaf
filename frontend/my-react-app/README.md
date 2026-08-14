# ReLeaf — frontend

React + Vite single-page app. See the [root README](../../README.md) for the
full project setup.

```bash
npm install
cp .env.example .env
npm run dev      # http://localhost:5173
```

## Talking to the API

Components never call `fetch` directly. Everything goes through `src/api/`:

| File | Responsibility |
| --- | --- |
| `client.js` | Base URL, auth header, JSON parsing, error normalisation |
| `index.js` | One named function per endpoint |
| `session.js` | Reading and clearing the stored token and user |

```jsx
import { getPlayer, addXp } from "../api/index.js";

const player = await getPlayer();
await addXp({ xp: 20, topic: "climate" });
```

The base URL comes from `VITE_API_BASE_URL` and defaults to `/api`, which is
proxied to the backend (dev server in development, Netlify at the edge in
production). The backend hostname never appears in the bundle.

Failed requests throw an `ApiError` carrying `.message` (safe to show a user)
and `.status`. A `401` on any authenticated route clears the session and returns
to the login screen.

## Scripts

```bash
npm run dev       # dev server with /api proxy
npm run build     # production build to dist/
npm run preview   # serve the build, proxy included
npm run lint      # eslint
```
