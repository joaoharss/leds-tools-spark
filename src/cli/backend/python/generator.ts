import { Model as LibModel } from "spark-generators-lib"
import fs from "fs";

import {generate as djangoGenerate} from "spark-generators-lib"
import { createPath } from "../../util/generator-utils.js";

export function generate(model: LibModel, target_folder: string) : void {

    const target_folder_back = createPath(target_folder, "backend")

    //creating folders
    fs.mkdirSync(target_folder_back, {recursive:true})


    djangoGenerate(model,target_folder_back)


}