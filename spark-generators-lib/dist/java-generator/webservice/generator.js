"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_1 = __importDefault(require("fs"));
const config_generator_js_1 = require("./config-generator.js");
const module_generator_js_1 = require("./module-generator.js");
const graphql_generator_js_1 = require("./graphql-generator.js");
function generate(model, target_folder) {
    fs_1.default.mkdirSync(target_folder, { recursive: true });
    (0, config_generator_js_1.generateConfigs)(model, target_folder);
    (0, module_generator_js_1.generateModules)(model, target_folder);
    (0, graphql_generator_js_1.generateGraphQL)(model, target_folder);
}
