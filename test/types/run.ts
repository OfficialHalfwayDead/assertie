import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

import typescript from 'typescript';

function atLeast(versionMajorMinor: `${number}.${number}`, major: number, minor?: number): boolean {
  const [verMajor, verMinor] = versionMajorMinor.split('.').map(Number);
  return verMajor > major || (verMajor === major && (minor === undefined || verMinor >= minor));
}

const atLeast5 = atLeast(typescript.versionMajorMinor, 5);
if (!atLeast5) {
  console.log(`TypeScript < 5.0 detected, skipping incompatible type tests.`);
}
const tsconfigPath = atLeast5
  ? 'test/types/tsconfig.json'
  : 'test/types/tsconfig.4.x.json';
console.log(`Running tests based on ${tsconfigPath}`);

const require = createRequire(import.meta.url);
const tscPath = require.resolve('typescript/lib/tsc.js');
const result = spawnSync(process.execPath, [tscPath, '-p', tsconfigPath], { stdio: 'inherit' });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
