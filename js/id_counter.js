/**
 * ===================================================================================
 * ARQUIVO DE CONFIGURAÇÃO: ID INICIAL (id_counter.js)
 * ===================================================================================
 *
 * @file Define o ID de ponto de partida a ser utilizado para novos jogos.
 *
 * @description Este arquivo serve como um "fallback" ou valor inicial seguro para o
 * contador de IDs. A página 'adicionar.html' utiliza a lógica em 'adicionar.js'
 * para calcular o próximo ID disponível, sempre escolhendo o maior valor entre
 * o último ID salvo no armazenamento local (localStorage) e o valor definido
 * neste arquivo.
 *
 * @note Não é necessário editar este valor manualmente. O sistema foi projetado
 * para gerenciar a contagem de IDs de forma automática, garantindo a unicidade.
 * Este valor só é efetivamente usado na primeira vez que a aplicação é iniciada
 * ou se o cache do navegador for limpo.
 */

/**
 * @const {number} nextGameId
 * @description Define o próximo ID a ser sugerido como 1. Este é um valor constante
 * que serve como base inicial para o sistema de contagem de jogos.
 */
const nextGameId = 1;