"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModel = generateModel;
const generate_1 = require("langium/generate");
const ast_js_1 = require("../../shared/ast.js");
const generator_utils_js_1 = require("../../shared/generator-utils.js");
function generateModel(cls, is_supertype, relations, package_name, importedEntities) {
    const supertype = cls.superType?.ref;
    const is_abstract = cls?.is_abstract;
    const external_relations = relations.filter(relation => relation.tgt.$container != cls.$container);
    return (0, generate_1.expandToStringWithNL) `
    package ${package_name}.models;

    import lombok.Data;
    import lombok.Builder;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;
    import lombok.experimental.SuperBuilder;

    import jakarta.persistence.*;

    import java.io.Serializable;
    import java.time.LocalDateTime;
    import java.util.Set;
    import java.util.HashSet;
    import java.util.Objects;
    import java.util.UUID;
    import java.time.LocalDate;
    import java.util.Date;

    ${external_relations.map(relation => `import ${package_name.replace(cls.$container.name.toLowerCase(), relation.tgt.$container.name.toLowerCase())}.models.${relation.tgt.name};`).join('\n')}
    
    ${supertype ? generateImportSuperEntity(package_name, cls, supertype, importedEntities) : undefined}
    
    @Data
    ${is_abstract ? undefined : `@Entity`}
    @SuperBuilder
    @NoArgsConstructor
    @AllArgsConstructor
    ${is_abstract ? `@MappedSuperclass` : `@Table(name = "${cls.name.toLowerCase()}")`}        
    ${!is_supertype ? '@Inheritance(strategy = InheritanceType.SINGLE_TABLE)' : undefined}
    public ${is_abstract ? `abstract` : undefined} class ${cls.name} ${supertype ? `extends ${supertype.name}` : ''} implements Serializable {
        
      ${is_abstract ? `
      @Id
      protected @GeneratedValue (strategy=GenerationType.IDENTITY)
      Long id;` : undefined}

      ${!supertype && !is_abstract ? `
      @Id
      private @GeneratedValue (strategy=GenerationType.IDENTITY)
      Long id;` : undefined}
      
      ${cls.attributes.map(a => generateAttribute(a, is_abstract)).join('\n')}
      ${generateRelations(cls, relations)}
      ${generateEnum(cls)}

      @Builder.Default
      private LocalDateTime createdAt = LocalDateTime.now();

      @Override
      public boolean equals(Object o) {
              if (this == o) return true;
              if (o == null || this.getClass() != o.getClass()) return false;

            ${cls.name} elem = (${cls.name}) o;
            return getId().equals(elem.getId());
      }

      @Override
      public int hashCode() {
        return Objects.hash(getId());
      }

      @Override
      public String toString() {
          return "${cls.name} {" +
             "id="+this.id+
              ${cls.attributes.map(a => `", ${a.name}='"+this.${a.name}+"'"+`).join('\n')}
              ${(0, ast_js_1.isLocalEntity)(supertype) ? supertype?.attributes.map(a => `", ${a.name}='"+this.${a.name}+"'"+`).join('\n') : undefined}
              ${cls.enumentityatributes.map(a => `", ${a.name.toLowerCase()}='"+this.${a.name.toLowerCase()}+"'"+`).join('\n')}
          '}';
      }  
    }
  `;
}
function generateImportSuperEntity(package_name, entity, supertype, importedEntities) {
    if ((0, ast_js_1.isLocalEntity)(supertype)) {
        return `import ${package_name.replace(entity.$container.name.toLowerCase(), generateImportEntity(supertype, importedEntities))}.models.${supertype.name};`;
    }
    return `import br.nemo.immigrant.ontology.entity.${generateImportEntity(supertype, importedEntities)}.models.${supertype.name};`;
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
  ${is_abstract ? `protected` : `private`} ${(0, generator_utils_js_1.capitalizeString)((0, generate_1.toString)(generateTypeAttribute(attribute)) ?? 'NOTYPE')} ${attribute.name};
  `;
}
function generateUniqueCollumn(attribute) {
    if (attribute?.unique) {
        return "@Column(unique=true)";
    }
    return "";
}
function generateTypeAttribute(attribute) {
    if (attribute.type.toString().toLowerCase() === "date") {
        return "LocalDate";
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
    switch (card) {
        case "OneToOne":
            if (owner) {
                return (0, generate_1.expandToStringWithNL) `
        @OneToOne
        @JoinColumn(name = "${tgt.name.toLowerCase()}_id", referencedColumnName = "id")
        private ${tgt.name} ${tgt.name.toLowerCase()};
      `;
            }
            else {
                return (0, generate_1.expandToStringWithNL) `
        @OneToOne(cascade = {CascadeType.ALL}, orphanRemoval = true, mappedBy = "${cls.name.toLowerCase()}")
        @Builder.Default
        private ${tgt.name} ${tgt.name.toLowerCase()} = null;
      `;
            }
        case "OneToMany":
            if (owner) {
                return '';
            }
            else {
                return (0, generate_1.expandToStringWithNL) `
        @OneToMany(cascade = {CascadeType.ALL}, orphanRemoval = true, mappedBy = "${cls.name.toLowerCase()}")
        @Builder.Default
        Set<${tgt.name}> ${tgt.name.toLowerCase()}s = new HashSet<>();
      `;
            }
        case "ManyToOne":
            if (owner) {
                return (0, generate_1.expandToStringWithNL) `
        @ManyToOne
        @JoinColumn(name = "${tgt.name.toLowerCase()}_id")
        private ${tgt.name} ${tgt.name.toLowerCase()};
      `;
            }
            else {
                return '';
            }
        case "ManyToMany":
            if (owner) {
                return (0, generate_1.expandToStringWithNL) `
        @ManyToMany
        @JoinTable(
            name = "${cls.name.toLowerCase()}_${tgt.name.toLowerCase()}",
            joinColumns = @JoinColumn(name = "${cls.name.toLowerCase()}_id"),
            inverseJoinColumns = @JoinColumn(name = "${tgt.name.toLowerCase()}_id")
        )
        @Builder.Default
        private Set<${tgt.name}> ${tgt.name.toLowerCase()}s = new HashSet<>();
      `;
            }
            else {
                return (0, generate_1.expandToStringWithNL) `
        @ManyToMany(mappedBy = "${cls.name.toLowerCase()}s")
        @Builder.Default
        private Set<${tgt.name}> ${tgt.name.toLowerCase()}s = new HashSet<>();
      `;
            }
    }
}
function createEnum(enumEntityAtribute) {
    return (0, generate_1.expandToString) `
  @Builder.Default
  @Enumerated(EnumType.STRING)
  private ${enumEntityAtribute.type.ref?.name} ${enumEntityAtribute.name.toLowerCase()} = ${enumEntityAtribute.type.ref?.name}.${enumEntityAtribute.type.ref?.attributes[0].name.toUpperCase()};
  `;
}
function generateEnum(cls) {
    return (0, generate_1.expandToStringWithNL) `
  ${cls.enumentityatributes.map(enumEntityAtribute => createEnum(enumEntityAtribute)).join("\n")}
  `;
}
