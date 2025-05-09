import path from "path";
import fs from "fs";
import { isLocalEntity, isModule, } from "../../../shared/ast.js";
import { expandToStringWithNL } from "langium/generate";
import { capitalizeString } from "../../../shared/generator-utils.js";
export function generate(model, target_folder) {
    7;
    console.log(model.configuration?.feature);
    fs_1.default.writeFileSync(path_1.default.join(target_folder, `Program.cs`), generateProgram(model, target_folder));
}
function generateProgram(model, target_folder) {
    const modules = model.abstractElements.filter(ast_js_1.isModule);
    const features = model.configuration?.feature;
    return (0, generate_1.expandToStringWithNL) `
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Shared;
    
    // modules
    ${generateModuleNames(modules)}

    internal class Program
    {
        private static void Main(String[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<ContextDb>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("${(0, generator_utils_js_1.capitalizeString)(model.configuration?.name || "model")}Connection")));
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            ${generateFeatureBuilder(features)}

            var app = builder.Build();

            // Automatically apply migrations at startup
            CreateDatabase(app);

            void CreateDatabase(WebApplication app)
            {
                var serviceScope = app.Services.CreateScope();
                var dataContext = serviceScope.ServiceProvider.GetService<ContextDb>();
                dataContext?.Database.EnsureCreated();
                dataContext?.Database.Migrate();
            }

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Mapgroups:
            ${generateMapGroups(features, modules)}
            
            app.MapGet("/", () => "Hello World!");
            ${generateFeatureCors(features)}
            app.Run();
        }
    }
    `;
}
function generateModuleNames(modules) {
    let moduleNames = "";
    for (const mod of modules) {
        moduleNames += `using ${mod.name}; \n`;
    }
    return moduleNames;
}
function generateMapGroups(features, modules) {
    let mapGroups = "";
    if (features == 'authentication') {
        mapGroups += `// Authentication Mapgroup
app.MapGroup("/identity").MapIdentityApi<IdentityUser>();`;
    }
    for (const mod of modules) {
        mapGroups += `var ${mod.name.toLowerCase()} = app.MapGroup("/${mod.name}"); \n \n`;
        const mod_classes = mod.elements.filter(ast_js_1.isLocalEntity);
        for (const classe of mod_classes) {
            mapGroups += `var ${classe.name.toLowerCase()} = ${mod.name.toLowerCase()}.MapGroup("/${classe.name}"); \n`;
            mapGroups += `${classe.name.toLowerCase()}.MapGet("/", async (ContextDb db) =>\n    await db.${classe.name}s.ToListAsync());\n`;
            mapGroups += `${classe.name.toLowerCase()}.MapGet("/{id}", async (int id, ContextDb db) =>\n    await db.${classe.name}s.FindAsync(id) \n        is ${classe.name} ${classe.name.toLowerCase()} \n        ? Results.Ok(${classe.name.toLowerCase()}) \n        : Results.NotFound()); \n \n`;
            mapGroups += `${classe.name.toLowerCase()}.MapPost("/", async (${classe.name} ${classe.name.toLowerCase()}, ContextDb db) => \n{ \n    db.${classe.name}s.Add(${classe.name.toLowerCase()}); \n    await db.SaveChangesAsync(); \n    return Results.Created($"/${classe.name.toLowerCase()}/{${classe.name.toLowerCase()}.Id}", ${classe.name.toLowerCase()});\n}); \n \n`;
            mapGroups += `${classe.name.toLowerCase()}.MapPut("/{id}", async (int id, ${classe.name} input${classe.name}, ContextDb db) => \n{ \n    var ${classe.name.toLowerCase()} = await db.${classe.name}s.FindAsync(id); \n    if (${classe.name.toLowerCase()} is null) return Results.NotFound(); ${generateInputs(classe)}\n    await db.SaveChangesAsync(); \n    return Results.NoContent(); \n}); \n \n`;
            mapGroups += `${classe.name.toLowerCase()}.MapDelete("/{id}", async (int id, ContextDb db) => \n{ \n    if (await db.${classe.name}s.FindAsync(id) is ${classe.name} ${classe.name.toLowerCase()}) { \n        db.${classe.name}s.Remove(${classe.name.toLowerCase()}); \n        await db.SaveChangesAsync(); \n        return Results.NoContent(); \n    } \n \n return Results.NotFound(); \n}); \n \n`;
        }
    }
    return mapGroups;
}
function generateInputs(classe) {
    let inputs = "";
    for (const att of classe.attributes) {
        inputs += `\n        ${classe.name.toLowerCase()}.${(0, generator_utils_js_1.capitalizeString)(att.name)} = input${classe.name}.${(0, generator_utils_js_1.capitalizeString)(att.name)};`;
    }
    return inputs;
}
function generateFeatureBuilder(features) {
    if (features == 'authentication') {
        return (0, generate_1.expandToStringWithNL) `
        // Authentication Builder
        builder.Services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<ContextDb>();
        
        builder.Services.AddCors();
        builder.Services.AddAuthorization();`;
    }
    return '';
}
function generateFeatureCors(features) {
    if (features == 'authentication') {
        return (0, generate_1.expandToStringWithNL) `
        app.UseCors();`;
    }
    return '';
}
