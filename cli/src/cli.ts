#!/usr/bin/env node

import { Command } from "commander";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";

const program = new Command();

program
  .name("@fydemy/ui")
  .description("a lightweight UI-kit library.")
  .version("0.1.1", "-v, --version", "output the version number");

init(program);
add(program);

program.parse(process.argv);
