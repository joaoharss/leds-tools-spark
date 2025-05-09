"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_1 = __importDefault(require("fs"));
const helpers_generator_js_1 = require("./helpers-generator.js");
const generator_js_1 = require("../../csharp-generator/minimal-API-generator/documentation/generator.js");
const generator_js_2 = require("../../csharp-generator/minimal-API-generator/webservice/generator.js");
function generate(model, target_folder) {
    const target_folder_webservice = target_folder + "/webservice";
    fs_1.default.mkdirSync(target_folder_webservice, { recursive: true });
    // Helpers
    (0, helpers_generator_js_1.generate)(model, target_folder);
    // Documentation
    (0, generator_js_1.generate)(model, target_folder);
    // WebServices
    (0, generator_js_2.generate)(model, target_folder_webservice);
}
