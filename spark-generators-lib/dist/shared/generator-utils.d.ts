import { AstNode } from "langium";
import { Entity } from "./ast.js";
/**
 * Capitaliza uma string
 *
 * @param str - String a ser capitalizada
 * @returns A string capitalizada
 */
export declare function capitalizeString(str: string): string;
/**
 * Aplica `path.join` nos argumentos passados, e cria o caminho gerado caso não exista
 *
 * @param args - Caminho para ser construído
 * @returns O caminho construído e normalizado, o mesmo retorno que `path.join(args)`
 */
export declare const ident_size = 4;
export declare const base_ident: string;
export declare function createPath(...args: string[]): string;
/**
 * Ordena topologicamente um DAG.
 *
 * Referência: https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search
 * @param nodes - Conjuntos de nós que denotam um grafo
 * @param fn - Função que recebe um nó `N` e retorna um iterável dos nós que PRECEDEM `N`.
 * Se a função for dos nós que devem suceder `N`, passe `reverse=true`
 * @param reverse - Booleano que define se a ordenação deve ser feita ao contrário.
 * Passe `reverse=true` se sua função `fn` retorna os sucessores do nó, ao invés dos antecessores
 *
 * @returns Um array, contendo os nós de `nodes` ordenados topologicamente
 *
 * @throws {Error} Se houver um ciclo em `nodes`, tornando a ordenação impossível
 */
export declare function topologicalSort<T extends AstNode>(nodes: Iterable<T>, fn: (a: T) => Iterable<T>, reverse?: boolean): T[];
/**
* Checa se o nó de um grafo é parte de um ciclo.
* Apenas para grafos com grau de saída 1 ou menor em cada nó
*
* Usando o algoritmo da Lebre e da Tartaruga (Floyd)
*
* @param start_node Nó inicial
* @param sucessor_function Função que recebe um nó e retorna o nó sucessor, ou undefined caso não haja sucessor.
* Sempre que um nó não houver sucessor, não existe ciclo envolvendo esse nó
* @returns Um booleano, dizendo se foi encontrado ciclo
*/
export declare function cycleFinder<T extends AstNode>(start_node: T, sucessor_function: (node: T) => T | undefined): boolean;
/**
* Dado um Entity que tenha nome, retorna o qualified name completo
*/
export declare function getQualifiedName(e: Entity): string;
