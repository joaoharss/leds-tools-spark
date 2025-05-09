"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnum = generateEnum;
const generate_1 = require("langium/generate");
function generateEnum(enumx, package_name) {
    return (0, generate_1.expandToString) `
    public enum ${enumx.name} {
        ${enumx.attributes.map(a => `${a.name.toUpperCase()}`).join(",\n")}
    }
  `;
}
