import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const dist = join(process.cwd(), 'dist');
const temp = mkdtempSync(join(tmpdir(), 'nuero-alert-gh-pages-'));

try {
  cpSync(dist, temp, { recursive: true });
  execSync('git init', { cwd: temp, stdio: 'inherit' });
  execSync('git add -A', { cwd: temp, stdio: 'inherit' });
  execSync('git commit -m "Deploy site from dist"', { cwd: temp, stdio: 'inherit' });
  execSync('git push -f origin HEAD:gh-pages', {
    cwd: temp,
    stdio: 'inherit',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });
} finally {
  rmSync(temp, { recursive: true, force: true });
}
