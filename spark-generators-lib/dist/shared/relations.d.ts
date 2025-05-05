import { LocalEntity } from "./ast.js";
export type RelationInfo = {
    tgt: LocalEntity;
    card: RelationType;
    owner: boolean;
};
type RelationType = 'OneToMany' | 'OneToOne' | 'ManyToOne' | 'ManyToMany';
/**
 * Dado um módulo, lê todas as relações internas dele,
 * retornando um mapa que mapeia um Class para a lista
 * de {alvo, cardinalidade e ownership} de suas relações
 */
export declare function processRelations(localEntities: LocalEntity[]): Map<LocalEntity, RelationInfo[]>;
export {};
