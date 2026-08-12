import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import koffi from 'koffi';

// binding.gyp pins product_extension to "so" on every platform, so the name is
// the same regardless of host.
const releaseDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'build', 'Release');

export default function load(name) {
  const file = join(releaseDir, `${name}.so`);
  if (!existsSync(file)) {
    throw new Error(`${file} not found — run \`make build\`, or \`make docker/run/build\` if GTK3 is not installed`);
  }
  return koffi.load(file);
}
