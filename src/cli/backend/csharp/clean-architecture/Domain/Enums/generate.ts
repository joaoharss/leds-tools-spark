import { expandToString } from "langium/generate";
import { EnumX, Model, isEnumX, isModule } from "../../../../../../language/generated/ast.js";
import path from "path";
import fs from "fs";

export function generate(model: Model, target_folder: string) {
    const modules =  model.abstractElements.filter(isModule);
    const package_name = model.configuration?.name || "default"
    for(const mod of modules) {
        for (const enumx of mod.elements.filter(isEnumX)){
            fs.writeFileSync(path.join(target_folder,`${enumx.name}.cs`), createEnum(enumx,package_name))
        }
    }
}

function createEnum(enumx:EnumX, package_name: string) : string {
    return expandToString`
namespace ${package_name}.Domain.Enums
{
    public enum ${enumx.name} {
        ${enumx.attributes.map(a => `${a.name.toUpperCase()}` ).join(",\n")}
    }
}
`
}