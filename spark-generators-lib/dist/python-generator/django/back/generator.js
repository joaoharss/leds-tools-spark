import { generateModules } from "./components/module-generator.js";
import { generate as generateSettings } from "./setting-generator.js";
import { generate as generateBDD } from "./bdd/generator.js";
import fs from "fs";
export function generate(model, target_folder) {
    fs.mkdirSync(target_folder, { recursive: true });
    generateSettings(model, target_folder);
    generateModules(model, target_folder);
    generateBDD(model, target_folder);
}
