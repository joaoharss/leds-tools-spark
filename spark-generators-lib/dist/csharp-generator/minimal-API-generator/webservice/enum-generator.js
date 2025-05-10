import { expandToString } from "langium/generate";
export function generateEnum(enumx, package_name) {
    return expandToString `
    public enum ${enumx.name} {
        ${enumx.attributes.map(a => `${a.name.toUpperCase()}`).join(",\n")}
    }
  `;
}
