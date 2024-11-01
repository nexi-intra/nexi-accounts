"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNavCommand = void 0;
const path_1 = __importDefault(require("path"));
const navigation_manager_1 = require("./navigation-manager");
const output_formatters_1 = require("./output-formatters");
function setupNavCommand(program) {
    const nav = program.command("nav").description("Navigation related commands");
    nav
        .command("export <type>")
        .description("Export navigation to YAML file")
        .option("-f, --file <file>", "Name of the YAML file", "navigation.yaml")
        .action(async (type, options) => {
        const appPath = path_1.default.resolve(program.opts().path);
        const verbose = program.opts().verbose;
        const outputFormat = program.opts().output.toLowerCase();
        const formatter = outputFormat === "json" ? new output_formatters_1.JsonFormatter() : new output_formatters_1.ChalkFormatter();
        try {
            const manager = (0, navigation_manager_1.createNavigationManager)(type, appPath);
            if (verbose) {
                formatter.info(`Exporting ${type} navigation...`);
                formatter.info(`App path: ${appPath}`);
                formatter.info(`Output file: ${options.file}`);
            }
            await manager.exportData(options.file);
            if (verbose) {
                formatter.info(`Export completed successfully.`);
            }
            formatter.success(`${type} navigation exported to metadata/${options.file}`);
            if (outputFormat === "json") {
                console.log(formatter.formatOutput());
            }
        }
        catch (error) {
            handleError(error, formatter, outputFormat, verbose);
        }
    });
    nav
        .command("import <type>")
        .description("Import navigation from YAML file")
        .option("-f, --file <file>", "Name of the YAML file", "navigation.yaml")
        .action(async (type, options) => {
        const appPath = path_1.default.resolve(program.opts().path);
        const verbose = program.opts().verbose;
        const outputFormat = program.opts().output.toLowerCase();
        const formatter = outputFormat === "json" ? new output_formatters_1.JsonFormatter() : new output_formatters_1.ChalkFormatter();
        try {
            const manager = (0, navigation_manager_1.createNavigationManager)(type, appPath);
            if (verbose) {
                formatter.info(`Importing ${type} navigation...`);
                formatter.info(`App path: ${appPath}`);
                formatter.info(`Input file: ${options.file}`);
            }
            await manager.importData(options.file);
            if (verbose) {
                formatter.info(`Import completed successfully.`);
            }
            formatter.success(`${type} navigation imported from metadata/${options.file}`);
            if (outputFormat === "json") {
                console.log(formatter.formatOutput());
            }
        }
        catch (error) {
            handleError(error, formatter, outputFormat, verbose);
        }
    });
}
exports.setupNavCommand = setupNavCommand;
function handleError(error, formatter, outputFormat, verbose) {
    if (error instanceof Error) {
        formatter.error(`Error: ${error.message}`);
        if (verbose) {
            formatter.info(`Error stack: ${error.stack}`);
        }
    }
    else {
        formatter.error("An unknown error occurred");
    }
    if (outputFormat === "json") {
        console.log(formatter.formatOutput());
    }
    process.exit(1);
}
