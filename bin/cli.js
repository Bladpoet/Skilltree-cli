#!/usr/bin/env node
import { createServer } from "node:http";
import { readFile, mkdtemp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { exec, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..");
const distDir = path.join(pkgRoot, "dist");
const generateScript = path.join(pkgRoot, "generate.js");

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

function openBrowser(url) {
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) {
      console.log(`  Could not open browser automatically. Visit: ${url}`);
    }
  });
}

async function findFreePort(start = 7842) {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(start, "localhost", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on("error", () => resolve(findFreePort(start + 1)));
  });
}

async function runScanner(outputPath, iconsDir) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [generateScript, "--output", outputPath, "--icons-dir", iconsDir],
      { stdio: "inherit" }
    );
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Scanner exited with code ${code}`));
      }
    });
    child.on("error", reject);
  });
}

async function serveFile(res, filePath) {
  try {
    const content = await readFile(filePath);
    res.writeHead(200, { "Content-Type": getMime(filePath) });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

async function main() {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "skill-tree-"));
  const skillsJsonPath = path.join(tmpDir, "skills.json");
  const iconsDir = path.join(tmpDir, "skill-icons");
  await mkdir(iconsDir, { recursive: true });

  console.log("\n  Skill Tree\n");
  console.log("  Scanning skills...");

  try {
    await runScanner(skillsJsonPath, iconsDir);
  } catch (err) {
    console.error(`\n  Scanner failed: ${err.message}`);
    process.exit(1);
  }

  const port = await findFreePort();
  const url = `http://localhost:${port}`;

  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);

    if (urlPath === "/skills.json") {
      return serveFile(res, skillsJsonPath);
    }

    if (urlPath.startsWith("/skill-icons/")) {
      const iconFile = path.basename(urlPath);
      return serveFile(res, path.join(iconsDir, iconFile));
    }

    // Static files from dist
    const relativePath = urlPath === "/" ? "index.html" : urlPath.slice(1);
    const filePath = path.join(distDir, relativePath);

    // SPA fallback — serve index.html for any path that doesn't resolve to a file
    if (!existsSync(filePath) || !path.extname(filePath)) {
      return serveFile(res, path.join(distDir, "index.html"));
    }

    return serveFile(res, filePath);
  });

  server.listen(port, "localhost", () => {
    console.log(`  Ready at ${url}\n`);
    openBrowser(url);
  });

  process.on("SIGINT", () => {
    server.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
