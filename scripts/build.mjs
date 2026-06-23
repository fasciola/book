import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const sourceCommit = '1e7b544a3477d5f9e667bd82b5eaee51f20f88c7';
const translatedSources = [
  'assets/books/book-fr.docx.b64',
  'assets/books/book-de.docx.b64',
  'assets/books/book-ru.docx.b64',
  'assets/books/book-zh.docx.b64',
  'assets/books/book-nl.docx.b64',
  'assets/books/book-sw.docx.b64'
];

function sourceFromHistory(file) {
  const ref = `${sourceCommit}:${file}`;
  try {
    return execFileSync('git', ['show', ref]);
  } catch {
    execFileSync('git', ['fetch', '--no-tags', '--depth=1', 'origin', sourceCommit], { stdio: 'inherit' });
    return execFileSync('git', ['show', ref]);
  }
}

for (const file of translatedSources) {
  if (existsSync(file)) continue;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, sourceFromHistory(file));
  console.log(`[sources] Restored ${file}`);
}

const distDir = resolve('dist');
const backgroundVideo = resolve('dist', 'videos', 'back.mp4');
const viteCli = resolve('node_modules', 'vite', 'bin', 'vite.js');

rmSync(distDir, { recursive: true, force: true });
execFileSync(process.execPath, [viteCli, 'build'], { stdio: 'inherit' });

if (!existsSync(backgroundVideo)) throw new Error('Missing required file: dist/videos/back.mp4');

const sizeMiB = statSync(backgroundVideo).size / 1024 / 1024;
console.log(`[verify] dist/videos/back.mp4: ${sizeMiB.toFixed(2)} MiB`);

if (sizeMiB > 24) throw new Error('Background video exceeds Cloudflare’s 25 MiB asset limit.');
