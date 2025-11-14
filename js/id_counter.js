/**
 * ===================================================================================
 * MEU ZERODEX - CONTADOR DE ID INICIAL (id_counter.js)
 * ===================================================================================
 *
 * @file
 * Define o ID de ponto de partida para o formulário de adição de novos jogos.
 *
 * @description
 * Este arquivo estabelece um valor inicial seguro (fallback) para o contador de IDs.
 * A lógica em `adicionar.js` usa este valor como ponto de partida, comparando-o com
 * o último ID salvo no `localStorage` para garantir que o próximo ID seja sempre
 * único e sequencial.
 *
 * @note
 * Este valor é usado apenas na primeira vez que a página de adição é aberta ou se
 * o `localStorage` for limpo. A edição manual deste arquivo geralmente não é
 * necessária, pois o sistema gerencia a contagem de IDs automaticamente.
 */

/**
 * ID inicial para o primeiro jogo a ser adicionado.
 * Funciona como o ponto de partida para o contador automático de IDs.
 * @type {number}
 */
const nextGameId = 1;