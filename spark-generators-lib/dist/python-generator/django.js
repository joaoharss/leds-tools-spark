"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_1 = __importDefault(require("fs"));
const generator_js_1 = require("./django/back/generator.js");
const generator_utils_js_1 = require("../shared/generator-utils.js");
function generate(model, target_folder) {
    const target_folder_back = (0, generator_utils_js_1.createPath)(target_folder, "backend");
    //creating folders
    fs_1.default.mkdirSync(target_folder_back, { recursive: true });
    (0, generator_js_1.generate)(model, target_folder_back);
}
