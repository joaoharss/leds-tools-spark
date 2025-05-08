import fs from "fs";
import { generate as generateHelpers } from "./helpers-generator.js";
<<<<<<< HEAD
import { generate as generateDocumentation } from "./documentation/generator.js";
import { generate as generateWebservice } from "./webservice/generator.js";
=======
import { generate as generateDocumentation } from "../../csharp-generator/minimal-API-generator/documentation/generator.js";
import { generate as generateWebservice } from "../../csharp-generator/minimal-API-generator/webservice/generator.js";
>>>>>>> 892cbef938aba9689a65f8114b388163385edf0e
export function generate(model, target_folder) {
    const target_folder_webservice = target_folder + "/webservice";
    fs.mkdirSync(target_folder_webservice, { recursive: true });
    // Helpers
    generateHelpers(model, target_folder);
    // Documentation
    generateDocumentation(model, target_folder);
    // WebServices
    generateWebservice(model, target_folder_webservice);
}
