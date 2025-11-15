/**
 * ===================================================================================
 * SERVICE WORKER (service-worker.js)
 * ===================================================================================
 *
 * @file Este arquivo implementa um Service Worker para o aplicativo Zerodex.
 * @description O Service Worker é responsável por gerenciar o cache de recursos,
 * permitindo que o aplicativo funcione offline e carregue mais rapidamente em
 * visitas subsequentes. Ele utiliza uma estratégia "Cache-First": primeiro tenta
 * servir os arquivos do cache e, se não encontrar, busca na rede, salvando a
 * nova resposta para uso futuro.
 */

// --- 1. CONFIGURAÇÃO DO CACHE ----------------------------------------------------

/**
 * @const {string} CACHE_NAME
 * @description Define um nome único para o cache. Alterar este valor (ex: para 'zerodex-cache-v2')
 * ao atualizar os arquivos essenciais (app shell) invalida o cache antigo e força
 * a instalação de um novo, garantindo que os usuários recebam a versão mais recente.
 */
const CACHE_NAME = 'zerodex-cache-v1.1';

/**
 * @const {string[]} URLS_TO_CACHE
 * @description Lista de arquivos essenciais que compõem o "App Shell".
 * Estes são os arquivos mínimos necessários para que a interface do aplicativo
 * seja exibida, mesmo quando o dispositivo estiver offline.
 */
const URLS_TO_CACHE = [
    './', // Representa a raiz, geralmente o index.html
    './index.html',
    './jogos.html',
    './sobre.html',
    './adicionar.html',
    './css/style.css',
    './js/database.js',
    './js/script.js',
    './js/adicionar.js',
    './js/id_counter.js',
    './imagens'
];

// --- 2. CICLO DE VIDA DO SERVICE WORKER ------------------------------------------

/**
 * Evento 'install': Disparado quando o Service Worker é registrado pela primeira vez
 * ou quando uma nova versão do script é detectada pelo navegador.
 * A principal tarefa aqui é abrir o cache e armazenar os arquivos do App Shell.
 */
self.addEventListener('install', event => {
    console.log('[Service Worker] Evento de Instalação: Iniciando...');

    // event.waitUntil() adia a conclusão do evento 'install' até que a promessa
    // passada para ele seja resolvida. Isso garante que o Service Worker não
    // prossiga para o estado 'activating' antes de o cache estar pronto.
    event.waitUntil(
        caches.open(CACHE_NAME) // Abre o cache com o nome definido.
            .then(cache => {
                console.log('[Service Worker] Cache aberto. Armazenando o App Shell...');
                // Adiciona todos os arquivos da lista URLS_TO_CACHE ao cache.
                // cache.addAll() é uma operação atômica: se um único arquivo falhar ao ser
                // baixado ou cacheado, a operação inteira falha e a promessa é rejeitada.
                return cache.addAll(URLS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] App Shell armazenado com sucesso no cache.');
            })
            .catch(error => {
                console.error('[Service Worker] Falha ao armazenar o App Shell no cache:', error);
            })
    );
});

/**
 * Evento 'activate': Disparado após a instalação e quando o Service Worker assume
 * o controle da página. É o momento ideal para limpar caches antigos que não são
 * mais necessários, evitando que o dispositivo acumule dados obsoletos.
 */
self.addEventListener('activate', event => {
    console.log('[Service Worker] Evento de Ativação: Ativo e pronto para controlar a página.');

    event.waitUntil(
        // caches.keys() retorna uma promessa com um array de todas as chaves (nomes) de cache existentes.
        caches.keys().then(cacheNames => {
            // Promise.all() aguarda que todas as promessas de exclusão de cache sejam resolvidas.
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Se um nome de cache não corresponde ao CACHE_NAME atual, ele é considerado
                    // antigo e deve ser excluído para liberar espaço e evitar conflitos.
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
 * Evento 'fetch': Disparado para CADA requisição de rede feita pela página
 * (ex: HTML, CSS, JS, imagens, requisições de API). Ele intercepta a requisição e
 * permite que o Service Worker decida como respondê-la, seja do cache ou da rede.
 */
self.addEventListener('fetch', event => {
    // A estratégia é "Cache-First, com atualização de cache em segundo plano".
    event.respondWith(
        // 1. Tenta encontrar uma resposta correspondente à requisição no nosso cache.
        caches.match(event.request)
            .then(cachedResponse => {
                // 2. Se uma resposta for encontrada no cache (um "cache hit"), retorna-a imediatamente.
                // Isso evita uma chamada à rede, tornando o carregamento instantâneo para
                // recursos já cacheados e permitindo o funcionamento offline.
                if (cachedResponse) {
                    return cachedResponse;
                }

                // 3. Se não houver resposta no cache (um "cache miss"), prossegue com a requisição de rede original.
                return fetch(event.request).then(
                    networkResponse => {
                        // Antes de armazenar, é crucial validar a resposta da rede.
                        // Ignoramos respostas com erro (status não 200) ou respostas opacas de
                        // CDNs de terceiros que não suportam CORS (ex: extensões do Chrome).
                        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
                            return networkResponse; // Retorna a resposta inválida sem armazená-la no cache.
                        }

                        // IMPORTANTE: Uma resposta (Response) é um stream que só pode ser "consumido" uma vez.
                        // Como precisamos enviar a resposta para o navegador (para renderizar a página) e
                        // também para o cache (para armazenamento), é necessário cloná-la.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Armazena a nova resposta da rede no cache para futuras requisições.
                                // A chave é o objeto da requisição, e o valor é a resposta clonada.
                                cache.put(event.request, responseToCache);
                            });

                        // Retorna a resposta original da rede para o navegador, que a renderizará.
                        return networkResponse;
                    }
                ).catch(error => {
                    // Este bloco é executado se a busca na rede falhar (ex: sem conexão com a internet).
                    console.warn(`[Service Worker] Falha na requisição de fetch para ${event.request.url}. O dispositivo pode estar offline.`, error);
                    // Aqui seria o local ideal para retornar uma página de fallback offline, se houvesse uma.
                    // Exemplo: return caches.match('/offline.html');
                    // Como não temos uma, a falha de rede será propagada para o navegador.
                });
            })
    );
});