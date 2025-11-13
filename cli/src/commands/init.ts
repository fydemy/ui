import inquirer from "inquirer";
import path, { join, resolve } from "path";
import chalk from "chalk";
import type { Command } from "commander";
import { mkdir, writeFile } from "fs/promises";
import { fetchWithTimeout } from "../utils/fetch.js";
import type { InputType } from "../utils/types.js";
import { ASSET_URL } from "../utils/constants.js";
import { exec } from "child_process";

async function promptInitOptions(): Promise<InputType> {
  const answers = await inquirer.prompt<InputType>([
    {
      name: "path",
      type: "input",
      message: "Components path:",
      default: "app/components/ui",
    },
    {
      name: "theme",
      type: "list",
      message: "Theme:",
      default: "trakteer",
      choices: [
        {
          name: "trakteer",
          value: "trakteer",
        },
      ],
    },
    {
      name: "pm",
      type: "list",
      message: "Package manager:",
      default: "npm",
      choices: [
        {
          name: "npm",
          value: "npm",
        },
        {
          name: "pnpm",
          value: "pnpm",
        },
        {
          name: "yarn",
          value: "yarn",
        },
        {
          name: "bun",
          value: "bun",
        },
      ],
    },
  ]);

  return answers;
}

function installPackage(pm: string, pkg: string) {
  return new Promise<void>((resolve, reject) => {
    exec(`${pm} install ${pkg}`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export async function writeConfigFile(configPath: string, payload: InputType) {
  const data = JSON.stringify(payload, null, 2);
  await writeFile(configPath, data, "utf8");
}

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function writeAsset(
  outputDir: string,
  filename: string,
  content: string
) {
  const dest = join(outputDir, filename);
  await writeFile(dest, content, "utf8");
}

export function init(ui: Command) {
  ui.command("init")
    .description("Initialize UI config")
    .action(async () => {
      try {
        const answers = await promptInitOptions();

        const configPath = path.resolve(process.cwd(), "ui.json");
        await writeConfigFile(configPath, answers);
        console.log(`${chalk.green(`✔`)} Adding ${chalk.green("ui.json")}`);

        const url = `${ASSET_URL}/raw/${answers.theme}/index.css`;
        console.log(`${chalk.green(`✔`)} Fetching theme`);
        const res = await fetchWithTimeout(url, 10000);

        if (!res.ok) {
          throw new Error(
            `Failed to fetch ${url}: ${res.status} ${res.statusText}`
          );
        }

        const content = await res.text();

        const outputPath = join(resolve(process.cwd()), answers.path);
        await ensureDir(outputPath);

        await writeAsset(outputPath, "index.css", content);

        await installPackage(answers.pm, "lucide-react");
        console.log(`${chalk.green(`✔`)} Installing dependencies`);

        console.log(
          `\n${chalk.green(
            "Success!"
          )} Project initialization completed.\nYou may now add components`
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`${chalk.red(`✖`)} ${message}`);
        try {
          process.exitCode = 1;
        } catch {}
      }
    });
}
