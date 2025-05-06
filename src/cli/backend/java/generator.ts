import fs from "fs";

import { generators, Model } from "spark-generators-lib";

export function generate(model: Model.Model, target_folder: string) : void {
    const target_folder_back = target_folder+"/backend"

    //creating folders
    fs.mkdirSync(target_folder_back, {recursive:true})
    
    generators.springboot.generate(model, target_folder_back)
    
}  