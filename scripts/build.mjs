import { existsSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const distDir = resolve('dist');
const backgroundVideo = resolve('dist', 'videos', 'back.mp4');
const viteCli = resolve('node_modules', 'vite', 'bin', 'vite.js');

rmSync(distDir, { recursive: true, force: true });
execFileSync(process.execPath, [viteCli, 'build'], { stdio: 'inherit' });

if (!existsSync(backgroundVideo)) {
  throw new Error('Missing required file: dist/videos/back.mp4');
}

const sizeMiB = statSync(backgroundVideo).size / 1024 / 1024;
console.log(`[verify] dist/videos/back.mp4: ${sizeMiB.toFixed(2)} MiB`);

if (sizeMiB > 24) {
  throw new Error('Background video exceeds Cloudflare’s 25 MiB asset limit.');
}
