/**
 * ===================================================================================
 * SERVICE WORKER (service-worker.js)
 * ===================================================================================
 *
 * @file Este arquivo implementa um Service Worker para o aplicativo Zerodex.
 * @description O Service Worker é responsável por gerenciar o cache de recursos,
 * permitindo que o aplicativo funcione offline e carregue mais rapidamente em
 * visitas subsequentes. Ele utiliza uma estratégia "cache-first": primeiro tenta
 * servir os arquivos do cache e, se não encontrar, busca na rede, salvando a
 * nova resposta para uso futuro.
 */

// --- [CONFIGURAÇÃO DO CACHE] ----------------------------------------------------

/**
 * @const {string} CACHE_NAME
 * @description Define um nome único para o cache. Alterar este valor (ex: para 'zerodex-cache-v2')
 * ao atualizar os arquivos do app shell invalida o cache antigo e força a instalação
 * de um novo, garantindo que os usuários recebam a versão mais recente.
 */
const CACHE_NAME = 'zerodex-cache-v1';

/**
 * @const {string[]} URLS_TO_CACHE
 * @description Lista de arquivos essenciais que compõem o "App Shell".
 * Estes são os arquivos mínimos necessários para que a interface do aplicativo
 * seja exibida, mesmo offline.
 */
const URLS_TO_CACHE = [
    './',
    './index.html',
    './jogos.html',
    './sobre.html',
    './adicionar.html',
    './css/style.css',
    './js/database.js',
    './js/script.js',
    './js/adicionar.js',
    './js/id_counter.js',
    './imagens/favicon.jpg' // Adicionado favicon para uma melhor experiência offline.
];

// --- [CICLO DE VIDA DO SERVICE WORKER] ------------------------------------------

/**
 * Evento 'install': Disparado quando o Service Worker é registrado pela primeira vez.
 * A principal tarefa aqui é abrir o cache e armazenar os arquivos do App Shell.
 */
self.addEventListener('install', event => {
    console.log('[Service Worker] Evento de Instalação disparado.');

    // event.waitUntil() garante que o Service Worker não será considerado "instalado"
    // até que o código dentro dele seja concluído com sucesso.
    event.waitUntil(
        caches.open(CACHE_NAME) // Abre o cache com o nome definido.
            .then(cache => {
                console.log('[Service Worker] Cache aberto. Adicionando App Shell ao cache.');
                // Adiciona todos os arquivos da lista URLS_TO_CACHE ao cache.
                // cache.addAll() é atômico: se um único arquivo falhar, a operação inteira falha.
                return cache.addAll(URLS_TO_CACHE);
            })
            .catch(error => {
                // Adicionado para depuração: informa se o cache do App Shell falhou.
                console.error('[Service Worker] Falha ao adicionar App Shell ao cache:', error);
            })
    );
});

/**
 * Evento 'activate': Disparado após a instalação e quando o Service Worker assume o controle da página.
 * É o local ideal para limpar caches antigos que não são mais necessários.
 */
self.addEventListener('activate', event => {
    console.log('[Service Worker] Evento de Ativação disparado.');

    event.waitUntil(
        // caches.keys() retorna uma promessa com todas as chaves (nomes) de cache existentes.
        caches.keys().then(cacheNames => {
            // Promise.all() aguarda que todas as promessas de exclusão de cache sejam resolvidas.
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Se um nome de cache não for o CACHE_NAME atual, ele é considerado antigo e é excluído.
                    if (cacheName !== CACHE_NAME) {
                        console.log(`[Service Worker] Limpando cache antigo: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/**
 * Evento 'fetch': Disparado para CADA requisição de rede feita pela página (ex: páginas, CSS, imagens, JS).
 * Ele intercepta a requisição e decide como respondê-la.
 */
self.addEventListener('fetch', event => {
    // event.respondWith() intercepta a requisição e nos permite fornecer nossa própria resposta.
    event.respondWith(
        // 1. Tenta encontrar uma resposta correspondente à requisição no nosso cache.
        caches.match(event.request)
            .then(cachedResponse => {
                // 2. Se uma resposta for encontrada no cache, retorna-a imediatamente.
                // Isso evita uma chamada à rede, tornando o carregamento mais rápido.
                if (cachedResponse) {
                    return cachedResponse;
                }

                // 3. Se não houver resposta no cache, prossegue com a requisição de rede original.
                return fetch(event.request).then(
                    networkResponse => {
                        // Verifica se a resposta da rede é válida antes de armazená-la.
                        // Ignoramos respostas de erro ou de extensões do Chrome (tipo 'opaque').
                        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
                            return networkResponse; // Retorna a resposta inválida sem armazená-la.
                        }

                        // IMPORTANTE: Uma resposta só pode ser "consumida" uma vez.
                        // Como precisamos enviar a resposta para o navegador e também para o cache,
                        // é necessário cloná-la.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Armazena a nova resposta da rede no cache para futuras requisições.
                                // A chave é o objeto da requisição, e o valor é a resposta clonada.
                                cache.put(event.request, responseToCache);
                            });

                        // Retorna a resposta original da rede para o navegador.
                        return networkResponse;
                    }
                ).catch(error => {
                    // Opcional: Em caso de falha de rede, você poderia retornar uma página de fallback offline aqui.
                    console.warn(`[Service Worker] Falha na requisição de fetch para ${event.request.url}:`, error);
                    // Exemplo: return caches.match('/offline.html');
                });
            })
    );
});