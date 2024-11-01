#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const command_docs_1 = require("./command-docs");
const command_nav_1 = require("./command-nav");
const command_component_1 = require("./command-component");
const program = new commander_1.Command();
const package_json_1 = __importDefault(require("@/package.json"));
const displayAsciiArt = () => {
    console.log(chalk_1.default.yellow(figlet_1.default.textSync("KOKSMAT WEB", { horizontalLayout: "full" })));
};
const displayVersionInfo = () => {
    console.log(chalk_1.default.cyan(`Version: ${package_json_1.default.version}`));
    //console.log(chalk.cyan(`Description: ${packageJson.description}`));
};
program
    .name("koksmat-web")
    .description("CLI for Koksmat web operations")
    .version("1.0.0")
    .option("-p, --path <path>", "Path to the app", ".")
    .option("-v, --verbose", "Enable verbose output", false)
    .option("-f, --force", "Force overwrite existing documentation", false)
    .option("-o, --output <format>", "Output format (chalk or json)", "chalk");
(0, command_docs_1.setupDocsCommand)(program);
(0, command_nav_1.setupNavCommand)(program);
(0, command_component_1.setupComponentCommand)(program);
// If no command is provided, show ASCII art and help
if (!process.argv.slice(2).length) {
    displayAsciiArt();
    displayVersionInfo();
    console.log("\n");
    program.outputHelp();
}
else {
    program.parse(process.argv);
}
