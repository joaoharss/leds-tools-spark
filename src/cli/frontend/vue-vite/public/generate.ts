import { Model } from "../../../../language/generated/ast.js"
import fs from "fs";
import { createPath } from "../../../util/generator-utils.js";
import { expandToString } from "langium/generate";
import path from "path";

export function generate(model: Model, target_folder: string) : void {

    const target_folder_public = createPath(target_folder, "public")
    const assets = createPath(target_folder_public, "assets")
    const images = createPath(assets, "images")

    fs.mkdirSync(target_folder_public, {recursive:true})
    fs.mkdirSync(assets, {recursive:true})
    fs.mkdirSync(images, {recursive:true})

    fs.writeFileSync(path.join(target_folder_public, '.env'), generateEnv());
    fs.writeFileSync(path.join(target_folder_public, '_redirects'), generateRedirects());
    fs.writeFileSync(path.join(target_folder_public, 'favicon.png'), generateFavicon());

}  

function generateEnv(): string {
    return expandToString`
VITE_API_URL="/"`
}

function generateRedirects(): string {
    return expandToString`
/*    /index.html   200
`
}

function generateFavicon(): string {
    return expandToString`
`
} 