import fs from "fs";
import { django } from "../generators/index.js";
import { createPath } from "../shared/generator-utils.js";
export function generate(model, target_folder) {
    const target_folder_back = createPath(target_folder, "backend");
    //creating folders
    fs.mkdirSync(target_folder_back, { recursive: true });
    django.generate(model, target_folder_back);
}
