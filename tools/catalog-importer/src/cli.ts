import path from 'node:path';

import { DEFAULT_OUTPUT_DIR, REPO_ROOT } from './config.js';
import { runImportPipeline } from './pipeline.js';

function readFlag(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  return args[index + 1];
}

function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const categoriesRaw = readFlag(args, '--category') ?? readFlag(args, '-c');
  const outputDir =
    readFlag(args, '--out') ??
    readFlag(args, '-o') ??
    DEFAULT_OUTPUT_DIR;
  const concurrencyRaw = readFlag(args, '--concurrency');

  await runImportPipeline({
    categories: categoriesRaw
      ? categoriesRaw.split(',').map((value) => value.trim()).filter(Boolean)
      : undefined,
    outputDir: path.isAbsolute(outputDir)
      ? outputDir
      : path.join(REPO_ROOT, outputDir),
    concurrency: concurrencyRaw ? Number(concurrencyRaw) : 4,
    skipAi: hasFlag(args, '--skip-ai'),
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
