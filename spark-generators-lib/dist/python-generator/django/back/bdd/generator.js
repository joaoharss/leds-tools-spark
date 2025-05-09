"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ast_js_1 = require("../../../../shared/ast.js");
const generator_utils_js_1 = require("../../../../shared/generator-utils.js");
const generate_1 = require("langium/generate");
function generate(app, target_folder) {
    const BASE_PATH = (0, generator_utils_js_1.createPath)(target_folder, "backend");
    const FEATURES_PATH = (0, generator_utils_js_1.createPath)(BASE_PATH, "features");
    const STEPS_PATH = (0, generator_utils_js_1.createPath)(FEATURES_PATH, "steps");
    fs_1.default.writeFileSync(path_1.default.join(STEPS_PATH, "README.md"), "");
    for (const m of app.abstractElements.filter(ast_js_1.isModule)) {
        for (const e of m.elements.filter(ast_js_1.isLocalEntity).filter(e => !e.is_abstract)) {
            fs_1.default.writeFileSync(path_1.default.join(FEATURES_PATH, `${m.name}_${e.name}.feature`), (0, generate_1.toString)(generate_feature_file(e)));
            // fs.writeFileSync(path.join(STEPS_PATH, `${m.name}_${e.name}_steps.py`), generateSteps(e))
        }
    }
}
function generate_feature_file(e) {
    return (0, generate_1.expandToStringWithNL) `
        Feature: Gerenciar ${e.name}

        Scenario Outline: Eu, como Usuário Autenticado, quero cadastrar um(a) ${e.name}

        Given Eu sou Usuário Autenticado
        And preenchi os seguintes campos:
        |Campo 1|
        |Campo 2|
        |Campo 3|
        |Campo 4|

        When os dados foram enviados para backend
        Then o sistema responde com o <status> e a seguinte <mensagem>

        Example:
        |Status |mensagem                      |
        |Sucesso|Cadastro realizado com sucesso|
        |Error  |Cadastro Não Realizado        | 


        Scenario Outline: Eu, como Usuário Autenticado, quero atualizar a ${e.name}

        Given Eu sou Usuário Autenticado
        And selecionei uma instancia da entidade
        And atualizei um dos seguintes campos:
        |Campo 1|
        |Campo 2|
        |Campo 3|
        |Campo 4|

        When os dados foram enviados para backend
        Then o sistema responde com o <status> e a seguinte <mensagem>

        Example:
        |Status |mensagem                          |
        |Sucesso|Atualizado com sucesso com sucesso|
        |Error  |Não Atualizado                    |

        Scenario Outline: Eu, como Usuário Autenticado, quero deleter a <entidade>

        Given Eu sou Usuário Autenticado
        And selecionei uma instancia da entidade
        When os dados foram enviados para backend
        Then o sistema responde com o <status> e a seguinte <mensagem>

        Example:
        |Status |mensagem                        |
        |Sucesso|Deletado com sucesso com sucesso|
        |Error  |Não Deletado                    |


        Scenario Outline: Eu, como Usuário Autenticado, quero buscar a ${e.name}

        Given Eu sou Usuário Autenticado
        And selecionei uma instancia da entidade
        When os dados foram enviados para backend
        Then o sistema responde com o <status> e a seguinte <mensagem>

        Example:
        |Status |mensagem               |
        |Sucesso|Retorna a entidade     |
        |Error  |Entidade não encontrada|


        Scenario Outline: Eu, como Usuário Autenticado, quero buscar a ${e.name}

        Given Eu sou Usuário Autenticado
        And quero buscar todas as entidades
        When os dados foram enviados para backend
        Then o sistema responde com o <status> e a seguinte <mensagem>

        Example:
        |Status |mensagem          |
        |Sucesso|Retorna a entidade|
    `;
}
