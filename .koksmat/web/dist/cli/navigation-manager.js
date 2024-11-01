"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNavigationManager = exports.NavigationManager = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const nav_menu_1 = require("./nav-menu");
const ProjectHandler_1 = require("./ProjectHandler");
class NavigationManager {
    constructor(appPath, type) {
        this.appPath = appPath;
        this.metadataPath = path_1.default.join(appPath, "metadata");
        this.handler = this.createHandler(type);
    }
    createHandler(type) {
        switch (type) {
            case "menu":
                return new nav_menu_1.MenuHandler();
            case "project":
                return new ProjectHandler_1.ProjectHandler();
            default:
                throw new Error(`Unsupported navigation type: ${type}`);
        }
    }
    async exportData(targetFile = "navigation.yaml") {
        try {
            const data = await this.handler.exportNodes();
            const yamlContent = js_yaml_1.default.dump(data);
            await promises_1.default.mkdir(this.metadataPath, { recursive: true });
            const targetPath = path_1.default.join(this.metadataPath, targetFile);
            await promises_1.default.writeFile(targetPath, yamlContent, "utf-8");
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error exporting data to YAML: ${error.message}`);
            }
            throw new Error("Unknown error occurred while exporting data to YAML");
        }
    }
    async importData(sourceFile = "navigation.yaml") {
        try {
            const sourcePath = path_1.default.join(this.metadataPath, sourceFile);
            const yamlContent = await promises_1.default.readFile(sourcePath, "utf-8");
            const nodes = js_yaml_1.default.load(yamlContent);
            await this.handler.importNodes(nodes);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error importing data from YAML: ${error.message}`);
            }
            throw new Error("Unknown error occurred while importing data from YAML");
        }
    }
}
exports.NavigationManager = NavigationManager;
function createNavigationManager(type, appPath) {
    return new NavigationManager(appPath, type);
}
exports.createNavigationManager = createNavigationManager;
