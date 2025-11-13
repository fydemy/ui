import { Command } from "commander";
import { mkdir, writeFile } from "fs/promises";
import path, { join, resolve } from "path";
import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { fetchWithTimeout } from "../utils/fetch.js";
import type { InputType } from "../utils/types.js";
import { ASSET_URL, DEFAULT_FILES, TIMEOUTMS } from "../utils/constants.js";
import { writeConfigFile } from "./init.js";
import inquirer from "inquirer";

async function loadConfig(configPath: string): Promise<InputType> {
  const defaults: InputType = {
    path: "app/components/ui",
    theme: "trakteer",
    pm: "npm",
  };

  if (!existsSync(configPath)) {
    await writeConfigFile(configPath, defaults);
    console.log(`${chalk.yellow(`ℹ`)} Added default ui.json`);
    return defaults;
  }

  const parsed = JSON.parse(
    readFileSync(configPath, "utf-8")
  ) as Partial<InputType> | null;

  return { ...defaults, ...parsed };
}

async function writeComponentFiles(
  outputDir: string,
  files: string[],
  fetchBase: (url: string) => Promise<string>,
  mkdirFn = mkdir,
  writeFileFn = writeFile
) {
  const fileContents: Record<string, string> = {};

  for (const filename of files) {
    try {
      fileContents[filename] = await fetchBase(filename);
    } catch (err) {
      throw new Error(`Component not found`);
    }
  }

  if (existsSync(outputDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `Overwrite ${path.relative(process.cwd(), outputDir)}?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      return false;
    }
  }

  await mkdirFn(outputDir, { recursive: true });

  for (const filename of files) {
    await writeFileFn(
      join(outputDir, filename),
      fileContents[filename]!,
      "utf8"
    );
  }

  return true;
}

export async function runAdd(
  name: string,
  config: InputType,
  options: {
    assetUrl: string;
    files: string[];
    timeoutMs: number;
  }
) {
  const { assetUrl, files, timeoutMs } = options;

  const fetchBase = async (filename: string) => {
    const url = `${assetUrl}/raw/${config.theme}/${name}/${filename}`;
    const res = await fetchWithTimeout(url, timeoutMs);

    if (!res.ok) {
      throw new Error("Not found");
    }

    return res.text();
  };

  const outputPath = join(resolve(process.cwd()), `${config.path}/${name}`);
  const success = await writeComponentFiles(outputPath, files, fetchBase);

  return { success, outputPath };
}

export function add(program: Command) {
  program
    .command("add <names...>")
    .description("Add a new component to your path")
    .action(async (names: string[]) => {
      const config = await loadConfig(resolve(process.cwd(), "ui.json"));

      for (const name of names) {
        try {
          const result = await runAdd(name, config, {
            assetUrl: ASSET_URL,
            timeoutMs: TIMEOUTMS,
            files: DEFAULT_FILES,
          });

          if (result.success) {
            console.log(
              `${chalk.green(`✔`)} Added ${path.relative(
                process.cwd(),
                result.outputPath
              )}`
            );
          } else {
            console.error(`${chalk.yellow(`⚠`)} Skipping ${name}`);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`${chalk.red(`✖`)} ${message}`);
        }
      }
    });
}
