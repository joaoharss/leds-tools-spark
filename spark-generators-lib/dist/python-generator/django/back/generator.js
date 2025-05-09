"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const index_js_1 = require("./components/index.js");
const setting_generator_js_1 = require("./setting-generator.js");
const index_js_2 = require("./bdd/index.js");
const fs_1 = __importDefault(require("fs"));
function generate(model, target_folder) {
    fs_1.default.mkdirSync(target_folder, { recursive: true });
    (0, setting_generator_js_1.generate)(model, target_folder);
    (0, index_js_1.generateModuleGenerator)(model, target_folder);
    (0, index_js_2.generateBDD)(model, target_folder);
}
