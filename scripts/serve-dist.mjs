#!/usr/bin/env node
/**
 * Serves dist/ with the production headers actually attached.
 *
 * The test suite used to run against a plain static server, which sends no
 * Content-Security-Policy. That made a whole class of bug invisible: the CSP
 * says `script-src 'self'`, which blocks inline scripts outright, and the site
 * emits four of them. In production the mobile menu never opened, the theme
 * was never restored from storage and the error logger never ran — and 297
 * tests were green throughout.
 *
 * Reading the headers out of the generated .htaccess rather than repeating
 * them here means the tests exercise whatever the server will actually send.
 */
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const htaccess = readFileSync(join(dist, '.htaccess'), 'utf8');

/** Every `Header always set X "Y"` in the generated file. */
const headers = Object.fromEntries(
  [...htaccess.matchAll(/Header always set ([\w-]+) "([^"]+)"/g)].map((m) => [m[1], m[2]])
);

/**
 * One directive cannot come over for the ride: `upgrade-insecure-requests`.
 *
 * This server is http://localhost, and that directive tells the browser to
 * re-request every subresource over https. Chromium exempts localhost from it;
 * WebKit does not, so on the mobile project every stylesheet, script and font
 * was re-requested as https://localhost:4321 and failed with "A TLS error
 * caused the secure connection to fail."
 *
 * That is why the entire mobile project was failing: pages that assert a clean
 * console failed on the errors, and every test that needs the CSS or the JS to
 * have loaded — the theme, the mobile menu, the checks, the intake — failed
 * because none of it had. It was invisible for two reasons at once: CI died at
 * `astro check` before reaching the tests, and locally the failures print above
 * the summary counts where they are easy to mistake for a list of skips.
 *
 * Stripping it is correct rather than a workaround. On https://sgualda.com the
 * directive is a no-op — everything is already https — so removing it here
 * makes the test environment match production behaviour instead of diverging
 * from it. Every other directive is kept exactly as generated, which is the
 * whole point of this file.
 */
if (headers['Content-Security-Policy']) {
  headers['Content-Security-Policy'] = headers['Content-Security-Policy']
    .split(';')
    .map((d) => d.trim())
    .filter((d) => d && d !== 'upgrade-insecure-requests')
    .join('; ');
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain',
  '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
};

http
  .createServer((req, res) => {
    let path = join(dist, decodeURIComponent(req.url.split('?')[0]));
    if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
    if (!existsSync(path) || !statSync(path).isFile()) {
      const notFound = join(dist, '404.html');
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8', ...headers });
      return res.end(existsSync(notFound) ? readFileSync(notFound) : 'Not found');
    }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream', ...headers });
    res.end(readFileSync(path));
  })
  .listen(process.env.PORT ?? 4321);
