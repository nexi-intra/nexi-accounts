"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFormatter = exports.ChalkFormatter = void 0;
const chalk_1 = __importDefault(require("chalk"));
class ChalkFormatter {
    constructor() {
        this.output = [];
    }
    log(message) {
        console.log(message);
        this.output.push(message);
    }
    error(message) {
        console.error(chalk_1.default.red(message));
        this.output.push(`ERROR: ${message}`);
    }
    success(message) {
        console.log(chalk_1.default.green(message));
        this.output.push(`SUCCESS: ${message}`);
    }
    warn(message) {
        console.warn(chalk_1.default.yellow(message));
        this.output.push(`WARNING: ${message}`);
    }
    info(message) {
        console.info(chalk_1.default.blue(message));
        this.output.push(`INFO: ${message}`);
    }
    formatOutput() {
        return this.output.join("\n");
    }
}
exports.ChalkFormatter = ChalkFormatter;
class JsonFormatter {
    constructor() {
        this.output = {
            logs: [],
            errors: [],
            successes: [],
            warnings: [],
            infos: [],
        };
    }
    log(message) {
        this.output.logs.push(message);
    }
    error(message) {
        this.output.errors.push(message);
    }
    success(message) {
        this.output.successes.push(message);
    }
    warn(message) {
        this.output.warnings.push(message);
    }
    info(message) {
        this.output.infos.push(message);
    }
    formatOutput() {
        return JSON.stringify(this.output, null, 2);
    }
}
exports.JsonFormatter = JsonFormatter;
