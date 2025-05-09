"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGraphQL = generateGraphQL;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const generator_utils_js_1 = require("../../shared/generator-utils.js");
const ast_js_1 = require("../../shared/ast.js");
const generate_1 = require("langium/generate");
//Relation
function generateGraphQL(application, target_folder) {
    if (application.configuration) {
        const RESOURCE_PATH = (0, generator_utils_js_1.createPath)(target_folder, "src/main/resources");
        const GRAPHQL_PATH = (0, generator_utils_js_1.createPath)(RESOURCE_PATH, "graphql");
        fs_1.default.writeFileSync(path_1.default.join(GRAPHQL_PATH, 'schema.graphqls'), (0, generate_1.toString)(generateSchemaGraphQL(application)));
    }
}
/*
function generateRelationSchemaGraphQL(relation: Relation): Generated{
    switch(relation.$type) {
      case "OneToMany": return `[${relation.type.ref?.name}]`
      default: return `${relation.type.ref?.name}`
    }
    return ""
  }
  */
function generateTypeSchemaGraphQL(entity) {
    var att = entity.attributes;
    if ((0, ast_js_1.isLocalEntity)(entity.superType?.ref)) {
        att = entity.attributes.concat(entity.superType?.ref?.attributes ?? []);
    }
    //var relation = entity.relations.concat(entity.superType?.ref?.relations ?? [] )
    //${relation.map(relation => `${relation.name}:${generateRelationSchemaGraphQL(relation)}`).join("\n")}
    return (0, generate_1.expandToStringWithNL) `
    type ${entity.name}{
        id: ID!
        ${att.map(atribute => `${atribute.name}:String!`).join("\n")}
    }
    `;
}
function generateInputTypeSchemaGraphQL(entity) {
    var att = entity.attributes;
    if ((0, ast_js_1.isLocalEntity)(entity.superType?.ref)) {
        att = entity.attributes.concat(entity.superType?.ref?.attributes ?? []);
    }
    //var relation = entity.relations.concat(entity.superType?.ref?.relations ?? [] )
    //${relation.map(relation => `${relation.name}ID:String`).join("\n")}
    return (0, generate_1.expandToStringWithNL) `
    input ${entity.name}Input{
      ${att.map(atribute => `${atribute.name}:String!`).join("\n")}
    }
    `;
}
function generateSchemaGraphQL(application) {
    const modules = application.abstractElements.filter(ast_js_1.isModule);
    const all_entities = modules.map(module => module.elements.filter(ast_js_1.isLocalEntity)).flat();
    return (0, generate_1.expandToStringWithNL) `
    
    ${all_entities.map(entity => entity.is_abstract ? "" : (0, generate_1.toString)(generateTypeSchemaGraphQL(entity))).join("\n")}
    
    ${all_entities.map(entity => entity.is_abstract ? "" : (0, generate_1.toString)(generateInputTypeSchemaGraphQL(entity))).join("\n")}
  
    type Query{
      ${all_entities.map(entity => entity.is_abstract ? "" : `findAll${entity.name}s:[${entity.name}]`).join("\n")}
      ${all_entities.map(entity => entity.is_abstract ? "" : `findByID${entity.name} (id: ID!):${entity.name}`).join("\n")}
    }
    
    type Mutation{
      ${all_entities.map(entity => entity.is_abstract ? "" : `create${entity.name}(input: ${entity.name}Input):${entity.name}`).join("\n")}
      ${all_entities.map(entity => entity.is_abstract ? "" : `delete${entity.name} (id: ID!):${entity.name}`).join("\n")}
      ${all_entities.map(entity => entity.is_abstract ? "" : `update${entity.name} (id: ID!, input: ${entity.name}Input):${entity.name}`).join("\n")}
    }`;
}
