# hentai.tv search proxy

The app is hosted on GitHub Pages, so it cannot add CORS headers to responses
from `hentai.tv`. This read-only Worker forwards only `GET /api/search?q=...`
to the fixed hentai.tv search endpoint and returns the JSON with CORS enabled
for the app's production origin and local Vite development origin.

## Deploy

From this directory, deploy the Worker with Wrangler:

```sh
npx wrangler deploy
```

After deployment, the app uses the Worker URL ending in `/api/` as the local
fallback. To override it, set the Gist endpoint named `hentaiTvProxy` to that
URL, for example `https://<worker-name>.<account>.workers.dev/api/`. The app
appends `search?q=...` to this base URL. The endpoint value in the Gist manifest
must use the same base64 encoding as the other endpoint values.

To produce the encoded value from the repository root:

```sh
npm run encode:endpoint -- "https://<worker-name>.<account>.workers.dev/api/"
```
