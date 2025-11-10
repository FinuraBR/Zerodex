/**
 * ===================================================================================
 * ARQUIVO DE CONFIGURAÇÃO: CONTADOR DE ID (id_counter.js)
 * ===================================================================================
 *
 * @file Define o ID inicial a ser sugerido para novos jogos.
 * @description Este arquivo serve como um "ponto de partida" ou "backup" para o 
 * contador de IDs. A página 'adicionar.html' usa o valor desta variável para 
 * garantir que novos jogos recebam um ID único. O sistema sempre escolherá o maior
 * valor entre este número e o último ID salvo no armazenamento local do navegador
 * (localStorage).
 *
 * --- INSTRUÇÕES DE USO ---
 * Antes de adicionar um novo jogo manualmente, verifique o ID do último jogo 
 * adicionado em 'js/database.js' e atualize o valor de 'nextGameId' para o
 * número seguinte.
 *
 * @example
 * // Se o último jogo na 'database.js' tem o ID: 103,
 * // altere o valor da variável abaixo para: 104.
 * let nextGameId = 104;
 *
 */

// Define o próximo ID a ser sugerido.
// O valor já foi atualizado com base no último jogo da sua database (ID: 0).
let nextGameId = 1;