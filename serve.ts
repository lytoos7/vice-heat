// Vice Heat — local static server (Node 22+, zero dependencies).
// Serves the game locally at http://localhost:8080 via: node serve.ts
// Note: main.ts is the competition hand-in entry; serve.ts is only for local play.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here: string = path.dirname(fileURLToPath(import.meta.url));
const root: string = path.join(here, "game");
const port: number = Number(process.env.PORT || process.argv[2] || 8080);

const mime: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let rel = path.normalize(urlPath).replace(/^([/\\])+/, "");
    if (rel === "" || rel.endsWith("/") || rel.endsWith("\\")) rel += "index.html";
    const file = path.join(root, rel);
    if (!file.startsWith(root)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
        return;
      }
      res.writeHead(200, {
        "content-type": mime[path.extname(file).toLowerCase()] || "application/octet-stream",
        "cache-control": "no-store",
      });
      res.end(data);
    });
  } catch {
    res.writeHead(400).end("Bad request");
  }
});

server.listen(port, () => {
  console.log(`=== Vice Heat (Port Solana) listening on port ${port} ===`);
  console.log(`http://localhost:${port}/`);
});
