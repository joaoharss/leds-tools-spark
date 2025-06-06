import fs from "fs";

import { generators, Model as LibModel } from "spark-generators-lib";


export function generate(model: LibModel.Model, target_folder: string): void {
    
    fs.mkdirSync(target_folder, { recursive: true });

    generators.django.generate(model, target_folder);
}