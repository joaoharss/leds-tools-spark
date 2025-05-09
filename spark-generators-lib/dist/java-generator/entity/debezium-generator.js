"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDebezium = generateDebezium;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ast_js_1 = require("../../shared/ast.js");
const generator_utils_js_1 = require("../../shared/generator-utils.js");
const generate_1 = require("langium/generate");
function generateDebezium(model, target_folder) {
    if (model.configuration) {
        const name = model.configuration?.name?.toLowerCase() ?? "nodefined";
        // criando a pasta que salva o SQL
        const SQL_PATH = (0, generator_utils_js_1.createPath)(target_folder, "sql");
        fs_1.default.writeFileSync(path_1.default.join(SQL_PATH, 'debezium.sql'), (0, generate_1.toString)(generateDebeziumSQL(model)));
        const REGISTER_PATH = (0, generator_utils_js_1.createPath)(target_folder, "register");
        fs_1.default.writeFileSync(path_1.default.join(REGISTER_PATH, name + '-register.json'), (0, generate_1.toString)(generateDebeziumRegister(model.configuration)));
    }
}
function generateDebeziumSQL(model) {
    return (0, generate_1.expandToStringWithNL) `
    ${model.abstractElements.filter(ast_js_1.isModule).map(module => module.elements.filter(ast_js_1.isLocalEntity).map(entity => !entity.is_abstract ? `ALTER TABLE public.${entity.name.toLowerCase()}  REPLICA IDENTITY FULL;` : undefined).join('\n')).join('\n')}  
    `;
}
function generateDebeziumRegister(configuration) {
    const name = configuration?.name?.toLowerCase() ?? "nodefined";
    return (0, generate_1.expandToStringWithNL) `
    {
      "name": "${name}-connector",
      "config": {
          "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
          "tasks.max": "1",
          "database.hostname": "db-pg",
          "database.port": "5432",
          "database.user": "postgres",
          "database.password": "postgres",
          "database.dbname" : "${name}",
          "topic.prefix": "databases.${name}",
          "topic.partitions": 3,
          "schema.include.list": "public"
      }
  }
    
    `;
}
