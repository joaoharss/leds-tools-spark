"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchemaSQLHelper = generateSchemaSQLHelper;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const generator_utils_js_1 = require("../../shared/generator-utils.js");
const ast_js_1 = require("../../shared/ast.js");
const generate_1 = require("langium/generate");
function generateSchemaSQLHelper(model, target_folder) {
    if (model.configuration) {
        // criando a pasta que salva o SQL
        const SQL_PATH = (0, generator_utils_js_1.createPath)(target_folder, "sql");
        fs_1.default.writeFileSync(path_1.default.join(SQL_PATH, 'sql_unique_constrains.sql'), (0, generate_1.toString)(generateSQL(model)));
    }
}
function generateSQLCommand(entity) {
    var atributesUnique = [];
    for (const attribute of entity.attributes) {
        if (attribute?.unique && !entity.is_abstract) {
            atributesUnique.push(attribute);
        }
    }
    if (atributesUnique.length) {
        return (0, generate_1.expandToString) `
  ALTER TABLE public.${entity.name.toLowerCase()} ADD CONSTRAINT ${entity.name.toLowerCase()}_unique_constrain UNIQUE (${atributesUnique.map(a => `${a.name}`).join(`,`)});
  `;
    }
    return undefined;
}
function generateSQL(model) {
    return (0, generate_1.expandToStringWithNL) `
    ${model.abstractElements.filter(ast_js_1.isModule).map(module => module.elements.filter(ast_js_1.isLocalEntity).map(entity => generateSQLCommand(entity)).join('\n')).join('\n')}  
    `;
}
