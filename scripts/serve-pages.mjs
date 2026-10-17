// Serves dist/ the way GitHub Pages does, so e2e tests cover the real deep-link behaviour:
// static files under /read-books/, and 404.html (with status 404) for anything that isn't a file.
// Unlike `vite preview`, there is no built-in SPA fallback to index.html.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const BASE = '/read-books/';
const ROOT = resolve('dist');
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
};

async function fileFor(urlPath) {
  if (!urlPath.startsWith(BASE)) return undefined;
  let relative = decodeURIComponent(urlPath.slice(BASE.length));
  if (relative === '' || relative.endsWith('/')) relative += 'index.html';
  const path = normalize(join(ROOT, relative));
  if (!path.startsWith(ROOT)) return undefined;
  try {
    return (await stat(path)).isFile() ? path : undefined;
  } catch {
    return undefined;
  }
}

function send(res, status, path) {
  res.writeHead(status, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(res);
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  if (pathname === '/read-books') {
    res.writeHead(301, { location: BASE });
    res.end();
    return;
  }
  const file = await fileFor(pathname);
  if (file) send(res, 200, file);
  else send(res, 404, join(ROOT, '404.html'));
}).listen(PORT, () => {
  console.log(`GitHub Pages simulation: http://localhost:${String(PORT)}${BASE}`);
});
