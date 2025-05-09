import fs from "fs";
import { generate as minimalApiGenerate } from "../generators/minimal-API-generators/generator.js";
import { generate as minimalprojectGenerate } from "../generators/minimal-API-generators/project-generator.js";
import { generate as minimalgenerateDocker } from "../generators/minimal-API-generators/docker-generator.js";
import { generate as cleanArchGenerate } from "../generators/cleanArchitecture-generators/generator.js";
import { generate as cleanprojectGenerate } from "../generators/cleanArchitecture-generators/project-generator.js";
import { generate as cleangenerateDocker } from "../generators/cleanArchitecture-generators/docker-generator.js";
export function generate(model, target_folder) {
    const target_folder_back = target_folder + "/backend";
    const target_folder_projname = target_folder_back + "/" + model.configuration?.name;
    //creating folders
    fs.mkdirSync(target_folder_back, { recursive: true });
    //minimal or clean-archi
    if (model.configuration?.language == 'csharp-minimal-api') {
        minimalApiGenerate(model, target_folder_projname);
        minimalprojectGenerate(model, target_folder_back);
        minimalgenerateDocker(model, target_folder_back);
    }
    else {
        cleanArchGenerate(model, target_folder_projname);
        cleanprojectGenerate(model, target_folder_back);
        cleangenerateDocker(model, target_folder_back);
    }
}
