"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_1 = __importDefault(require("fs"));
const spark_generators_lib_1 = require("spark-generators-lib");
function generate(model, target_folder) {
    const target_folder_entity = target_folder + "/entity";
    const target_folder_webservice = target_folder + "/webservice";
    //creating folders
    fs_1.default.mkdirSync(target_folder_entity, { recursive: true });
    fs_1.default.mkdirSync(target_folder_webservice, { recursive: true });
    //creating entity
    spark_generators_lib_1.java.generateEntity(model, target_folder_entity);
    spark_generators_lib_1.java.generateWebservice(model, target_folder_webservice);
    // Documentation
    spark_generators_lib_1.java.generateDocumentation(model, target_folder);
}
