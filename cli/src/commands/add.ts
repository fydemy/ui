import { Command } from "commander";
import { mkdir, writeFile } from "fs/promises";
import { join, resolve } from "path";
import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { fetchWithTimeout } from "../utils/fetch.js";
import type { InputType } from "../utils/types.js";
import { ASSET_URL, DEFAULT_FILES } from "../utils/constants.js";

function loadConfig(configPath: string): InputType {
  const defaults: InputType = {
    path: "app/components/ui",
    theme: "trakteer",
    pm: "npm",
  };

  if (!existsSync(configPath)) return defaults;

  try {
    const raw = readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<InputType> | null;
    if (!parsed) return defaults;
    return { ...defaults, ...parsed };
  } catch (err) {
    console.warn(chalk.yellow(`Failed to read ${configPath}, using defaults`));
    return defaults;
  }
}

async function writeComponentFiles(
  outputDir: string,
  files: string[],
  fetchBase: (url: string) => Promise<string>,
  mkdirFn = mkdir,
  writeFileFn = writeFile
) {
  await mkdirFn(outputDir, { recursive: true });

  for (const filename of files) {
    try {
      const content = await fetchBase(filename);
      await writeFileFn(join(outputDir, filename), content, "utf8");
      console.log(chalk.green(`Wrote ${join(outputDir, filename)}`));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(chalk.yellow(`Skipping ${filename}: ${msg}`));
    }
  }
}

export async function runAdd(
  name: string,
  options?: {
    cwd?: string;
    assetUrl?: string;
    files?: string[];
    timeoutMs?: number;
  }
) {
  const cwd = options?.cwd ?? process.cwd();
  const configPath = resolve(cwd, "ui.json");
  const config = loadConfig(configPath);

  const files = options?.files ?? DEFAULT_FILES;
  const assetBase = options?.assetUrl ?? ASSET_URL;
  const timeoutMs = options?.timeoutMs ?? 10000;

  const fetchBase = async (filename: string) => {
    const url = `${assetBase}/raw/${config.theme}/${name}/${filename}`;
    const res = await fetchWithTimeout(url, timeoutMs);
    if (!res.ok)
      throw new Error(
        `Failed to fetch ${url}: ${res.status} ${res.statusText}`
      );
    return res.text();
  };

  const outputPath = join(resolve(cwd), `${config.path}/${name}`);
  await writeComponentFiles(outputPath, files, fetchBase);

  return { success: true, outputPath };
}

export function add(program: Command) {
  program
    .command("add <name>")
    .description("Add a new component to your path")
    .action(async (name: string) => {
      try {
        const result = await runAdd(name);
        if (result.success) {
          console.log(
            chalk.blue(`Component ${name} added at ${result.outputPath}`)
          );
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(chalk.red(`Add failed: ${message}`));
        process.exitCode = 1;
      }
    });
}
