"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationManager = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const output_formatters_1 = require("./output-formatters");
class DocumentationManager {
    constructor(appPath, verbose = false, force = false, formatter = new output_formatters_1.ChalkFormatter()) {
        this._appPath = appPath;
        this._verbose = verbose;
        this._force = force;
        this._componentsPath = path_1.default.join(appPath, "components");
        this._appShortName = ""; // This will be set in the initialize method
        this._docsPath = ""; // This will be set in the initialize method
        this._formatter = formatter;
        // Call initialize in the constructor
        this.initialize().catch((error) => {
            this._formatter.error(`Failed to initialize DocumentationManager: ${error}`);
        });
    }
    async initialize() {
        try {
            this._appShortName = await this.getAppName();
            this._docsPath = path_1.default.join(this._appPath, "app", this._appShortName, "docs", "components");
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to initialize DocumentationManager: ${error.message}`);
            }
            else {
                throw new Error("Failed to initialize DocumentationManager: Unknown error");
            }
        }
    }
    async getAppName() {
        const globalFilePath = path_1.default.join(this._appPath, "app", "global.ts");
        try {
            const content = await promises_1.default.readFile(globalFilePath, "utf-8");
            const match = content.match(/export const APPNAME = ["'](.+)["']/);
            if (match && match[1]) {
                return match[1];
            }
            else {
                throw new Error("APPNAME constant not found in global.ts");
            }
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT") {
                throw new Error("global.ts file not found");
            }
            throw error;
        }
    }
    get componentsPath() {
        return this._componentsPath;
    }
    get docsPath() {
        return this._docsPath;
    }
    set componentsPath(value) {
        this._componentsPath = value;
    }
    _log(message) {
        if (this._verbose) {
            this._formatter.log(message);
        }
    }
    async listComponents() {
        const componentFiles = await promises_1.default.readdir(this._componentsPath);
        const componentInfos = await Promise.all(componentFiles
            .filter((file) => file.endsWith(".tsx"))
            .map(async (file) => {
            const fullPath = path_1.default.join(this._componentsPath, file);
            const content = await promises_1.default.readFile(fullPath, "utf-8");
            const metadata = this._extractComponentMetadata(content);
            const docPath = this._getDocPath(metadata === null || metadata === void 0 ? void 0 : metadata.suggestedFilename);
            const hasDocumentation = await promises_1.default
                .stat(docPath)
                .then(() => true)
                .catch(() => false);
            return {
                fullPath,
                filename: file,
                metadata,
                hasDocumentation,
            };
        }));
        return componentInfos;
    }
    _extractComponentMetadata(content) {
        const suggestedFilename = this._extractValue(content, "SUGGESTED_FILE");
        const displayName = this._extractValue(content, "SUGGESTED_DISPLAYNAME");
        const exampleFunctionName = this._extractExampleFunctionName(content);
        if (suggestedFilename && displayName && exampleFunctionName) {
            return {
                suggestedFilename,
                displayName,
                exampleFunctionName,
            };
        }
        return null;
    }
    _extractValue(content, key) {
        const regex = new RegExp(`export const ${key} = ['"](.+)['"]`);
        const match = content.match(regex);
        return match ? match[1] : null;
    }
    _extractExampleFunctionName(content) {
        const match = content.match(/export const (\w+):\s*ComponentDoc\[\]/);
        return match ? match[1] : null;
    }
    _getDocPath(suggestedFilename) {
        if (!suggestedFilename)
            return this._docsPath;
        const folderName = suggestedFilename
            .replace(/\.[^/.]+$/, "") // Remove file extension
            .replace(/([A-Z])/g, (match, p1, offset) => (offset > 0 ? "-" : "") + p1.toLowerCase()); // Convert camelCase to kebab-case
        return path_1.default.join(this._docsPath, folderName);
    }
    async _createDocumentationPage(component, sourceFilename) {
        const componentName = path_1.default.parse(sourceFilename).name;
        const docContent = `
'use client';

import React from 'react';
import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { ${component.exampleFunctionName} } from '@/components/${componentName}';

export default function ${component.displayName.replace(/\s+/g, "")}Documentation() {
  const componentDocs: ComponentDoc[] = [
    ...${component.exampleFunctionName}
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
}
`;
        const docPath = this._getDocPath(component.suggestedFilename);
        await promises_1.default.mkdir(docPath, { recursive: true });
        const filePath = path_1.default.join(docPath, "page.tsx");
        try {
            const fileExists = await promises_1.default
                .stat(filePath)
                .then(() => true)
                .catch(() => false);
            if (this._force || !fileExists) {
                await promises_1.default.writeFile(filePath, docContent);
                this._log(`Documentation created for ${component.displayName}`);
                await this._updateNavLinks(component);
            }
            else {
                this._log(`Documentation already exists for ${component.displayName}. Use --force to overwrite.`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create documentation page: ${error.message}`);
            }
            else {
                throw new Error("Failed to create documentation page: Unknown error");
            }
        }
    }
    async _updateNavLinks(component) {
        const navLinksPath = path_1.default.join(this._docsPath, "navLinks.ts");
        try {
            let content = await promises_1.default.readFile(navLinksPath, "utf-8");
            const navLinks = eval(content.replace("export const navLinks =", ""));
            const newLink = {
                href: `/tools/docs/components/${component.suggestedFilename
                    .toLowerCase()
                    .replace(/\.[^/.]+$/, "")}`,
                label: component.displayName,
            };
            if (!navLinks.some((link) => link.href === newLink.href)) {
                navLinks.push(newLink);
                navLinks.sort((a, b) => a.label.localeCompare(b.label));
                const updatedContent = `export const navLinks = ${JSON.stringify(navLinks, null, 2)};`;
                await promises_1.default.writeFile(navLinksPath, updatedContent);
                this._log(`Updated navLinks.ts with ${component.displayName}`);
            }
            else {
                this._log(`${component.displayName} already exists in navLinks.ts`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to update navLinks.ts: ${error.message}`);
            }
            else {
                throw new Error("Failed to update navLinks.ts: Unknown error");
            }
        }
    }
    async _updateMetadataFile(newComponents) {
        const metadataPath = path_1.default.join(this._appPath, "metadata.json");
        let metadata = {};
        try {
            const existingMetadata = await promises_1.default.readFile(metadataPath, "utf-8");
            metadata = JSON.parse(existingMetadata);
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code !== "ENOENT") {
                throw new Error(`Failed to read metadata file: ${error.message}`);
            }
            // If the file doesn't exist, we'll create a new metadata object
        }
        for (const component of newComponents) {
            metadata[component.displayName] = {
                filename: component.suggestedFilename,
                exampleFunctionName: component.exampleFunctionName,
            };
        }
        try {
            await promises_1.default.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
            this._log("Metadata file updated");
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to write metadata file: ${error.message}`);
            }
            else {
                throw new Error("Failed to write metadata file: Unknown error");
            }
        }
    }
    async generateDocumentation(componentName) {
        try {
            const components = await this.listComponents();
            let componentsToGenerate = components.filter((c) => c.metadata !== null);
            if (componentName) {
                componentsToGenerate = componentsToGenerate.filter((c) => { var _a; return ((_a = c.metadata) === null || _a === void 0 ? void 0 : _a.displayName) === componentName; });
                if (componentsToGenerate.length === 0) {
                    this._formatter.error(`Component "${componentName}" not found.`);
                    return;
                }
            }
            await Promise.all(componentsToGenerate.map((component) => this._createDocumentationPage(component.metadata, component.filename)));
            await this._updateMetadataFile(componentsToGenerate.map((c) => c.metadata));
            this._formatter.success(`Documentation generated for ${componentsToGenerate.length} component(s).`);
        }
        catch (error) {
            if (error instanceof Error) {
                this._formatter.error(`Error generating documentation: ${error.message}`);
            }
            else {
                this._formatter.error("Error generating documentation: Unknown error");
            }
        }
    }
    async checkIfDocumentationNeedsUpdate(componentName) {
        try {
            const componentPath = path_1.default.join(this._componentsPath, `${componentName}.tsx`);
            const content = await promises_1.default.readFile(componentPath, "utf-8");
            const metadata = this._extractComponentMetadata(content);
            if (!metadata)
                return false;
            const docPath = this._getDocPath(metadata.suggestedFilename);
            const filePath = path_1.default.join(docPath, "page.tsx");
            const [componentStat, docStat] = await Promise.all([
                promises_1.default.stat(componentPath),
                promises_1.default.stat(filePath),
            ]);
            // If the component file is newer than the doc file, an update is needed
            if (componentStat.mtime > docStat.mtime) {
                return true;
            }
            // Check if the content has changed
            const docContent = await promises_1.default.readFile(filePath, "utf-8");
            // Check if the extracted metadata matches the current documentation
            const docMetadataRegex = new RegExp(`${metadata.exampleFunctionName}`);
            if (!docMetadataRegex.test(docContent)) {
                return true;
            }
            return false; // No update needed
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT") {
                return true; // If the doc file doesn't exist, an update is needed
            }
            if (error instanceof Error) {
                throw new Error(`Failed to check if documentation needs update: ${error.message}`);
            }
            else {
                throw new Error("Failed to check if documentation needs update: Unknown error");
            }
        }
    }
}
exports.DocumentationManager = DocumentationManager;
