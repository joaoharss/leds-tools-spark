"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModules = generateModules;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ast_js_1 = require("../../shared/ast.js");
const generator_utils_js_1 = require("../../shared/generator-utils.js");
const generate_1 = require("langium/generate");
function generateModules(model, target_folder) {
    const package_path = model.configuration?.package_path ?? 'base';
    const modules = model.abstractElements.filter(ast_js_1.isModule);
    if (model.configuration) {
        const package_name_application = `${package_path}.service.${model.configuration?.name?.toLocaleLowerCase()}.application`;
        const APPLICATION_PATH = (0, generator_utils_js_1.createPath)(target_folder, "src/main/java/", package_name_application.replaceAll(".", "/"));
        fs_1.default.writeFileSync(path_1.default.join(APPLICATION_PATH, `Application.java`), applicationGenerator(package_name_application, model.configuration));
    }
    for (const mod of modules) {
        const package_name = `${package_path}.service.${model.configuration?.name?.toLocaleLowerCase()}.${mod.name.toLowerCase()}`;
        const MODULE_PATH = (0, generator_utils_js_1.createPath)(target_folder, "src/main/java/", package_name.replaceAll(".", "/"));
        const REPOSITORIES_PATH = (0, generator_utils_js_1.createPath)(MODULE_PATH, 'repositories');
        const CONTROLLERS_PATH = (0, generator_utils_js_1.createPath)(MODULE_PATH, 'controllers');
        const RECORDS_PATH = (0, generator_utils_js_1.createPath)(MODULE_PATH, 'records');
        const mod_classes = mod.elements.filter(ast_js_1.isLocalEntity);
        for (const cls of mod_classes) {
            const class_name = cls.name;
            if (!cls.is_abstract) {
                fs_1.default.writeFileSync(path_1.default.join(REPOSITORIES_PATH, `${class_name}RepositoryWeb.java`), (0, generate_1.toString)(generateClassRepository(cls, package_name)));
                fs_1.default.writeFileSync(path_1.default.join(CONTROLLERS_PATH, `${class_name}Controller.java`), (0, generate_1.toString)(generateClassController(cls, package_name)));
                fs_1.default.writeFileSync(path_1.default.join(RECORDS_PATH, `${class_name}Input.java`), (0, generate_1.toString)(generateRecord(cls, package_name)));
            }
        }
    }
}
function applicationGenerator(path_package, configuration) {
    return (0, generate_1.expandToStringWithNL) `
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
function generateClassRepository(cls, package_name) {
    return (0, generate_1.expandToStringWithNL) `
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
    if ((0, ast_js_1.isLocalEntity)(cls.superType?.ref)) {
        att = cls.attributes.concat(cls.superType?.ref?.attributes ?? []);
    }
    return (0, generate_1.expandToStringWithNL) `
  package ${package_name}.records;
  import java.time.LocalDate;
  public record ${cls.name}Input( ${att.map(att => generateRecordAtribute(att)).join(',')} ) {
  }
  `;
}
function generateRecordAtribute(attribute) {
    return (0, generate_1.expandToString) `
${(0, generator_utils_js_1.capitalizeString)((0, generate_1.toString)(generateTypeAttribute(attribute))) ?? 'Not Type'} ${attribute.name} 
`;
}
function generateTypeAttribute(attribute) {
    if (attribute.type.toString().toLowerCase() === "date") {
        return "LocalDate";
    }
    return attribute.type;
}
function generateClassController(cls, package_name) {
    var att = cls.attributes;
    if ((0, ast_js_1.isLocalEntity)(cls.superType?.ref)) {
        att = cls.attributes.concat(cls.superType?.ref?.attributes ?? []);
    }
    return (0, generate_1.expandToStringWithNL) `
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
        ${cls.name} instance = ${cls.name}.builder().${att.map(att => `${att.name}(input.${att.name}())`).join(".\n")}.build();  

        return repository.save(instance);
      }

      @MutationMapping
      public ${cls.name} update${cls.name}(@Argument Long id, @Argument ${cls.name}Input input) {
        ${cls.name} instance = repository.findById(id).orElse(null);
        if(instance == null) {
            throw new RuntimeException("${cls.name} not found");
        }
        ${att.map(att => `instance.set${(0, generator_utils_js_1.capitalizeString)(att.name)}(input.${att.name}());`).join("\n")}
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
