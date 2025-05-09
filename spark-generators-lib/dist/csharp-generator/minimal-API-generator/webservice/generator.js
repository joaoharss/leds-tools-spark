"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_1 = __importDefault(require("fs"));
const module_generator_js_1 = require("./module-generator.js");
const program_generator_js_1 = require("./program-generator.js");
function generate(model, target_folder) {
    fs_1.default.mkdirSync(target_folder, { recursive: true });
    (0, module_generator_js_1.generateModules)(model, target_folder);
    (0, program_generator_js_1.generate)(model, target_folder);
}
