"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/index.ts
var index_exports = {};
__export(index_exports, {
  java: () => java_generator_exports
});
module.exports = __toCommonJS(index_exports);

// packages/java-generator/index.ts
var java_generator_exports = {};
__export(java_generator_exports, {
  entity: () => entity_exports,
  generate: () => generate3,
  webservice: () => webservice_exports
});

// packages/java-generator/entity/index.ts
var entity_exports = {};
__export(entity_exports, {
  generate: () => generate,
  generateConfigs: () => generateConfigs,
  generateDebezium: () => generateDebezium,
  generateEnum: () => generateEnum,
  generateModel: () => generateModel,
  generateModules: () => generateModules,
  generateSchemaSQLHelper: () => generateSchemaSQLHelper
});

// packages/java-generator/entity/config-generator.ts
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);

// packages/shared/ast.ts
var import_langium = require("langium");
var AbstractElement = "AbstractElement";
var Entity = "Entity";
var Relation = "Relation";
var UseCaseElements = "UseCaseElements";
var Actor = "Actor";
var EnumX = "EnumX";
function isEnumX(item) {
  return reflection.isInstance(item, EnumX);
}
var Event = "Event";
var ImportedEntity = "ImportedEntity";
var LocalEntity = "LocalEntity";
function isLocalEntity(item) {
  return reflection.isInstance(item, LocalEntity);
}
var ManyToMany = "ManyToMany";
var ManyToOne = "ManyToOne";
var Module = "Module";
function isModule(item) {
  return reflection.isInstance(item, Module);
}
var ModuleImport = "ModuleImport";
function isModuleImport(item) {
  return reflection.isInstance(item, ModuleImport);
}
var OneToMany = "OneToMany";
var OneToOne = "OneToOne";
var UseCase = "UseCase";
var SPARKAstReflection = class extends import_langium.AbstractAstReflection {
  getAllTypes() {
    return ["AbstractElement", "Actor", "Attribute", "AttributeEnum", "Configuration", "Element", "Entity", "EnumEntityAtribute", "EnumX", "Event", "FunctionEntity", "ImportedEntity", "LocalEntity", "ManyToMany", "ManyToOne", "Model", "Module", "ModuleImport", "OneToMany", "OneToOne", "Parameter", "Relation", "UseCase", "UseCaseElements", "UseCasesModel"];
  }
  computeIsSubtype(subtype, supertype) {
    switch (subtype) {
      case Actor:
      case UseCase: {
        return this.isSubtype(UseCaseElements, supertype);
      }
      case EnumX:
      case Module: {
        return this.isSubtype(AbstractElement, supertype);
      }
      case ImportedEntity:
      case LocalEntity: {
        return this.isSubtype(Entity, supertype);
      }
      case ManyToMany:
      case ManyToOne:
      case OneToMany:
      case OneToOne: {
        return this.isSubtype(Relation, supertype);
      }
      default: {
        return false;
      }
    }
  }
  getReferenceType(refInfo) {
    const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
    switch (referenceId) {
      case "Actor:superType":
      case "UseCase:actors": {
        return Actor;
      }
      case "Configuration:entity":
      case "LocalEntity:superType":
      case "ManyToMany:type":
      case "ManyToOne:type":
      case "OneToMany:type":
      case "OneToOne:type": {
        return Entity;
      }
      case "EnumEntityAtribute:type": {
        return EnumX;
      }
      case "Event:depends": {
        return Event;
      }
      case "ManyToMany:by": {
        return LocalEntity;
      }
      case "UseCase:superType": {
        return UseCase;
      }
      default: {
        throw new Error(`${referenceId} is not a valid reference id.`);
      }
    }
  }
  getTypeMetaData(type) {
    switch (type) {
      case "Actor": {
        return {
          name: "Actor",
          properties: [
            { name: "comment" },
            { name: "fullName" },
            { name: "id" },
            { name: "superType" }
          ]
        };
      }
      case "Attribute": {
        return {
          name: "Attribute",
          properties: [
            { name: "blank", defaultValue: false },
            { name: "comment" },
            { name: "fullName" },
            { name: "max" },
            { name: "min" },
            { name: "name" },
            { name: "type" },
            { name: "unique", defaultValue: false }
          ]
        };
      }
      case "AttributeEnum": {
        return {
          name: "AttributeEnum",
          properties: [
            { name: "comment" },
            { name: "fullName" },
            { name: "name" }
          ]
        };
      }
      case "Configuration": {
        return {
          name: "Configuration",
          properties: [
            { name: "database_name" },
            { name: "description" },
            { name: "entity" },
            { name: "feature" },
            { name: "language" },
            { name: "name" },
            { name: "package_path" }
          ]
        };
      }
      case "Element": {
        return {
          name: "Element",
          properties: [
            { name: "comment" },
            { name: "name" },
            { name: "type" }
          ]
        };
      }
      case "EnumEntityAtribute": {
        return {
          name: "EnumEntityAtribute",
          properties: [
            { name: "comment" },
            { name: "name" },
            { name: "type" }
          ]
        };
      }
      case "EnumX": {
        return {
          name: "EnumX",
          properties: [
            { name: "attributes", defaultValue: [] },
            { name: "comment" },
            { name: "name" }
          ]
        };
      }
      case "Event": {
        return {
          name: "Event",
          properties: [
            { name: "action" },
            { name: "depends", defaultValue: [] },
            { name: "description" },
            { name: "id" },
            { name: "name_fragment" }
          ]
        };
      }
      case "FunctionEntity": {
        return {
          name: "FunctionEntity",
          properties: [
            { name: "comment" },
            { name: "name" },
            { name: "paramters", defaultValue: [] },
            { name: "response" }
          ]
        };
      }
      case "ImportedEntity": {
        return {
          name: "ImportedEntity",
          properties: [
            { name: "name" }
          ]
        };
      }
      case "LocalEntity": {
        return {
          name: "LocalEntity",
          properties: [
            { name: "attributes", defaultValue: [] },
            { name: "comment" },
            { name: "enumentityatributes", defaultValue: [] },
            { name: "functions", defaultValue: [] },
            { name: "is_abstract", defaultValue: false },
            { name: "name" },
            { name: "relations", defaultValue: [] },
            { name: "superType" }
          ]
        };
      }
      case "ManyToMany": {
        return {
          name: "ManyToMany",
          properties: [
            { name: "by" },
            { name: "comment" },
            { name: "fullName" },
            { name: "name" },
            { name: "type" }
          ]
        };
      }
      case "ManyToOne": {
        return {
          name: "ManyToOne",
          properties: [
            { name: "comment" },
            { name: "fullName" },
            { name: "name" },
            { name: "type" }
          ]
        };
      }
      case "Model": {
        return {
          name: "Model",
          properties: [
            { name: "abstractElements", defaultValue: [] },
            { name: "configuration" }
          ]
        };
      }
      case "Module": {
        return {
          name: "Module",
          properties: [
            { name: "comment" },
            { name: "elements", defaultValue: [] },
            { name: "name" }
          ]
        };
      }
      case "ModuleImport": {
        return {
          name: "ModuleImport",
          properties: [
            { name: "entities", defaultValue: [] },
            { name: "library" },
            { name: "name" },
            { name: "package_path" }
          ]
        };
      }
      case "OneToMany": {
        return {
          name: "OneToMany",
          properties: [
            { name: "comment" },
            { name: "fullName" },
            { name: "name" },
            { name: "type" }
          ]
        };
      }
      case "OneToOne": {
        return {
          name: "OneToOne",
          properties: [
            { name: "comment" },
            { name: "fullName" },
            { name: "name" },
            { name: "type" }
          ]
        };
      }
      case "Parameter": {
        return {
          name: "Parameter",
          properties: [
            { name: "comment" },
            { name: "element" }
          ]
        };
      }
      case "UseCase": {
        return {
          name: "UseCase",
          properties: [
            { name: "actors", defaultValue: [] },
            { name: "comment" },
            { name: "description" },
            { name: "events", defaultValue: [] },
            { name: "id" },
            { name: "name_fragment" },
            { name: "superType" }
          ]
        };
      }
      case "UseCasesModel": {
        return {
          name: "UseCasesModel",
          properties: [
            { name: "comment" },
            { name: "elements", defaultValue: [] },
            { name: "id" }
          ]
        };
      }
      default: {
        return {
          name: type,
          properties: []
        };
      }
    }
  }
};
var reflection = new SPARKAstReflection();

// packages/shared/generator-utils.ts
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
var ident_size = 4;
var base_ident = " ".repeat(ident_size);
function createPath(...args) {
  const PATH = import_path.default.join(...args);
  if (!import_fs.default.existsSync(PATH)) {
    import_fs.default.mkdirSync(PATH, { recursive: true });
  }
  return PATH;
}

// packages/java-generator/entity/config-generator.ts
var import_generate = require("langium/generate");
function generateConfigs(model, target_folder) {
  if (model.configuration) {
    const RESOURCE_PATH = createPath(target_folder, "src/main/resources");
    import_fs2.default.writeFileSync(import_path2.default.join(target_folder, "settings.xml"), (0, import_generate.toString)(generateSettings()));
    import_fs2.default.writeFileSync(import_path2.default.join(target_folder, "pom.xml"), (0, import_generate.toString)(generatePOMXML(model)));
    import_fs2.default.writeFileSync(import_path2.default.join(RESOURCE_PATH, "logback.xml"), (0, import_generate.toString)(generatelogback()));
    import_fs2.default.writeFileSync(import_path2.default.join(RESOURCE_PATH, "application.properties"), (0, import_generate.toString)(applicationProperties(model.configuration)));
  }
}
function generateSettings() {
  return import_generate.expandToStringWithNL`
    <settings>
    <servers>
      <server>
        <id>gitlab-maven</id>
        <configuration>
          <httpHeaders>
            <property>
              <name>Private-Token</name>
              <value>\${CI_JOB_TOKEN}</value>
            </property>
          </httpHeaders>
        </configuration>
      </server>   
    </servers>
  </settings>`;
}
function applicationProperties(configuration) {
  return import_generate.expandToStringWithNL`
  spring.datasource.initialization-mode=always
  spring.datasource.url =  jdbc:postgresql://localhost:5432/${configuration.database_name?.toLocaleLowerCase()}
  spring.datasource.username = postgres
  spring.datasource.password = postgres
  spring.datasource.platform= postgres
  #spring.jpa.hibernate.ddl-auto = update
  spring.jpa.hibernate.ddl-auto = create-drop
  
  spring.jpa.properties.javax.persistence.schema-generation.create-source=metadata
  spring.jpa.properties.javax.persistence.schema-generation.scripts.action=create-drop
  spring.jpa.properties.javax.persistence.schema-generation.scripts.drop-target=sql/${configuration.database_name?.toLowerCase()}.sql
  spring.jpa.properties.javax.persistence.schema-generation.scripts.create-target=sql/${configuration.database_name?.toLowerCase()}.sql

  `;
}
function generatelogback() {
  return import_generate.expandToStringWithNL`
  <?xml version="1.0" encoding="UTF-8"?>
  <configuration>
      <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
          <encoder>
              <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n
              </pattern>
          </encoder>
      </appender>

      <root level="INFO">
          <appender-ref ref="STDOUT" />
      </root>
  </configuration>
  `;
}
function generatePOMXML(application) {
  return import_generate.expandToStringWithNL`
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.1.0</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>${application.configuration?.package_path}.entity</groupId>
	<artifactId>${application.configuration?.name?.toLocaleLowerCase()}</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>${application.configuration?.name?.toLocaleLowerCase()}</name>
	<description>${application.configuration?.description}</description>
	<properties>
		<java.version>17</java.version>    
	</properties>

  <repositories>
  <repository>
    <id>gitlab-maven</id>
    <url>https://gitlab.com/api/v4/groups/#ADDGROUPID/-/packages/maven</url>
  </repository>

</repositories>

<distributionManagement>
  <repository>
    <id>gitlab-maven</id>
    <url>https://gitlab.com/api/v4/projects/#ADDPROJECTID/packages/maven</url>
  </repository>
  <snapshotRepository>
    <id>gitlab-maven</id>
    <url>https://gitlab.com/api/v4/projects/#ADDPROJECTID/packages/maven</url>
  </snapshotRepository>
</distributionManagement>



	<dependencies>
		
    ${application.abstractElements.filter(isModuleImport).map((moduleImport) => generateOntologyDependency(moduleImport)).join("\n")}
  

    <dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>

    <dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-commons</artifactId>
    </dependency>

	</dependencies>


</project>
  `;
}
function generateOntologyDependency(moduleImported) {
  return import_generate.expandToStringWithNL`
  <dependency>
  <groupId>${moduleImported.package_path?.toLowerCase()}</groupId>
  <artifactId>${moduleImported.library?.toLowerCase()}</artifactId>
  <version>0.0.1-SNAPSHOT</version>
</dependency>
  `;
}

// packages/java-generator/entity/debezium-generator.ts
var import_path3 = __toESM(require("path"), 1);
var import_fs3 = __toESM(require("fs"), 1);
var import_generate2 = require("langium/generate");
function generateDebezium(model, target_folder) {
  if (model.configuration) {
    const name = model.configuration?.name?.toLowerCase() ?? "nodefined";
    const SQL_PATH = createPath(target_folder, "sql");
    import_fs3.default.writeFileSync(import_path3.default.join(SQL_PATH, "debezium.sql"), (0, import_generate2.toString)(generateDebeziumSQL(model)));
    const REGISTER_PATH = createPath(target_folder, "register");
    import_fs3.default.writeFileSync(import_path3.default.join(REGISTER_PATH, name + "-register.json"), (0, import_generate2.toString)(generateDebeziumRegister(model.configuration)));
  }
}
function generateDebeziumSQL(model) {
  return import_generate2.expandToStringWithNL`
    ${model.abstractElements.filter(isModule).map((module2) => module2.elements.filter(isLocalEntity).map((entity) => !entity.is_abstract ? `ALTER TABLE public.${entity.name.toLowerCase()}  REPLICA IDENTITY FULL;` : void 0).join("\n")).join("\n")}  
    `;
}
function generateDebeziumRegister(configuration) {
  const name = configuration?.name?.toLowerCase() ?? "nodefined";
  return import_generate2.expandToStringWithNL`
    {
      "name": "${name}-connector",
      "config": {
          "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
          "tasks.max": "1",
          "database.hostname": "db-pg",
          "database.port": "5432",
          "database.user": "postgres",
          "database.password": "postgres",
          "database.dbname" : "${name}",
          "topic.prefix": "databases.${name}",
          "topic.partitions": 3,
          "schema.include.list": "public"
      }
  }
    
    `;
}

// packages/java-generator/entity/enum-generator.ts
var import_generate3 = require("langium/generate");
function generateEnum(enumx, package_name) {
  return import_generate3.expandToString`
    package ${package_name}.models;
    
    public enum ${enumx.name} {
        ${enumx.attributes.map((a) => `${a.name.toUpperCase()}`).join(",\n")}
    }
  `;
}

// packages/java-generator/entity/generator.ts
var import_fs6 = __toESM(require("fs"), 1);

// packages/java-generator/entity/module-generator.ts
var import_path4 = __toESM(require("path"), 1);
var import_fs4 = __toESM(require("fs"), 1);

// packages/shared/relations.ts
function revert_card(card) {
  switch (card) {
    case "OneToOne":
      return "OneToOne";
    case "OneToMany":
      return "ManyToOne";
    case "ManyToOne":
      return "OneToMany";
    case "ManyToMany":
      return "ManyToMany";
  }
}
function processRelations(localEntities) {
  const map = /* @__PURE__ */ new Map();
  for (const cls of localEntities) {
    map.set(cls, new Array());
  }
  const add_relation = (owner, non_owner, card_name) => {
    map.get(owner)?.push({
      tgt: non_owner,
      card: card_name,
      owner: true
    });
    map.get(non_owner)?.push({
      tgt: owner,
      card: revert_card(card_name),
      owner: false
    });
  };
  for (const entity of localEntities) {
    for (const relationship of entity.relations) {
      if (isLocalEntity(relationship.type.ref)) {
        if (relationship.$type === "OneToMany") {
          add_relation(relationship.type.ref, entity, "ManyToOne");
        } else {
          add_relation(entity, relationship.type.ref, relationship.$type);
        }
      }
    }
  }
  return map;
}

// packages/java-generator/entity/module-generator.ts
var import_generate5 = require("langium/generate");

// packages/java-generator/entity/model-generator.ts
var import_generate4 = require("langium/generate");
function generateModel(cls, is_supertype, relations, package_name, importedEntities) {
  const supertype = cls.superType?.ref;
  const is_abstract = cls?.is_abstract;
  const external_relations = relations.filter((relation) => relation.tgt.$container != cls.$container);
  return import_generate4.expandToStringWithNL`
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

    ${external_relations.map((relation) => `import ${package_name.replace(cls.$container.name.toLowerCase(), relation.tgt.$container.name.toLowerCase())}.models.${relation.tgt.name};`).join("\n")}
    
    ${supertype ? generateImportSuperEntity(package_name, cls, supertype, importedEntities) : void 0}
    
    @Data
    ${is_abstract ? void 0 : `@Entity`}
    @SuperBuilder
    @NoArgsConstructor
    @AllArgsConstructor
    ${is_abstract ? `@MappedSuperclass` : `@Table(name = "${cls.name.toLowerCase()}")`}        
    ${!is_supertype ? "@Inheritance(strategy = InheritanceType.SINGLE_TABLE)" : void 0}
    public ${is_abstract ? `abstract` : void 0} class ${cls.name} ${supertype ? `extends ${supertype.name}` : ""} implements Serializable {
        
      ${is_abstract ? `
      @Id
      protected @GeneratedValue (strategy=GenerationType.IDENTITY)
      Long id;` : void 0}

      ${!supertype && !is_abstract ? `
      @Id
      private @GeneratedValue (strategy=GenerationType.IDENTITY)
      Long id;` : void 0}
      
      ${cls.attributes.map((a) => generateAttribute(a, is_abstract)).join("\n")}
      ${generateRelations(cls, relations)}
      ${generateEnum2(cls)}

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
              ${cls.attributes.map((a) => `", ${a.name}='"+this.${a.name}+"'"+`).join("\n")}
              ${isLocalEntity(supertype) ? supertype?.attributes.map((a) => `", ${a.name}='"+this.${a.name}+"'"+`).join("\n") : void 0}
              ${cls.enumentityatributes.map((a) => `", ${a.name.toLowerCase()}='"+this.${a.name.toLowerCase()}+"'"+`).join("\n")}
          '}';
      }  
    }
  `;
}
function generateImportSuperEntity(package_name, entity, supertype, importedEntities) {
  if (isLocalEntity(supertype)) {
    return `import ${package_name.replace(entity.$container.name.toLowerCase(), generateImportEntity(supertype, importedEntities))}.models.${supertype.name};`;
  }
  return `import br.nemo.immigrant.ontology.entity.${generateImportEntity(supertype, importedEntities)}.models.${supertype.name};`;
}
function generateImportEntity(entity, importedEntities) {
  if (isLocalEntity(entity)) {
    return `${entity.$container.name.toLowerCase()}`;
  }
  const moduleImport = importedEntities.get(entity);
  return `${moduleImport?.library.toLocaleLowerCase()}.${entity.$container.name.toLowerCase()}`;
}
function generateAttribute(attribute, is_abstract) {
  return import_generate4.expandToStringWithNL`
  ${generateUniqueCollumn(attribute)}
  ${is_abstract ? `protected` : `private`} ${capitalizeString((0, import_generate4.toString)(generateTypeAttribute(attribute)) ?? "NOTYPE")} ${attribute.name};
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
  const node = new import_generate4.CompositeGeneratorNode();
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
        return import_generate4.expandToStringWithNL`
        @OneToOne
        @JoinColumn(name = "${tgt.name.toLowerCase()}_id", referencedColumnName = "id")
        private ${tgt.name} ${tgt.name.toLowerCase()};
      `;
      } else {
        return import_generate4.expandToStringWithNL`
        @OneToOne(cascade = {CascadeType.ALL}, orphanRemoval = true, mappedBy = "${cls.name.toLowerCase()}")
        @Builder.Default
        private ${tgt.name} ${tgt.name.toLowerCase()} = null;
      `;
      }
    case "OneToMany":
      if (owner) {
        return "";
      } else {
        return import_generate4.expandToStringWithNL`
        @OneToMany(cascade = {CascadeType.ALL}, orphanRemoval = true, mappedBy = "${cls.name.toLowerCase()}")
        @Builder.Default
        Set<${tgt.name}> ${tgt.name.toLowerCase()}s = new HashSet<>();
      `;
      }
    case "ManyToOne":
      if (owner) {
        return import_generate4.expandToStringWithNL`
        @ManyToOne
        @JoinColumn(name = "${tgt.name.toLowerCase()}_id")
        private ${tgt.name} ${tgt.name.toLowerCase()};
      `;
      } else {
        return "";
      }
    case "ManyToMany":
      if (owner) {
        return import_generate4.expandToStringWithNL`
        @ManyToMany
        @JoinTable(
            name = "${cls.name.toLowerCase()}_${tgt.name.toLowerCase()}",
            joinColumns = @JoinColumn(name = "${cls.name.toLowerCase()}_id"),
            inverseJoinColumns = @JoinColumn(name = "${tgt.name.toLowerCase()}_id")
        )
        @Builder.Default
        private Set<${tgt.name}> ${tgt.name.toLowerCase()}s = new HashSet<>();
      `;
      } else {
        return import_generate4.expandToStringWithNL`
        @ManyToMany(mappedBy = "${cls.name.toLowerCase()}s")
        @Builder.Default
        private Set<${tgt.name}> ${tgt.name.toLowerCase()}s = new HashSet<>();
      `;
      }
  }
}
function createEnum(enumEntityAtribute) {
  return import_generate4.expandToString`
  @Builder.Default
  @Enumerated(EnumType.STRING)
  private ${enumEntityAtribute.type.ref?.name} ${enumEntityAtribute.name.toLowerCase()} = ${enumEntityAtribute.type.ref?.name}.${enumEntityAtribute.type.ref?.attributes[0].name.toUpperCase()};
  `;
}
function generateEnum2(cls) {
  return import_generate4.expandToStringWithNL`
  ${cls.enumentityatributes.map((enumEntityAtribute) => createEnum(enumEntityAtribute)).join("\n")}
  `;
}

// packages/java-generator/entity/module-generator.ts
function generateModules(model, target_folder) {
  const package_path = model.configuration?.package_path ?? "base";
  const modules = model.abstractElements.filter(isModule);
  const all_entities = modules.map((module2) => module2.elements.filter(isLocalEntity)).flat();
  const relation_maps = processRelations(all_entities);
  const imported_entities = processImportedEntities(model);
  for (const mod of modules) {
    const package_name = `${package_path}.entity.${model.configuration?.name}.${mod.name.toLowerCase()}`;
    const MODULE_PATH = createPath(target_folder, "src/main/java/", package_name.replaceAll(".", "/"));
    const REPOSITORIES_PATH = createPath(MODULE_PATH, "repositories");
    const MODELS_PATH = createPath(MODULE_PATH, "models");
    const supertype_classes = processSupertypes(mod);
    const mod_classes = mod.elements.filter(isLocalEntity);
    for (const cls of mod_classes) {
      const class_name = cls.name;
      const { attributes, relations } = getAttrsAndRelations(cls, relation_maps);
      attributes;
      import_fs4.default.writeFileSync(import_path4.default.join(MODELS_PATH, `${class_name}.java`), (0, import_generate5.toString)(generateModel(cls, supertype_classes.has(cls), relations, package_name, imported_entities)));
      if (!cls.is_abstract) {
        import_fs4.default.writeFileSync(import_path4.default.join(REPOSITORIES_PATH, `${class_name}Repository.java`), (0, import_generate5.toString)(generateClassRepository(cls, package_name, imported_entities)));
      }
    }
    for (const enumx of mod.elements.filter(isEnumX)) {
      import_fs4.default.writeFileSync(import_path4.default.join(MODELS_PATH, `${enumx.name}.java`), generateEnum(enumx, package_name));
    }
  }
}
function processImportedEntities(application) {
  const map = /* @__PURE__ */ new Map();
  for (const moduleImport of application.abstractElements.filter(isModuleImport)) {
    moduleImport.entities.map((importedEntity) => map.set(importedEntity, moduleImport));
  }
  return map;
}
function processSupertypes(mod) {
  const set = /* @__PURE__ */ new Set();
  for (const cls of mod.elements.filter(isLocalEntity)) {
    if (cls.superType?.ref != null && isLocalEntity(cls.superType?.ref)) {
      set.add(cls.superType?.ref);
    }
  }
  return set;
}
function getAttrsAndRelations(cls, relation_map) {
  if (cls.superType?.ref != null && isLocalEntity(cls.superType?.ref)) {
    const parent = cls.superType?.ref;
    const { attributes, relations } = getAttrsAndRelations(parent, relation_map);
    return {
      attributes: attributes.concat(cls.attributes),
      relations: relations.concat(relation_map.get(cls) ?? [])
    };
  } else {
    return {
      attributes: cls.attributes,
      relations: relation_map.get(cls) ?? []
    };
  }
}
function generateClassRepository(cls, package_name, importedEntities) {
  return import_generate5.expandToStringWithNL`
    package ${package_name}.repositories;

    import ${package_name}.models.${cls.name};
    import org.springframework.data.repository.PagingAndSortingRepository;
    import org.springframework.data.repository.ListCrudRepository;
    import java.util.Optional;
    import br.nemo.immigrant.ontology.entity.eo.teams.repositories.projections.IDProjection;

    public interface ${cls.name}Repository extends PagingAndSortingRepository<${cls.name}, Long>, ListCrudRepository<${cls.name}, Long> {

      Optional<IDProjection> findByExternalId(String externalId);

      Optional<IDProjection> findByInternalId(String internalId);

      Boolean existsByInternalId(String internalId);
    
    }
  `;
}

// packages/java-generator/entity/sql-generator.ts
var import_path5 = __toESM(require("path"), 1);
var import_fs5 = __toESM(require("fs"), 1);
var import_generate6 = require("langium/generate");
function generateSchemaSQLHelper(model, target_folder) {
  if (model.configuration) {
    const SQL_PATH = createPath(target_folder, "sql");
    import_fs5.default.writeFileSync(import_path5.default.join(SQL_PATH, "sql_unique_constrains.sql"), (0, import_generate6.toString)(generateSQL(model)));
  }
}
function generateSQLCommand(entity) {
  var atributesUnique = [];
  for (const attribute of entity.attributes) {
    if (attribute?.unique && !entity.is_abstract) {
      atributesUnique.push(attribute);
    }
  }
  if (atributesUnique.length) {
    return import_generate6.expandToString`
  ALTER TABLE public.${entity.name.toLowerCase()} ADD CONSTRAINT ${entity.name.toLowerCase()}_unique_constrain UNIQUE (${atributesUnique.map((a) => `${a.name}`).join(`,`)});
  `;
  }
  return void 0;
}
function generateSQL(model) {
  return import_generate6.expandToStringWithNL`
    ${model.abstractElements.filter(isModule).map((module2) => module2.elements.filter(isLocalEntity).map((entity) => generateSQLCommand(entity)).join("\n")).join("\n")}  
    `;
}

// packages/java-generator/entity/generator.ts
function generate(model, target_folder) {
  import_fs6.default.mkdirSync(target_folder, { recursive: true });
  generateConfigs(model, target_folder);
  generateModules(model, target_folder);
  generateSchemaSQLHelper(model, target_folder);
  generateDebezium(model, target_folder);
}

// packages/java-generator/webservice/index.ts
var webservice_exports = {};
__export(webservice_exports, {
  generate: () => generate2,
  generateConfigs: () => generateConfigs2,
  generateGraphQL: () => generateGraphQL,
  generateModules: () => generateModules2
});

// packages/java-generator/webservice/config-generator.ts
var import_path6 = __toESM(require("path"), 1);
var import_fs7 = __toESM(require("fs"), 1);
var import_generate7 = require("langium/generate");
function generateConfigs2(model, target_folder) {
  if (model.configuration) {
    import_fs7.default.writeFileSync(import_path6.default.join(target_folder, "Dockerfile"), (0, import_generate7.toString)(generateDockerFile()));
    import_fs7.default.writeFileSync(import_path6.default.join(target_folder, "docker-compose-database.yml"), (0, import_generate7.toString)(generateComposeDatabase(model.configuration)));
    import_fs7.default.writeFileSync(import_path6.default.join(target_folder, "docker-compose.yml"), (0, import_generate7.toString)(generateCompose(model.configuration)));
    const RESOURCE_PATH = createPath(target_folder, "src/main/resources");
    import_fs7.default.writeFileSync(import_path6.default.join(target_folder, "pom.xml"), (0, import_generate7.toString)(generatePOMXML2(model)));
    import_fs7.default.writeFileSync(import_path6.default.join(RESOURCE_PATH, "logback.xml"), (0, import_generate7.toString)(generatelogback2()));
    import_fs7.default.writeFileSync(import_path6.default.join(RESOURCE_PATH, "application.properties"), (0, import_generate7.toString)(applicationProperties2(model.configuration)));
  }
}
function generateDockerFile() {
  return import_generate7.expandToStringWithNL`
  # Use an official Maven image as the base image
  FROM maven:3.8.4-openjdk-17-slim

  # Set the working directory inside the container
  WORKDIR /app

  # Copy the Maven project file and download dependencies
  COPY pom.xml .
  RUN mvn dependency:go-offline

  # Copy the application source code
  COPY src ./src

  # Build the application
  RUN mvn package

  # Expose the port that the application will run on
  EXPOSE 8080

  # Specify the command to run your application
  CMD ["mvn", "spring-boot:run"]

  `;
}
function applicationProperties2(configuration) {
  return import_generate7.expandToStringWithNL`
  spring.datasource.initialization-mode=always
  spring.datasource.url =  jdbc:postgresql://localhost:5432/${configuration.database_name}
  spring.datasource.username = postgres
  spring.datasource.password = postgres
  spring.datasource.platform= postgres
  #spring.jpa.hibernate.ddl-auto = update
  spring.jpa.hibernate.ddl-auto = create-drop
  
  spring.jpa.properties.javax.persistence.schema-generation.create-source=metadata
  spring.jpa.properties.javax.persistence.schema-generation.scripts.action=create-drop
  spring.jpa.properties.javax.persistence.schema-generation.scripts.drop-target=sql/${configuration.database_name?.toLowerCase()}.sql
  spring.jpa.properties.javax.persistence.schema-generation.scripts.create-target=sql/${configuration.database_name?.toLowerCase()}.sql

  logging.level.org.hibernate.SQL=DEBUG
  server.port=8081

  springdoc.swagger-ui.path=/
  springdoc.packagesToScan=${configuration.package_path}.*

  spring.graphql.graphiql.enabled: true
  spring.graphql.schema.locations=classpath:graphql/ 
  spring.graphql.schema.fileExtensions=.graphqls, .gqls
  `;
}
function generatelogback2() {
  return import_generate7.expandToStringWithNL`
  <?xml version="1.0" encoding="UTF-8"?>
  <configuration>
      <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
          <encoder>
              <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n
              </pattern>
          </encoder>
      </appender>

      <root level="INFO">
          <appender-ref ref="STDOUT" />
      </root>
  </configuration>
  `;
}
function generatePOMXML2(application) {
  const name = application.configuration?.name?.toLocaleLowerCase();
  return import_generate7.expandToStringWithNL`
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.1.0</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>${application.configuration?.package_path?.toLocaleLowerCase()}.service.</groupId>
	<artifactId>${name}</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>${name}</name>
	<description>${application.configuration?.description}</description>
	<properties>
		<java.version>17</java.version>
        <start-class>${application.configuration?.package_path}.service.${name}.application.Application</start-class>
	</properties>

  <repositories>
  <repository>
    <id>gitlab-maven</id>
    <url>https://gitlab.com/api/v4/groups/#change/-/packages/maven</url>
  </repository>
</repositories>


	<dependencies>

    <dependency>
      <groupId>${application.configuration?.package_path}.entity</groupId>
      <artifactId>${name}</artifactId>
      <version>0.0.1-SNAPSHOT</version>
    </dependency>

    ${application.abstractElements.filter(isModuleImport).map((moduleImport) => generateOntologyDependency2(moduleImport)).join("\n")}

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-rest</artifactId>
		</dependency>
    <dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-commons</artifactId>
    </dependency>


    <dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
  
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-common</artifactId>
    <version>2.0.2</version>
</dependency>

<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-graphql</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

   <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>2.0.2</version>
   </dependency>




	</dependencies>


	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>
  `;
}
function generateOntologyDependency2(moduleImported) {
  return import_generate7.expandToStringWithNL`
  <dependency>
  <groupId>${moduleImported.package_path.toLowerCase()}</groupId>
  <artifactId>${moduleImported.library.toLowerCase()}</artifactId>
  <version>0.0.1-SNAPSHOT</version>
</dependency>
  `;
}
function generateCompose(configuration) {
  const name = configuration.name?.toLocaleLowerCase();
  return import_generate7.expandToStringWithNL`
  version: '3.9'
  services:
    ontology_service:
      container_name: ${name}_service
      build: .
      image: registry.gitlab.com/immigrant-data-driven-development/services/${name}
      ports:
        - "8080:8080"
  networks: 
    default: 
      name: base-infrastrutrure
      external: true
  
  `;
}
function generateComposeDatabase(configuration) {
  const projectName = configuration.name?.toLocaleLowerCase();
  const databaseName = configuration.database_name?.toLocaleLowerCase();
  return import_generate7.expandToStringWithNL`
    version: '3.7'

    services:
      postgres:
        image: postgres
        ports:
          - "5432:5432"
        restart: always
        environment:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: ${databaseName ?? projectName ?? "-"}
          POSTGRES_USER: postgres
        volumes:
          - ./data:/var/lib/postgresql
          - ./pg-initdb.d:/docker-entrypoint-initdb.d
  `;
}

// packages/java-generator/webservice/generator.ts
var import_fs10 = __toESM(require("fs"), 1);

// packages/java-generator/webservice/module-generator.ts
var import_path7 = __toESM(require("path"), 1);
var import_fs8 = __toESM(require("fs"), 1);
var import_generate8 = require("langium/generate");
function generateModules2(model, target_folder) {
  const package_path = model.configuration?.package_path ?? "base";
  const modules = model.abstractElements.filter(isModule);
  if (model.configuration) {
    const package_name_application = `${package_path}.service.${model.configuration?.name?.toLocaleLowerCase()}.application`;
    const APPLICATION_PATH = createPath(target_folder, "src/main/java/", package_name_application.replaceAll(".", "/"));
    import_fs8.default.writeFileSync(import_path7.default.join(APPLICATION_PATH, `Application.java`), applicationGenerator(package_name_application, model.configuration));
  }
  for (const mod of modules) {
    const package_name = `${package_path}.service.${model.configuration?.name?.toLocaleLowerCase()}.${mod.name.toLowerCase()}`;
    const MODULE_PATH = createPath(target_folder, "src/main/java/", package_name.replaceAll(".", "/"));
    const REPOSITORIES_PATH = createPath(MODULE_PATH, "repositories");
    const CONTROLLERS_PATH = createPath(MODULE_PATH, "controllers");
    const RECORDS_PATH = createPath(MODULE_PATH, "records");
    const mod_classes = mod.elements.filter(isLocalEntity);
    for (const cls of mod_classes) {
      const class_name = cls.name;
      if (!cls.is_abstract) {
        import_fs8.default.writeFileSync(import_path7.default.join(REPOSITORIES_PATH, `${class_name}RepositoryWeb.java`), (0, import_generate8.toString)(generateClassRepository2(cls, package_name)));
        import_fs8.default.writeFileSync(import_path7.default.join(CONTROLLERS_PATH, `${class_name}Controller.java`), (0, import_generate8.toString)(generateClassController(cls, package_name)));
        import_fs8.default.writeFileSync(import_path7.default.join(RECORDS_PATH, `${class_name}Input.java`), (0, import_generate8.toString)(generateRecord(cls, package_name)));
      }
    }
  }
}
function applicationGenerator(path_package, configuration) {
  return import_generate8.expandToStringWithNL`
  package ${path_package};

  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
  import org.springframework.boot.autoconfigure.*;
  import org.springframework.context.annotation.*;
  import org.springframework.boot.autoconfigure.domain.EntityScan;
  import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

  import io.swagger.v3.oas.annotations.OpenAPIDefinition;
  import io.swagger.v3.oas.annotations.info.Info;

  @SpringBootApplication
  @EnableAutoConfiguration
  @ComponentScan(basePackages = {"${path_package.replace("application", "")}*"})
  @EntityScan(basePackages = {"${path_package.replace("application", "").replace("service", "entity")}*"})
  @EnableJpaRepositories(basePackages = {"${path_package.replace("application", "")}*"})
  @OpenAPIDefinition(info = @Info(
    title = "${configuration.name ?? "-"}", 
    version = "1.0", 
    description = "${configuration.description}"))

  public class Application {

    public static void main(String[] args) {
      SpringApplication.run(Application.class, args);
    }
  }
  `;
}
function generateClassRepository2(cls, package_name) {
  return import_generate8.expandToStringWithNL`
    package ${package_name}.repositories;

    import ${package_name.replace("service", "entity")}.models.${cls.name};
    import ${package_name.replace("service", "entity")}.repositories.${cls.name}Repository;

    import org.springframework.data.rest.core.annotation.RestResource;
    import org.springframework.data.rest.core.annotation.RepositoryRestResource;

    @RepositoryRestResource(collectionResourceRel = "${cls.name.toLowerCase()}", path = "${cls.name.toLowerCase()}")
    public interface ${cls.name}RepositoryWeb extends ${cls.name}Repository {
    
    }
  `;
}
function generateRecord(cls, package_name) {
  var att = cls.attributes;
  if (isLocalEntity(cls.superType?.ref)) {
    att = cls.attributes.concat(cls.superType?.ref?.attributes ?? []);
  }
  return import_generate8.expandToStringWithNL`
  package ${package_name}.records;
  import java.time.LocalDate;
  public record ${cls.name}Input( ${att.map((att2) => generateRecordAtribute(att2)).join(",")} ) {
  }
  `;
}
function generateRecordAtribute(attribute) {
  return import_generate8.expandToString`
${capitalizeString((0, import_generate8.toString)(generateTypeAttribute2(attribute))) ?? "Not Type"} ${attribute.name} 
`;
}
function generateTypeAttribute2(attribute) {
  if (attribute.type.toString().toLowerCase() === "date") {
    return "LocalDate";
  }
  return attribute.type;
}
function generateClassController(cls, package_name) {
  var att = cls.attributes;
  if (isLocalEntity(cls.superType?.ref)) {
    att = cls.attributes.concat(cls.superType?.ref?.attributes ?? []);
  }
  return import_generate8.expandToStringWithNL`
    package ${package_name}.controllers;

    import ${package_name.replace("service", "entity")}.models.${cls.name};
    import ${package_name.replace("service", "entity")}.repositories.${cls.name}Repository;
    import ${package_name}.records.${cls.name}Input;

    import org.springframework.beans.factory.annotation.Autowired;
    
    import org.springframework.graphql.data.method.annotation.Argument;
    import org.springframework.graphql.data.method.annotation.MutationMapping;
    import org.springframework.graphql.data.method.annotation.QueryMapping;
    
    import org.springframework.stereotype.Controller;

    import java.util.List;

    @Controller
    public class ${cls.name}Controller  {

      @Autowired
      ${cls.name}Repository repository;

      @QueryMapping
      public List<${cls.name}> findAll${cls.name}s() {
        return repository.findAll();
      }

      @QueryMapping
      public ${cls.name} findByID${cls.name}(@Argument Long id) {
        return repository.findById(id).orElse(null);
      }

      /* https://github.com/danvega/graphql-books
      Usar isso para relacao entre os conceitos https://www.danvega.dev/blog/2023/03/20/graphql-mutations/
      */

      @MutationMapping
      public ${cls.name} create${cls.name}(@Argument ${cls.name}Input input) {
        ${cls.name} instance = ${cls.name}.builder().${att.map((att2) => `${att2.name}(input.${att2.name}())`).join(".\n")}.build();  

        return repository.save(instance);
      }

      @MutationMapping
      public ${cls.name} update${cls.name}(@Argument Long id, @Argument ${cls.name}Input input) {
        ${cls.name} instance = repository.findById(id).orElse(null);
        if(instance == null) {
            throw new RuntimeException("${cls.name} not found");
        }
        ${att.map((att2) => `instance.set${capitalizeString(att2.name)}(input.${att2.name}());`).join("\n")}
        repository.save(instance);
        return instance;
      }
      
      @MutationMapping
      public void delete${cls.name}(@Argument Long id) {
        repository.deleteById(id);
      }
    
    }
  `;
}

// packages/java-generator/webservice/graphql-generator.ts
var import_path8 = __toESM(require("path"), 1);
var import_fs9 = __toESM(require("fs"), 1);
var import_generate9 = require("langium/generate");
function generateGraphQL(application, target_folder) {
  if (application.configuration) {
    const RESOURCE_PATH = createPath(target_folder, "src/main/resources");
    const GRAPHQL_PATH = createPath(RESOURCE_PATH, "graphql");
    import_fs9.default.writeFileSync(import_path8.default.join(GRAPHQL_PATH, "schema.graphqls"), (0, import_generate9.toString)(generateSchemaGraphQL(application)));
  }
}
function generateTypeSchemaGraphQL(entity) {
  var att = entity.attributes;
  if (isLocalEntity(entity.superType?.ref)) {
    att = entity.attributes.concat(entity.superType?.ref?.attributes ?? []);
  }
  return import_generate9.expandToStringWithNL`
    type ${entity.name}{
        id: ID!
        ${att.map((atribute) => `${atribute.name}:String!`).join("\n")}
    }
    `;
}
function generateInputTypeSchemaGraphQL(entity) {
  var att = entity.attributes;
  if (isLocalEntity(entity.superType?.ref)) {
    att = entity.attributes.concat(entity.superType?.ref?.attributes ?? []);
  }
  return import_generate9.expandToStringWithNL`
    input ${entity.name}Input{
      ${att.map((atribute) => `${atribute.name}:String!`).join("\n")}
    }
    `;
}
function generateSchemaGraphQL(application) {
  const modules = application.abstractElements.filter(isModule);
  const all_entities = modules.map((module2) => module2.elements.filter(isLocalEntity)).flat();
  return import_generate9.expandToStringWithNL`
    
    ${all_entities.map((entity) => entity.is_abstract ? "" : (0, import_generate9.toString)(generateTypeSchemaGraphQL(entity))).join("\n")}
    
    ${all_entities.map((entity) => entity.is_abstract ? "" : (0, import_generate9.toString)(generateInputTypeSchemaGraphQL(entity))).join("\n")}
  
    type Query{
      ${all_entities.map((entity) => entity.is_abstract ? "" : `findAll${entity.name}s:[${entity.name}]`).join("\n")}
      ${all_entities.map((entity) => entity.is_abstract ? "" : `findByID${entity.name} (id: ID!):${entity.name}`).join("\n")}
    }
    
    type Mutation{
      ${all_entities.map((entity) => entity.is_abstract ? "" : `create${entity.name}(input: ${entity.name}Input):${entity.name}`).join("\n")}
      ${all_entities.map((entity) => entity.is_abstract ? "" : `delete${entity.name} (id: ID!):${entity.name}`).join("\n")}
      ${all_entities.map((entity) => entity.is_abstract ? "" : `update${entity.name} (id: ID!, input: ${entity.name}Input):${entity.name}`).join("\n")}
    }`;
}

// packages/java-generator/webservice/generator.ts
function generate2(model, target_folder) {
  import_fs10.default.mkdirSync(target_folder, { recursive: true });
  generateConfigs2(model, target_folder);
  generateModules2(model, target_folder);
  generateGraphQL(model, target_folder);
}

// packages/java-generator/documentation/generators.ts
var import_fs11 = __toESM(require("fs"), 1);
var import_path9 = __toESM(require("path"), 1);
var import_generate10 = require("langium/generate");
function generate3(model, target_folder) {
  import_fs11.default.mkdirSync(target_folder, { recursive: true });
  if (model.configuration) {
    import_fs11.default.writeFileSync(import_path9.default.join(target_folder, "README.md"), createProjectReadme(model.configuration));
    import_fs11.default.writeFileSync(import_path9.default.join(target_folder, ".gitlab-ci.yml"), createGitlab());
  }
}
function createGitlab() {
  return import_generate10.expandToStringWithNL`
    variables:
    CONTAINER_TEST_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG
    CONTAINER_RELEASE_IMAGE: $CI_REGISTRY_IMAGE:latest

    stages:
    - build-entity
    - build-webservice
    - release-webservice

    maven-build:
    stage: build-entity
    image: maven:latest
    script: 
        - cd entity
        - mvn deploy -s settings.xml -DskipTests

    build-webservice:
    stage: build-webservice
    image: docker:20.10.16
    services:
        - docker:20.10.16-dind
    before_script:
        - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    script:
        - cd webservice
        - docker build --pull -t $CONTAINER_TEST_IMAGE .
        - docker push $CONTAINER_TEST_IMAGE

    release-master-webservice:
    stage: release-webservice
    image: docker:20.10.16
    services:
        - docker:20.10.16-dind
    before_script:
        - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    script:
        - cd webservice
        - docker pull $CONTAINER_TEST_IMAGE
        - docker tag $CONTAINER_TEST_IMAGE $CONTAINER_RELEASE_IMAGE
        - docker push $CONTAINER_RELEASE_IMAGE
    only:
        - main

    release-dev-webservice:
    stage: release-webservice
    script:
        - cd webservice
        - docker pull $CONTAINER_TEST_IMAGE
        - docker tag $CONTAINER_TEST_IMAGE $CONTAINER_TEST_IMAGE
        - docker push $CONTAINER_TEST_IMAGE
    only:
        - dev

    `;
}
function stackREADME() {
  return import_generate10.expandToStringWithNL`
        1. Spring Boot 3.0
        2. Spring Data Rest
        3. Spring GraphQL
        
    `;
}
function createProjectReadme(configuration) {
  return import_generate10.expandToStringWithNL`
    # ${configuration.name}
    ## 🚀 Goal
    ${configuration.description}

    ## 📕 Domain Documentation
    
    Domain documentation can be found [here](./docs/README.md)

    ## ⚙️ Requirements

    1. Postgresql
    2. Java 17
    3. Maven

    ## ⚙️ Stack 
    ${stackREADME()}

    ## 🔧 Install

    1) Create a database with name ${configuration.name} with **CREATE DATABASE ${configuration.name}**.
    2) Run the command to start the webservice and create table of database:

    \`\`\`bash
    mvn Spring-boot:run 
    \`\`\`

    ## Debezium

    Go to folder named *register* and performs following command to register in debezium:

    \`\`\`bash
    curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @register-sro.json
    \`\`\`

    To delete, uses:

    \`\`\`bash
    curl -i -X DELETE localhost:8083/connectors/sro-connector/
    \`\`\`
        
    
    ## 🔧 Usage

    * Access [http://localhost:8081](http://localhost:8081) to see Swagger 
    * Access [http://localhost:8081/grapiql](http://localhost:8081/grapiql) to see Graphql.

    `;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  java
});
//# sourceMappingURL=index.cjs.map