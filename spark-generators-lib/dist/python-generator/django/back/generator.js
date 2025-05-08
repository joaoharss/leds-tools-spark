<<<<<<< HEAD
import { generateModuleGenerator } from "./components/index.js";
import { generate as generateSettings } from "./setting-generator.js";
import { generateBDD } from "./bdd/index.js";
=======
import { generateModules } from "./components/module-generator.js";
import { generate as generateSettings } from "./setting-generator.js";
import { generate as generateBDD } from "./bdd/generator.js";
>>>>>>> 892cbef938aba9689a65f8114b388163385edf0e
import fs from "fs";
export function generate(model, target_folder) {
    fs.mkdirSync(target_folder, { recursive: true });
    generateSettings(model, target_folder);
<<<<<<< HEAD
    generateModuleGenerator(model, target_folder);
=======
    generateModules(model, target_folder);
>>>>>>> 892cbef938aba9689a65f8114b388163385edf0e
    generateBDD(model, target_folder);
}
