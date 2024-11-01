"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentManager = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const js_yaml_1 = __importDefault(require("js-yaml"));
class ComponentManager {
    constructor(appPath) {
        this.appPath = appPath;
        this.componentsPath = path_1.default.join(appPath, "components");
    }
    async listComponents() {
        try {
            const files = await promises_1.default.readdir(this.componentsPath);
            return files.filter((file) => file.endsWith(".tsx"));
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error listing components: ${error.message}`);
            }
            throw new Error("Unknown error occurred while listing components");
        }
    }
    async createComponent(name) {
        const componentPath = path_1.default.join(this.componentsPath, `${name}.tsx`);
        const componentContent = `
import React from 'react';

export const ${name}: React.FC = () => {
  return (
    <div>
      <h1>${name} Component</h1>
    </div>
  );
};
`;
        try {
            await promises_1.default.writeFile(componentPath, componentContent);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error creating component: ${error.message}`);
            }
            throw new Error("Unknown error occurred while creating component");
        }
    }
    async selectComponents() {
        const components = await this.listComponents();
        const { selectedComponents } = await inquirer_1.default.prompt([
            {
                type: "checkbox",
                name: "selectedComponents",
                message: "Select components:",
                choices: components,
            },
        ]);
        return selectedComponents;
    }
    async exportComponent(name) {
        const componentPath = path_1.default.join(this.componentsPath, `${name}.tsx`);
        const exportPath = path_1.default.join(this.appPath, "exports", `${name}.yaml`);
        try {
            const content = await promises_1.default.readFile(componentPath, "utf-8");
            const yamlContent = js_yaml_1.default.dump({ name, content });
            await promises_1.default.mkdir(path_1.default.dirname(exportPath), { recursive: true });
            await promises_1.default.writeFile(exportPath, yamlContent);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error exporting component: ${error.message}`);
            }
            throw new Error("Unknown error occurred while exporting component");
        }
    }
    async importComponent(sourceFile) {
        try {
            const yamlContent = await promises_1.default.readFile(sourceFile, "utf-8");
            const { name, content } = js_yaml_1.default.load(yamlContent);
            const componentPath = path_1.default.join(this.componentsPath, `${name}.tsx`);
            await promises_1.default.writeFile(componentPath, content);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error importing component: ${error.message}`);
            }
            throw new Error("Unknown error occurred while importing component");
        }
    }
}
exports.ComponentManager = ComponentManager;
