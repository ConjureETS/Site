#!/usr/bin/env node
"use strict";

// Local-only admin UI for editing the JSON "message" files that back
// dynamic content (sponsors, events, competitions/games, ...) plus the
// images they point to in /public. Zero npm dependencies on purpose —
// this is dev tooling, not part of the shipped site, so it shouldn't
// grow the app's dependency tree or ever be reachable from a build.
//
// Run with `npm run edit`. Binds to 127.0.0.1 only.

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const { exec } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const MESSAGES_DIR = path.join(ROOT, "src", "messages");
const PUBLIC_DIR = path.join(ROOT, "public");
const EDITOR_PUBLIC_DIR = path.join(__dirname, "public");

const LOCALES = ["fr", "en"];

// Every editable content file + which /public subfolder its uploads go
// in. Add an entry here (and a matching tab in the frontend) to support
// a new content type — nothing else needs to change on the server.
const COLLECTIONS = {
  sponsors: { file: "sponsors.json", uploadDir: "sponsors" },
  events: { file: "events.json", uploadDir: "events" },
  games: { file: "games.json", uploadDir: "games" },
  mediaKit: { file: "mediaKit.json", uploadDir: "conjure" },
};

// Folders the "delete this file too" feature is allowed to touch. This is
// deliberately narrower than the upload allowlist above: sponsors/events/
// games images are only ever referenced from their own JSON, so an unused
// path really is unused. `conjure/` (media kit) is excluded on purpose —
// those logo files are *also* hardcoded straight into React components
// (Navbar, Footer, ...), which this tool has no visibility into, so
// "unreferenced in the JSON" would not mean "safe to delete" there.
const DELETE_ALLOWED_DIRS = new Set(["sponsors", "events", "games"]);

const UPLOAD_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

const PORT = Number(process.env.PORT) || 4747;

function readJson(locale, collectionKey) {
  const { file } = COLLECTIONS[collectionKey];
  const filePath = path.join(MESSAGES_DIR, locale, file);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(locale, collectionKey, data) {
  const { file } = COLLECTIONS[collectionKey];
  const filePath = path.join(MESSAGES_DIR, locale, file);
  const tmpPath = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  fs.renameSync(tmpPath, filePath); // atomic swap, avoids a half-written file on crash
}

// Strips directories and anything that isn't a safe filename char, so a
// crafted `filename` query param can't escape the upload directory.
function sanitizeFilename(name) {
  const base = path.basename(String(name || "")).trim();
  const ext = path.extname(base).toLowerCase();
  if (!UPLOAD_EXTENSIONS.has(ext)) return null;
  const stem = base
    .slice(0, base.length - ext.length)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${stem || "image"}${ext}`;
}

function uniqueFilePath(dir, filename) {
  let candidate = filename;
  let n = 1;
  const ext = path.extname(filename);
  const stem = filename.slice(0, filename.length - ext.length);
  while (fs.existsSync(path.join(dir, candidate))) {
    candidate = `${stem}-${n}${ext}`;
    n += 1;
  }
  return candidate;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8" });
}

function readBody(req, limitBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const STATIC_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

// Serves a file from `baseDir`, refusing to resolve outside of it.
function serveStatic(res, baseDir, relPath) {
  const resolved = path.normalize(path.join(baseDir, relPath));
  if (!resolved.startsWith(path.normalize(baseDir + path.sep)) && resolved !== baseDir) {
    return send(res, 403, "Forbidden");
  }
  fs.readFile(resolved, (err, data) => {
    if (err) return send(res, 404, "Not found");
    const type = STATIC_TYPES[path.extname(resolved).toLowerCase()] || "application/octet-stream";
    send(res, 200, data, { "Content-Type": type });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { pathname, searchParams } = url;

    // --- Content API ---------------------------------------------------
    if (pathname === "/api/content" && req.method === "GET") {
      const key = searchParams.get("collection");
      if (!COLLECTIONS[key]) return sendJson(res, 400, { error: "unknown collection" });
      const result = {};
      for (const locale of LOCALES) result[locale] = readJson(locale, key);
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/content" && req.method === "PUT") {
      const key = searchParams.get("collection");
      if (!COLLECTIONS[key]) return sendJson(res, 400, { error: "unknown collection" });
      const body = await readBody(req, 5 * 1024 * 1024);
      let parsed;
      try {
        parsed = JSON.parse(body.toString("utf8"));
      } catch {
        return sendJson(res, 400, { error: "invalid JSON body" });
      }
      for (const locale of LOCALES) {
        if (!parsed[locale] || typeof parsed[locale] !== "object") {
          return sendJson(res, 400, { error: `missing "${locale}" payload` });
        }
      }
      for (const locale of LOCALES) writeJson(locale, key, parsed[locale]);
      return sendJson(res, 200, { ok: true });
    }

    // --- Image upload ----------------------------------------------------
    // Body is the raw file bytes (no multipart parsing needed) — the
    // frontend POSTs the File object directly as the request body.
    if (pathname === "/api/upload" && req.method === "POST") {
      const dir = searchParams.get("dir");
      const allowedDirs = new Set(Object.values(COLLECTIONS).map((c) => c.uploadDir));
      if (!allowedDirs.has(dir)) return sendJson(res, 400, { error: "unknown upload dir" });
      const filename = sanitizeFilename(searchParams.get("filename"));
      if (!filename) return sendJson(res, 400, { error: "unsupported file type" });

      const targetDir = path.join(PUBLIC_DIR, dir);
      fs.mkdirSync(targetDir, { recursive: true });
      const finalName = uniqueFilePath(targetDir, filename);
      const body = await readBody(req, 15 * 1024 * 1024);
      fs.writeFileSync(path.join(targetDir, finalName), body);
      return sendJson(res, 200, { path: `/${dir}/${finalName}` });
    }

    // --- Delete an orphaned upload -----------------------------------
    // Only reachable for DELETE_ALLOWED_DIRS (see above) — the frontend
    // decides *when* to offer this (an item was removed and nothing else
    // in that collection's JSON points at the file anymore), but the
    // server independently re-enforces which folders may ever be touched.
    if (pathname === "/api/asset" && req.method === "DELETE") {
      const raw = searchParams.get("path") || "";
      const segments = raw.split("/").filter(Boolean);
      const dir = segments[0];
      const filename = path.basename(segments.slice(1).join("/")); // strips any ".." traversal
      if (!DELETE_ALLOWED_DIRS.has(dir) || !filename) {
        return sendJson(res, 400, { error: "suppression non autorisée pour ce dossier" });
      }
      const targetDir = path.join(PUBLIC_DIR, dir);
      const filePath = path.join(targetDir, filename);
      if (!filePath.startsWith(targetDir + path.sep)) {
        return sendJson(res, 400, { error: "chemin invalide" });
      }
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        if (err.code !== "ENOENT") return sendJson(res, 500, { error: "échec de la suppression du fichier" });
        // Already gone — same end state as a successful delete.
      }
      return sendJson(res, 200, { ok: true });
    }

    // --- Serve the real /public folder read-only, so the editor can
    // preview existing and freshly-uploaded images. ----------------------
    if (pathname.startsWith("/site/")) {
      return serveStatic(res, PUBLIC_DIR, pathname.slice("/site/".length));
    }

    // --- Editor's own static assets --------------------------------------
    if (req.method === "GET") {
      const rel = pathname === "/" ? "index.html" : pathname.slice(1);
      return serveStatic(res, EDITOR_PUBLIC_DIR, rel);
    }

    send(res, 404, "Not found");
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "internal error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log(`\nÉditeur de contenu Conjure lancé sur ${url}`);
  console.log("Local uniquement — les modifications s'écrivent directement dans src/messages et public/. Ctrl+C pour arrêter.\n");

  const openCmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${openCmd} ${url}`, () => {}); // best-effort; fine if there's no browser to open
});
