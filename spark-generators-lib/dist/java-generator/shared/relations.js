import { isLocalEntity } from "./ast.js";
function revert_card(card) {
    switch (card) {
        case 'OneToOne':
            return 'OneToOne';
        case 'OneToMany':
            return 'ManyToOne';
        case 'ManyToOne':
            return 'OneToMany';
        case 'ManyToMany':
            return 'ManyToMany';
    }
}
/**
 * Dado um módulo, lê todas as relações internas dele,
 * retornando um mapa que mapeia um Class para a lista
 * de {alvo, cardinalidade e ownership} de suas relações
 */
export function processRelations(localEntities) {
    // Inicializa o mapa com listas vazias
    const map = new Map();
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
                }
                else {
                    add_relation(entity, relationship.type.ref, relationship.$type);
                }
            }
        }
    }
    return map;
}
