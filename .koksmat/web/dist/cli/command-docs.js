"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDocsCommand = void 0;
const path_1 = __importDefault(require("path"));
const documentation_manager_1 = require("./documentation-manager");
const output_formatters_1 = require("./output-formatters");
function setupDocsCommand(program) {
    const docs = program
        .command("docs")
        .description("Documentation related commands");
    docs
        .command("generate")
        .description("Generate documentation for components")
        .option("-c, --component <name>", "Generate documentation for a specific component")
        .action(async (options) => {
        const appPath = path_1.default.resolve(program.opts().path);
        const verbose = program.opts().verbose;
        const force = program.opts().force;
        const outputFormat = program.opts().output.toLowerCase();
        const componentName = options.component;
        let formatter;
        if (outputFormat === "json") {
            formatter = new output_formatters_1.JsonFormatter();
        }
        else {
            formatter = new output_formatters_1.ChalkFormatter();
        }
        const docManager = new documentation_manager_1.DocumentationManager(appPath, verbose, force, formatter);
        try {
            if (componentName) {
                await docManager.generateDocumentation(componentName);
            }
            else {
                await docManager.generateDocumentation();
            }
            if (outputFormat === "json") {
                console.log(formatter.formatOutput());
            }
        }
        catch (error) {
            if (error instanceof Error) {
                formatter.error(`Error: ${error.message}`);
            }
            else {
                formatter.error("An unknown error occurred");
            }
            if (outputFormat === "json") {
                console.log(formatter.formatOutput());
            }
            process.exit(1);
        }
    });
    docs
        .command("check <componentName>")
        .description("Check if documentation needs updating for a specific component")
        .action(async (componentName, options) => {
        const appPath = path_1.default.resolve(program.opts().path);
        const verbose = program.opts().verbose;
        const force = program.opts().force;
        const outputFormat = program.opts().output.toLowerCase();
        let formatter;
        if (outputFormat === "json") {
            formatter = new output_formatters_1.JsonFormatter();
        }
        else {
            formatter = new output_formatters_1.ChalkFormatter();
        }
        const docManager = new documentation_manager_1.DocumentationManager(appPath, verbose, force, formatter);
        try {
            const needsUpdate = await docManager.checkIfDocumentationNeedsUpdate(componentName);
            if (needsUpdate) {
                formatter.warn(`Documentation for ${componentName} needs updating.`);
            }
            else {
                formatter.success(`Documentation for ${componentName} is up to date.`);
            }
            if (outputFormat === "json") {
                console.log(formatter.formatOutput());
            }
        }
        catch (error) {
            if (error instanceof Error) {
                formatter.error(`Error: ${error.message}`);
            }
            else {
                formatter.error("An unknown error occurred");
            }
            if (outputFormat === "json") {
                console.log(formatter.formatOutput());
            }
            process.exit(1);
        }
    });
    docs
        .command("list")
        .description("List all components and their documentation status")
        .action(async () => {
        const appPath = path_1.default.resolve(program.opts().path);
        const verbose = program.opts().verbose;
        const force = program.opts().force;
        const outputFormat = program.opts().output.toLowerCase();
        let formatter;
        if (outputFormat === "json") {
            formatter = new output_formatters_1.JsonFormatter();
        }
        else {
            formatter = new output_formatters_1.ChalkFormatter();
        }
        const docManager = new documentation_manager_1.DocumentationManager(appPath, verbose, force, formatter);
        try {
            const components = await docManager.listComponents();
            for (const component of components) {
                if (component.metadata) {
                    formatter.log(`${component.metadata.displayName}: ${component.hasDocumentation ? "Documented" : "Not documented"}`);
                }
                else {
                    formatter.warn(`${component.filename}: No metadata found`);
                }
            }
            if (outputFormat === "json") {
                console.log(formatter.formatOutput());
            }
        }
        catch (error) {
            if (error instanceof Error) {
                formatter.error(`Error: ${error.message}`);
            }
            else {
                formatter.error("An unknown error occurred");
            }
            if (outputFormat === "json") {
                console.log(formatter.formatOutput());
            }
            process.exit(1);
        }
    });
}
exports.setupDocsCommand = setupDocsCommand;