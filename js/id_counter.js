// ===================================================================================
// === CONTADOR DE ID DE JOGO (id_counter.js) ========================================
// ===================================================================================

/**
 * OBJETIVO DESTE ARQUIVO:
 * 
 * Este arquivo tem uma única e importante função: definir qual será o PRÓXIMO ID
 * a ser usado quando você adicionar um novo jogo através da página 'adicionar.html'.
 * 
 * Ele serve como um "ponto de partida" ou "backup" para o contador de IDs, que
 * também é salvo no seu navegador (localStorage). O sistema sempre pegará o maior
 * valor entre este arquivo e o que está salvo no navegador, garantindo que você
 * nunca use um ID repetido.
 */

// --- INSTRUÇÃO DE USO ---
// Altere o número abaixo para o ID do PRÓXIMO jogo que você irá adicionar.
//
// Exemplo:
// Se o último jogo que você adicionou na sua 'database.js' tem o ID: 0,
// você deve alterar o valor abaixo para: 1.

let nextGameId = 1; // <-- Altere este número!