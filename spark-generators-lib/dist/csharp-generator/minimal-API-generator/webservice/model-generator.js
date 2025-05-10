import { CompositeGeneratorNode, expandToString, expandToStringWithNL, toString } from "langium/generate";
import { isLocalEntity } from "../../../shared/ast.js";
import { capitalizeString } from "../../../shared/generator-utils.js";
export function generateModel(cls, is_supertype, relations, package_name, importedEntities, identity) {
    const supertype = cls.superType?.ref;
    const is_abstract = cls?.is_abstract;
    const external_relations = relations.filter(relation => relation.tgt.$container != cls.$container);
    if (identity) {
        return expandToStringWithNL `
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
        return expandToStringWithNL `
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
export function generateIdentityUser(cls, package_name) {
    return expandToStringWithNL `
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
    if (isLocalEntity(supertype)) {
        return ``;
    }
    return `using ${generateImportEntity(supertype, importedEntities)};`;
}
function generateImportEntity(entity, importedEntities) {
    if (isLocalEntity(entity)) {
        return `${entity.$container.name.toLowerCase()}`;
    }
    const moduleImport = importedEntities.get(entity);
    return `${moduleImport?.library.toLocaleLowerCase()}.${entity.$container.name.toLowerCase()}`;
}
function generateAttribute(attribute, is_abstract) {
    return expandToStringWithNL `
  ${generateUniqueCollumn(attribute)}
  ${is_abstract ? `protected` : `public`} ${toString(generateTypeAttribute(attribute) ?? 'NOTYPE')} ${capitalizeString(attribute.name)} { get; set; }
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
    const node = new CompositeGeneratorNode();
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
                return expandToStringWithNL `
          // Navigation property and foreign key for ${tgt.name}
          public Guid ${tgt.name}Id { get; set; }
          public virtual ${tgt.name} ${tgt.name} { get; set; }`;
            }
            else {
                return expandToStringWithNL `
          // Navigation property and foreign key for ${cls.name}
          public Guid? ${cls.name}Id { get; set; }
          public virtual ${cls.name}? ${cls.name} { get; set; }`;
            }
        case "OneToMany":
            return expandToStringWithNL `
          // Reference to ${tgt.name} (one-to-many side)
          public virtual ICollection<${tgt.name}> ${pluralName} { get; set; } = new HashSet<${tgt.name}>();`;
        case "ManyToOne":
            return expandToStringWithNL `
        // Collection of ${tgt.name} (many-to-one side)
        public Guid ${tgt.name}Id { get; set; }
        public virtual ${tgt.name} ${tgt.name} { get; set; } = null!;`;
        case "ManyToMany":
            return expandToStringWithNL `
        // Collection of ${tgt.name} (many-to-many side)
        public virtual ICollection<${tgt.name}> ${pluralName} { get; set; } = new HashSet<${tgt.name}>();`;
    }
}
function createEnum(enumEntityAtribute) {
    return expandToString `
  public ${enumEntityAtribute.type.ref?.name} ${enumEntityAtribute.type.ref?.name.toLowerCase()} { get; set; }
  `;
}
function generateEnum(cls) {
    return expandToStringWithNL `
  ${cls.enumentityatributes.map(enumEntityAtribute => createEnum(enumEntityAtribute)).join("\n")}
  `;
}
