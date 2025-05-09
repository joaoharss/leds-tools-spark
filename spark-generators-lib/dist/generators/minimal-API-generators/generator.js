import fs from "fs";
import { generate as generateHelpers } from "./helpers-generator.js";
import { generate as generateDocumentation } from "../../csharp-generator/minimal-API-generator/documentation/generator.js";
import { generate as generateWebservice } from "../../csharp-generator/minimal-API-generator/webservice/generator.js";
export function generate(model, target_folder) {
    const target_folder_webservice = target_folder + "/webservice";
    fs_1.default.mkdirSync(target_folder_webservice, { recursive: true });
    // Helpers
    (0, helpers_generator_js_1.generate)(model, target_folder);
    // Documentation
    (0, generator_js_1.generate)(model, target_folder);
    // WebServices
    (0, generator_js_2.generate)(model, target_folder_webservice);
}
