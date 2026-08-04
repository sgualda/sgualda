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
