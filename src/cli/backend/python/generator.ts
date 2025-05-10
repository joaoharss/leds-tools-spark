
import fs from "fs";

import { generators, Model as LibModel} from "spark-generators-lib"
import { createPath } from "../../util/generator-utils.js";

export function generate(model: LibModel.Model, target_folder: string) : void {

    const target_folder_back = createPath(target_folder, "backend")

    //creating folders
    fs.mkdirSync(target_folder_back, {recursive:true})


    generators.django.generate(model,target_folder_back)


}



