import path from 'path';
import fs from 'fs';
import { createPath } from '../../shared/generator-utils.js';
import { isLocalEntity, isModule } from '../../shared/ast.js';
import { expandToString, expandToStringWithNL, toString } from 'langium/generate';
export function generateSchemaSQLHelper(model, target_folder) {
    if (model.configuration) {
        // criando a pasta que salva o SQL
        const SQL_PATH = createPath(target_folder, "sql");
        fs.writeFileSync(path.join(SQL_PATH, 'sql_unique_constrains.sql'), toString(generateSQL(model)));
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
        return expandToString `
  ALTER TABLE public.${entity.name.toLowerCase()} ADD CONSTRAINT ${entity.name.toLowerCase()}_unique_constrain UNIQUE (${atributesUnique.map(a => `${a.name}`).join(`,`)});
  `;
    }
    return undefined;
}
function generateSQL(model) {
    return expandToStringWithNL `
    ${model.abstractElements.filter(isModule).map(module => module.elements.filter(isLocalEntity).map(entity => generateSQLCommand(entity)).join('\n')).join('\n')}  
    `;
}
