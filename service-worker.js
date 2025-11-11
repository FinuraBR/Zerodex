// service-worker.js

// Define um nome e uma versão para o nosso cache
const CACHE_NAME = 'zerodex-cache-v1';

// Lista de arquivos principais do app que queremos deixar em cache (o "app shell")
const urlsToCache = [
    './',
    './index.html',
    './jogos.html',
    './sobre.html',
    './adicionar.html',
    './css/style.css',
    './js/database.js',
    './js/script.js',
    './js/add_game.js',
    './js/id_counter.js'
    // Adicione aqui outros arquivos importantes.
];

// Evento 'install': é disparado quando o Service Worker é instalado pela primeira vez.
self.addEventListener('install', event => {
    // A mágica acontece aqui:
    event.waitUntil(
        caches.open(CACHE_NAME) // Abre o nosso cache
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache); // Adiciona todos os nossos arquivos ao cache
            })
    );
});

// Evento 'fetch': é disparado TODA VEZ que o site tenta buscar algo (uma página, um CSS, uma imagem, etc.)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request) // Procura no cache por uma resposta para esta requisição
            .then(response => {
                // Se encontrarmos uma resposta no cache...
                if (response) {
                    return response; // ...retornamos a resposta do cache imediatamente.
                }

                // Se não encontrarmos, continuamos com a requisição normal à internet.
                return fetch(event.request).then(
                    response => {
                        // Se a requisição for para um recurso que não queremos guardar (ex: API do Chrome), não fazemos nada.
                        if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
                            return response;
                        }

                        // IMPORTANTE: Clonamos a resposta.
                        // A resposta só pode ser "consumida" uma vez. Precisamos de uma cópia para o cache e outra para o navegador.
                        const responseToCache = response.clone();

                        caches.open(CACHE_-NAME)
                            .then(cache => {
                                // Guardamos a nova resposta da internet no cache para a próxima vez.
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});