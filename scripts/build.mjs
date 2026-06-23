import { existsSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const distDir = resolve('dist');
const backgroundVideo = resolve('dist', 'videos', 'back.mp4');

// Do not allow a restored CI cache to leave an old static asset in dist.
rmSync(distDir, { recursive: true, force: true });

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const build = spawnSync(npx, ['vite', 'build'], { stdio: 'inherit' });

if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

if (!existsSync(backgroundVideo)) {
  console.error('[verify] Missing required file: dist/videos/back.mp4');
  process.exit(1);
}

const sizeMiB = statSync(backgroundVideo).size / 1024 / 1024;
console.log(`[verify] dist/videos/back.mp4: ${sizeMiB.toFixed(2)} MiB`);

if (sizeMiB > 24) {
  console.error('[verify] Background video exceeds Cloudflare’s 25 MiB asset limit.');
  process.exit(1);
}
