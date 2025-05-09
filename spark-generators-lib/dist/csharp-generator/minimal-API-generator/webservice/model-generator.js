"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModel = generateModel;
exports.generateIdentityUser = generateIdentityUser;
const generate_1 = require("langium/generate");
const ast_js_1 = require("../../../shared/ast.js");
const generator_utils_js_1 = require("../../../shared/generator-utils.js");
function generateModel(cls, is_supertype, relations, package_name, importedEntities, identity) {
    const supertype = cls.superType?.ref;
    const is_abstract = cls?.is_abstract;
    const external_relations = relations.filter(relation => relation.tgt.$container != cls.$container);
    if (identity) {
        return (0, generate_1.expandToStringWithNL) `
    namespace ${package_name}
    {
      using Microsoft.EntityFrameworkCore;

    ${external_relations.map(relation => `using ${package_name.replace(cls.$container.name, relation.tgt.$container.name)};`).join('\n')}

    ${supertype ? generateImportSuperEntity(package_name, cls, supertype, importedEntities) : undefined}
    public ${is_abstract ? `abstract` : ''} class ${cls.name} ${supertype ? `extends ${supertype.name}` : ': AppUser'} {

      private DateTime createdAt = DateTime.Now;

      ${cls.attributes.map(a => generateAttribute(a, is_abstract)).join('\n')}
      ${generateRelations(cls, relations)}
      ${generateEnum(cls)}

    }
    }
  `;
    }
    else {
        return (0, generate_1.expandToStringWithNL) `
    namespace ${package_name}
    {
      using Microsoft.EntityFrameworkCore;

      ${external_relations.filter(relation => relation.tgt.$container.name !== package_name)
            .map(relation => `using ${package_name.replace(cls.$container.name, relation.tgt.$container.name)};`)
            .join('\n')}

    ${supertype ? generateImportSuperEntity(package_name, cls, supertype, importedEntities) : undefined}
    public ${is_abstract ? `abstract` : ''} class ${cls.name} ${supertype ? `: ${supertype.name}` : ''} {

      ${is_abstract ? `public Guid Id { get; set; }` : ''}
      private DateTime createdAt = DateTime.Now;

      ${!supertype && !is_abstract ? `public Guid Id { get; set; }` : ''}

      ${cls.attributes.map(a => generateAttribute(a, is_abstract)).join('\n')}
      ${generateRelations(cls, relations)}
      ${generateEnum(cls)}

    }
    }
  `;
    }
}
function generateIdentityUser(cls, package_name) {
    return (0, generate_1.expandToStringWithNL) `
  using Microsoft.AspNetCore.Identity;

  namespace ${package_name}
  {
      public class AppUser : IdentityUser<Guid>
      {
          public ${cls.name} ${cls.name} { get; set; }
      }
  
  }
  `;
}
function generateImportSuperEntity(package_name, entity, supertype, importedEntities) {
    if ((0, ast_js_1.isLocalEntity)(supertype)) {
        return ``;
    }
    return `using ${generateImportEntity(supertype, importedEntities)};`;
}
function generateImportEntity(entity, importedEntities) {
    if ((0, ast_js_1.isLocalEntity)(entity)) {
        return `${entity.$container.name.toLowerCase()}`;
    }
    const moduleImport = importedEntities.get(entity);
    return `${moduleImport?.library.toLocaleLowerCase()}.${entity.$container.name.toLowerCase()}`;
}
function generateAttribute(attribute, is_abstract) {
    return (0, generate_1.expandToStringWithNL) `
  ${generateUniqueCollumn(attribute)}
  ${is_abstract ? `protected` : `public`} ${(0, generate_1.toString)(generateTypeAttribute(attribute) ?? 'NOTYPE')} ${(0, generator_utils_js_1.capitalizeString)(attribute.name)} { get; set; }
  `;
}
function generateUniqueCollumn(attribute) {
    if (attribute?.unique) {
        return " ";
    }
    return "";
}
function generateTypeAttribute(attribute) {
    if (attribute.type.toString().toLowerCase() === "date") {
        return "DateTime";
    }
    if (attribute.type.toString().toLowerCase() === "cpf") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "email") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "file") {
        return "Byte[]";
    }
    if (attribute.type.toString().toLowerCase() === "mobilephonenumber") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "zipcode") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "phonenumber") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "integer") {
        return "int";
    }
    return attribute.type;
}
function generateRelations(cls, relations) {
    const node = new generate_1.CompositeGeneratorNode();
    for (const rel of relations) {
        node.append(generateRelation(cls, rel));
        node.appendNewLine();
    }
    return node;
}
function generateRelation(cls, { tgt, card, owner }) {
    // Helper function to create plural form
    const getPluralName = (name) => `${name}s`;
    const pluralName = getPluralName(tgt.name);
    switch (card) {
        case "OneToOne":
            if (owner) {
                return (0, generate_1.expandToStringWithNL) `
          // Navigation property and foreign key for ${tgt.name}
          public Guid ${tgt.name}Id { get; set; }
          public virtual ${tgt.name} ${tgt.name} { get; set; }`;
            }
            else {
                return (0, generate_1.expandToStringWithNL) `
          // Navigation property and foreign key for ${cls.name}
          public Guid? ${cls.name}Id { get; set; }
          public virtual ${cls.name}? ${cls.name} { get; set; }`;
            }
        case "OneToMany":
            return (0, generate_1.expandToStringWithNL) `
          // Reference to ${tgt.name} (one-to-many side)
          public virtual ICollection<${tgt.name}> ${pluralName} { get; set; } = new HashSet<${tgt.name}>();`;
        case "ManyToOne":
            return (0, generate_1.expandToStringWithNL) `
        // Collection of ${tgt.name} (many-to-one side)
        public Guid ${tgt.name}Id { get; set; }
        public virtual ${tgt.name} ${tgt.name} { get; set; } = null!;`;
        case "ManyToMany":
            return (0, generate_1.expandToStringWithNL) `
        // Collection of ${tgt.name} (many-to-many side)
        public virtual ICollection<${tgt.name}> ${pluralName} { get; set; } = new HashSet<${tgt.name}>();`;
    }
}
function createEnum(enumEntityAtribute) {
    return (0, generate_1.expandToString) `
  public ${enumEntityAtribute.type.ref?.name} ${enumEntityAtribute.type.ref?.name.toLowerCase()} { get; set; }
  `;
}
function generateEnum(cls) {
    return (0, generate_1.expandToStringWithNL) `
  ${cls.enumentityatributes.map(enumEntityAtribute => createEnum(enumEntityAtribute)).join("\n")}
  `;
}
