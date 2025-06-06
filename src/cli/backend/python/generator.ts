import fs from "fs";

import { generators, Model as LibModel } from "spark-generators-lib";


export function generate(model: LibModel.Model, target_folder: string): void {
    // Não crie a pasta backend aqui, deixe para a lib!
    fs.mkdirSync(target_folder, { recursive: true });

    generators.django.generate(model, target_folder);
}