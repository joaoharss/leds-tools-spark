import fs from "fs";

import { java, generators } from "spark-generators-lib";
type Model = java.Model;

export function generate(model: Model, target_folder: string) : void {
    const target_folder_back = target_folder+"/backend"

    //creating folders
    fs.mkdirSync(target_folder_back, {recursive:true})
    
    generators.springboot.generate(model, target_folder_back)
    
}  