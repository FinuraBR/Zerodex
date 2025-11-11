// ===================================================================================
// === MEU ZERODEX - SCRIPT PRINCIPAL ================================================
// ===================================================================================
// Este arquivo controla toda a interatividade do site, desde a exibição dos jogos
// até a troca de tema e os botões de navegação.

// --- [INICIALIZAÇÃO GERAL] ---------------------------------------------------------

/**
 * O evento 'DOMContentLoaded' aguarda o HTML da página ser completamente carregado
 * antes de executar qualquer script. Isso garante que todos os elementos (botões,
 * divs, etc.) que o JavaScript tentará acessar já existem na página, evitando erros.
 * É o ponto de partida de toda a lógica do site.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Funções Globais (rodam em todas as páginas) ---
    setupThemeToggle();      // Configura o botão de troca de tema (claro/escuro).
    setupBackToTopButton();  // Configura o botão "Voltar ao Topo".

    // --- Lógica Específica para Cada Página ---
    // O código verifica qual página está ativa procurando por um elemento com um ID específico.

    // Se encontrar o elemento '#catalogo', significa que estamos na página de jogos (jogos.html).
    if (document.querySelector('#catalogo')) {
        initializeCatalog();             // Exibe os jogos na tela, aplicando os filtros lidos.
    }
    
    // Se encontrar '#dynamic-stats', estamos na página "Sobre" (sobre.html).
    if (document.querySelector('#dynamic-stats')) {
        renderStatistics();          // Calcula e exibe as estatísticas e o gráfico.
    }

    // Se encontrar '.homepage-shelf', estamos na página inicial (index.html).
    if (document.querySelector('.homepage-shelf')) {
        setupHomepageShelves();      // Preenche as "estantes" de jogos (Jogando, Finalizados, etc.).
        setupStickyShelfNav();       // Ativa o menu de navegação que fica fixo ao rolar a página.
        setupSmoothShelfScrolling();
    }

    // Se QUALQUER página tiver uma grade de jogos (uma '.game-grid'), ativa a lógica do tooltip.
    // Isso torna a função do tooltip universal para a página inicial e o catálogo.
    if (document.querySelector('.game-grid')) {
        setupTooltipLogic();
    }
    
    // --- REGISTRO DO SERVICE WORKER ---
    // Verifica se o navegador suporta Service Workers
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js') // Registra o nosso arquivo
                .then(registration => {
                    console.log('Service Worker registrado com sucesso:', registration);
                })
                .catch(error => {
                    console.log('Falha ao registrar o Service Worker:', error);
                });
        });
    }
});


// --- [VARIÁVEIS DE ESTADO DO CATÁLOGO] ---------------------------------------------
// Estas variáveis guardam o estado atual dos filtros na página do catálogo.
// Elas funcionam como a "memória" da página sobre o que o usuário selecionou.
let currentSearchTerm = '';      // O texto digitado na barra de busca.
let currentPlatform = 'all';     // A plataforma selecionada (ex: 'pc', 'switch', 'all').
let currentSort = 'id-desc';     // A ordenação escolhida (ex: 'id-desc', 'title-asc').


// ===================================================================================
// --- SEÇÃO: LÓGICA DA PÁGINA INICIAL (INDEX.HTML) ----------------------------------
// ===================================================================================

// Mapa para traduzir os 'slugs' das plataformas para nomes legíveis.
// Declarado aqui fora para ser acessível por múltiplas funções.
const PLATFORM_DISPLAY_NAMES = {
    'pc': 'PC',
    'nintendo-switch': 'Switch',
    'android': 'Celular',
    // Adicione outras plataformas aqui conforme necessário
};

/**
 * Preenche as diferentes seções ("estantes") da página inicial.
 * Cada estante corresponde a um status de jogo (Jogando, Arquivados, etc.).
 * Se uma estante não tiver jogos, a seção inteira e seu link no menu são escondidos.
 */
function setupHomepageShelves() {
    // Array que mapeia o seletor da seção no HTML ao status correspondente no 'gamesData'.
    const homepageShelves = [
        { selector: '#currently-playing', status: 'playing' },
        { selector: '#archived-games', status: 'archived' },
        { selector: '#completed-100-games', status: 'completed-100' },
        { selector: '#finished-games', status: 'completed' },
        { selector: '#retired-games', status: 'retired' },
        { selector: '#abandoned-games', status: 'abandoned' },
    ];

    // Itera sobre cada estante definida acima.
    homepageShelves.forEach(shelf => {
        const sectionElement = document.querySelector(shelf.selector);
        const navLink = document.querySelector(`#shelf-nav a[href="${shelf.selector}"]`);

        // Se o elemento da seção ou o link de navegação não existir, pula para o próximo.
        if (!sectionElement || !navLink) return;

        // Filtra a lista principal de jogos ('gamesData') para pegar apenas os que correspondem ao status da estante.
        const gamesForShelf = gamesData.filter(game => game.status === shelf.status);

        if (gamesForShelf.length > 0) {
            // Se encontrou jogos para esta estante:
            navLink.style.display = ''; // Garante que o link no menu de navegação apareça.
            const gridSelector = `${shelf.selector} .game-grid`; // Define onde os jogos serão renderizados.
            renderGames(gamesForShelf, gridSelector); // Chama a função para criar o HTML dos jogos.
        } else {
            // Se não há jogos com este status, esconde a seção inteira e o link do menu.
            sectionElement.style.display = 'none';
            navLink.style.display = 'none';
        }
    });
}

/**
 * Controla o menu de navegação fixo ('shelf-nav') da página inicial.
 * Ele aparece quando o usuário rola a página para além da primeira seção ('hero').
 */
function setupStickyShelfNav() {
    const shelfNav = document.getElementById('shelf-nav');
    const heroSection = document.getElementById('hero');

    // Se os elementos não existirem, a função não faz nada.
    if (!shelfNav || !heroSection) return;

    // Função que verifica a posição da rolagem da página.
    const checkScroll = () => {
        // Calcula a posição onde a seção 'hero' termina.
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        // Se a posição de rolagem vertical (window.scrollY) ultrapassou o final da seção hero...
        if (window.scrollY > heroBottom) {
            shelfNav.classList.add('shelf-nav-visible'); // Adiciona a classe que torna o menu visível.
            shelfNav.classList.remove('shelf-nav-hidden');
        } else {
            shelfNav.classList.remove('shelf-nav-visible'); // Remove a classe, escondendo o menu.
            shelfNav.classList.add('shelf-nav-hidden');
        }
    };
    
    // Adiciona um "ouvinte" que executa 'checkScroll' toda vez que o usuário rolar a página.
    window.addEventListener('scroll', checkScroll);
    // Executa a função uma vez no carregamento para definir o estado inicial correto.
    checkScroll();
}

/**
 * Adiciona uma animação de rolagem suave para os links da navegação de seções.
 * Captura o clique, previne o salto padrão e rola a página de forma animada.
 */
function setupSmoothShelfScrolling() {
    // Seleciona todos os links <a> que estão dentro da navegação #shelf-nav
    const shelfLinks = document.querySelectorAll('#shelf-nav a');

    // Itera sobre cada link encontrado
    shelfLinks.forEach(link => {
        // Adiciona um "ouvinte" de evento de clique para cada link
        link.addEventListener('click', function(event) {
            // 1. Previne o comportamento padrão do navegador (o salto instantâneo)
            event.preventDefault();

            // 2. Pega o valor do atributo 'href' do link clicado (ex: "#finished-games")
            const targetId = this.getAttribute('href');

            // 3. Encontra o elemento na página que possui esse ID
            const targetSection = document.querySelector(targetId);

            // 4. Se o elemento for encontrado...
            if (targetSection) {
                // ...rola a página suavemente até ele.
                // 'behavior: smooth' é o que cria a animação.
                // 'block: start' garante que o topo da seção alinhe com o topo da tela.
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


// ===================================================================================
// --- SEÇÃO: LÓGICA DO CATÁLOGO (JOGOS.HTML) ----------------------------------------
// ===================================================================================

/**
 * Função que é chamada APENAS quando a ORDENAÇÃO muda.
 * Ela filtra, ordena e RE-RENDERIZA os cards na nova ordem.
 */
function sortAndReRender() {
    let filteredGames = [...gamesData]; 

    // A filtragem aqui garante que a ordenação seja aplicada apenas nos itens visíveis.
    if (currentPlatform !== 'all') {
        filteredGames = filteredGames.filter(g => g.platform === currentPlatform);
    }
    if (currentSearchTerm) {
        filteredGames = filteredGames.filter(g => g.title.toLowerCase().includes(currentSearchTerm));
    }
    
    // Ordena a lista já filtrada.
    switch (currentSort) {
        case 'title-asc':
            filteredGames.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            filteredGames.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'id-desc':
        default:
            filteredGames.sort((a, b) => b.id - a.id);
            break;
    }
    
    // Re-renderiza os jogos na nova ordem.
    renderGames(filteredGames, '#catalogo .game-grid');
    updateURL();
}

/**
 * Lê os parâmetros da URL (ex: ?platform=pc&sort=title-asc) quando a página carrega.
 * Isso permite que um link compartilhado já aplique os filtros automaticamente.
 */
function readURLAndSetupControls() {
    const params = new URLSearchParams(window.location.search);
    // Pega o valor de cada parâmetro da URL. Se não existir, usa o valor padrão.
    currentPlatform = params.get('platform') || 'all';
    currentSearchTerm = params.get('search') || '';
    currentSort = params.get('sort') || 'id-desc';
    // Atualiza os elementos visuais (barra de busca, menu de ordenação, botões) para corresponderem aos valores da URL.
    document.getElementById('search-bar').value = currentSearchTerm;
    document.getElementById('sort-options').value = currentSort;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        // Adiciona a classe 'active' ao botão de filtro que corresponde à plataforma na URL.
        btn.classList.toggle('active', btn.dataset.platform === currentPlatform);
    });
    
    // Após ler os valores iniciais, configura os "ouvintes de eventos" para os controles.
    setupControls();
}

/**
 * Atualiza a URL na barra de endereço do navegador sem recarregar a página.
 * Usa a History API do navegador para uma experiência de usuário mais fluida.
 */
function updateURL() {
    const params = new URLSearchParams();
    // Adiciona os parâmetros à URL apenas se eles não forem os valores padrão.
    if (currentPlatform !== 'all') params.set('platform', currentPlatform);
    if (currentSearchTerm) params.set('search', currentSearchTerm);
    if (currentSort !== 'id-desc') params.set('sort', currentSort);

    // Constrói a nova URL com os parâmetros.
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    // Altera a URL na barra de endereço. O 'null' e '' são parâmetros de estado que não usamos aqui.
    history.pushState(null, '', newUrl);
}

/**
 * Configura os "ouvintes de eventos" para os controles de filtro, busca e ordenação.
 * OTIMIZADO para usar a função 'applyFilters' para uma resposta instantânea.
 */
function setupControls() {
    // Barra de pesquisa: agora chama applyFilters para uma resposta instantânea.
    document.getElementById('search-bar').addEventListener('keyup', e => {
        currentSearchTerm = e.target.value.toLowerCase();
        applyFilters(); // Super rápido!
        updateURL();
    });
    
    // Menu de ordenação: esta é a ÚNICA ação que ainda precisa re-renderizar tudo.
    document.getElementById('sort-options').addEventListener('change', e => {
        currentSort = e.target.value;
        sortAndReRender(); // CORRETO: a ordenação exige reconstrução.
    });

    // Botões de filtro de plataforma: agora chamam applyFilters para uma resposta instantânea.
    document.querySelectorAll('#filter-container .filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentPlatform = button.dataset.platform;
            
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            applyFilters(); // Super rápido!
            updateURL();
        });
    });

    // Botão "Me Surpreenda!": continua funcionando perfeitamente.
    document.getElementById('surprise-btn').addEventListener('click', () => {
        const visibleCards = document.querySelectorAll('#catalogo .game-card:not(.hidden)');
        if (visibleCards.length === 0) return;

        const currentHighlight = document.querySelector('.highlight');
        if (currentHighlight) {
            currentHighlight.classList.remove('highlight');
        }

        const randomIndex = Math.floor(Math.random() * visibleCards.length);
        const randomCard = visibleCards[randomIndex];

        randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        randomCard.classList.add('highlight');
        setTimeout(() => {
            randomCard.classList.remove('highlight');
        }, 5000);
    });

     // Botão "Editar Jogo": continua funcionando perfeitamente.
    document.querySelector('#catalogo .game-grid').addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const gameId = parseInt(event.target.dataset.editId);
            const gameToEdit = gamesData.find(game => game.id === gameId);

            if (gameToEdit) {
                localStorage.setItem('gameToEdit', JSON.stringify(gameToEdit));
                window.location.href = 'adicionar.html';
            }
        }
    });
}


// ===================================================================================
// --- SEÇÃO: LÓGICA DO TOOLTIP DE COMENTÁRIOS --------------------------------------
// ===================================================================================

/**
 * Configura a lógica para exibir um tooltip com o comentário do jogo ao clicar no botão "Ver Comentário".
 * Esta função é universal e funciona em qualquer grade de jogos do site.
 */
function setupTooltipLogic() {
    const allGameGrids = document.querySelectorAll('.game-grid');
    if (allGameGrids.length === 0) return; // Se não houver grades na página, encerra.

    // Função auxiliar para remover qualquer tooltip que esteja aberto no momento.
    const removeExistingTooltip = () => {
        const existingTooltip = document.querySelector('.review-card');
        if (existingTooltip) {
            existingTooltip.classList.remove('active'); // Inicia a animação de saída.
            setTimeout(() => existingTooltip.remove(), 300); // Remove o elemento do HTML após a animação.
        }
    };

    // Aplica a lógica de clique a todas as grades de jogos da página.
    allGameGrids.forEach(grid => {
        // Usa delegação de eventos: o 'listener' está na grade, não em cada botão.
        grid.addEventListener('click', (event) => {
            // '.closest()' encontra o elemento '.review-trigger' mais próximo do local do clique.
            const trigger = event.target.closest('.review-trigger');
            if (!trigger) return; // Se o clique não foi no botão ou dentro dele, não faz nada.

            // Descobre em qual card de jogo o botão clicado está.
            const card = trigger.closest('.game-card');
            const gameId = parseInt(card.querySelector('.game-number').textContent);

            // Verifica se um tooltip para este mesmo jogo já está aberto.
            const tooltipAlreadyExists = document.querySelector(`.review-card[data-tooltip-for-id="${gameId}"]`);

            if (tooltipAlreadyExists) {
                // Se o tooltip para este jogo já existe, simplesmente o fecha.
                removeExistingTooltip();
            } else {
                // Se é para um novo jogo, primeiro fecha qualquer outro tooltip que esteja aberto.
                removeExistingTooltip();
                
                // Encontra os dados completos do jogo na base de dados 'gamesData'.
                const gameData = gamesData.find(g => g.id === gameId);

                // Se o jogo tem um comentário ('review'), cria e exibe o tooltip.
                if (gameData && gameData.review) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'review-card';
                    tooltip.setAttribute('data-tooltip-for-id', gameId);
                    tooltip.innerHTML = `
                        <h3>Comentário</h3>
                        <p>${gameData.review}</p>
                    `;
                    // Insere o tooltip no HTML, logo após o card do jogo.
                    card.insertAdjacentElement('afterend', tooltip);
                    // Adiciona a classe 'active' para iniciar a animação de entrada.
                    setTimeout(() => tooltip.classList.add('active'), 10);
                }
            }
        });
    });

    // Adiciona um 'listener' no documento inteiro para fechar o tooltip
    // se o usuário clicar em qualquer lugar fora da grade de jogos.
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.game-grid')) {
            removeExistingTooltip();
        }
    });
}


// ===================================================================================
// --- SEÇÃO: FUNÇÕES DE RENDERIZAÇÃO (CRIAM HTML) -----------------------------------
// ===================================================================================

/**
 * Gera e insere o HTML dos cards de jogos na grade especificada.
 * VERSÃO FINAL AVANÇADA: Usa renderização assíncrona em lotes e
 * garante que o lazy loading seja ativado APÓS a conclusão de todos os lotes.
 * @param {Array} gamesArray - A lista de jogos a ser exibida.
 * @param {string} gridSelector - O seletor CSS da grade onde os jogos serão inseridos.
 */
function renderGames(gamesArray, gridSelector) {
    const gameGrid = document.querySelector(gridSelector);
    if (!gameGrid) return;

    gameGrid.innerHTML = gamesArray.length === 0 ? '<p class="no-results-message">Nenhum jogo encontrado.</p>' : '';
    if (gamesArray.length === 0) return;

    let currentIndex = 0;
    const batchSize = 10; 

    function processBatch() {
        const fragment = document.createDocumentFragment();
        const endIndex = Math.min(currentIndex + batchSize, gamesArray.length);

        for (let i = currentIndex; i < endIndex; i++) {
            const game = gamesArray[i];
            const platformText = PLATFORM_DISPLAY_NAMES[game.platform] || game.platform.toUpperCase();
            const platformHTML = game.storeUrl ? `<a href="${game.storeUrl}" target="_blank">${platformText}</a>` : platformText;
            const guideLinks = game.guide.map(g => `<a href="${g.url}" target="_blank">${g.title}</a>`).join(' | ');
            const guideHTML = game.guide.length > 0 ? `<p><strong>Guia:</strong> ${guideLinks}</p>` : '<p><strong>Guia:</strong> Não utilizado</p>';
            
            const cardElement = document.createElement('div');
            cardElement.className = 'game-card';
            cardElement.dataset.platform = game.platform;

            cardElement.innerHTML = `
                <div class="card-image-container">
                    <div class="game-number">${game.id}</div>
                    ${game.version ? `<div class="game-version-badge">${game.version}</div>` : ''}
                    <img data-src="${game.image}" alt="Capa do jogo ${game.title}" class="lazy-image" src="imagens/favicon.jpg">
                </div>
                <div class="game-info-default">
                    <p class="game-title">${game.title}</p>
                    <span class="status-badge status-${game.status}">${game.statusText}</span>
                </div>
                <div class="game-overlay">
                    <div class="game-details">
                        <h3>${game.title}</h3>
                        <p><strong>Plataforma:</strong> ${platformHTML}</p>
                        <p><strong>Status:</strong> ${game.statusOverlay}</p>
                        <p><strong>Tradução:</strong> ${game.translation}</p>
                        ${guideHTML}
                        <button class="edit-btn secondary-btn" data-edit-id="${game.id}">Editar Jogo</button>
                    </div>
                    ${game.review ? `<div class="game-review"><button class="review-trigger secondary-btn">Ver Comentário</button></div>` : ''}
                </div>`;

            fragment.appendChild(cardElement);
        }

        gameGrid.appendChild(fragment);
        
        currentIndex = endIndex;

        if (currentIndex < gamesArray.length) {
            requestAnimationFrame(processBatch);
        } else {
            // Todos os cards estão no DOM. Agora é a hora de finalizar.
            
            // 1. Aplica a animação de entrada em todos os cards de uma vez.
            gameGrid.querySelectorAll('.game-card').forEach(card => {
            card.classList.add('card-enter-animation');
            });
            
            // 2. Ativa o lazy loading para as imagens.
            setupLazyLoading();

            // 3. APLICA O FILTRO INICIAL que foi lido da URL.
            applyFilters(); 
        }
    }
    requestAnimationFrame(processBatch);
}

/**
 * Orquestra a inicialização da página do catálogo. Prepara os botões,
 * lê o estado da URL e inicia o processo de renderização.
 */
function initializeCatalog() {
    renderFilterButtons();
    readURLAndSetupControls(); // Define o estado (currentPlatform, etc.) e os listeners
    
    // Inicia a renderização de TODOS os jogos. A própria renderGames
    // irá aplicar o filtro inicial no final do processo.
    renderGames(gamesData, '#catalogo .game-grid');
}

/**
 * Configura o Intersection Observer para carregar imagens sob demanda (lazy loading).
 * Esta função encontra todas as imagens com a classe 'lazy-image' e as observa.
 * Quando uma imagem está prestes a entrar na tela, ela troca o 'data-src' pelo 'src'.
 */
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    if (lazyImages.length === 0) return;

    // Opções: Carrega a imagem quando ela estiver a 250px de distância da tela.
    const observerOptions = {
        rootMargin: '0px 0px 250px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src; // A mágica acontece aqui!
                image.classList.remove('lazy-image'); // Remove a classe para não observar de novo.
                observer.unobserve(image); // Para de observar esta imagem.
            }
        });
    }, observerOptions);

    lazyImages.forEach(image => {
        imageObserver.observe(image);
    });
}

/**
 * Cria dinamicamente os botões de filtro de plataforma no catálogo.
 * Isso evita ter que adicionar novos botões manualmente no HTML quando uma nova plataforma é adicionada.
 */
function renderFilterButtons() {
    const filterContainer = document.querySelector('#filter-container');
    if (!filterContainer) return;

    // `new Set()` cria uma coleção de itens únicos, removendo plataformas duplicadas.
    // O spread operator `...` transforma o Set de volta em um array.
    const platforms = ['all', ...new Set(gamesData.map(g => g.platform))];
    
    // Gera o HTML de cada botão a partir do array de plataformas.
    const buttonsHTML = platforms.map(slug => {
        // Se o slug for 'all', o texto é 'Todos'.
        // Para os outros, pega o nome do mapa ou usa o slug em maiúsculas como fallback.
        const displayName = slug === 'all' ? 'Todos' : (PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase());
        return `<button class="filter-btn" data-platform="${slug}">${displayName}</button>`;
    }).join('');
    
    // Adiciona os botões de filtro e também os botões de ação ("Surpreenda", "Adicionar").
    filterContainer.innerHTML = buttonsHTML + `
        <button id="surprise-btn">Me Surpreenda!</button>
        <a href="adicionar.html" id="add-game-btn" class="cta-button">Adicionar Jogo</a>
    `;
}

/**
 * Aplica filtros de forma eficiente, escondendo ou mostrando os cards existentes
 * sem a necessidade de recriar tudo. Isso torna a filtragem instantânea.
 */
function applyFilters() {
    const allCards = document.querySelectorAll('#catalogo .game-grid .game-card');
    const gameGrid = document.querySelector('#catalogo .game-grid'); // Pega o contêiner da grade
    let visibleGameCount = 0;

    // Adiciona a classe para iniciar o efeito de esmaecer
    if (gameGrid) gameGrid.classList.add('reloading');

    allCards.forEach(card => {
        // Verifica se o card atual corresponde aos filtros selecionados.
        const platformMatch = currentPlatform === 'all' || card.dataset.platform === currentPlatform;
        
        // Pega o título do card para a busca. '.textContent.toLowerCase()' é rápido.
        const title = card.querySelector('.game-title').textContent.toLowerCase();
        const searchMatch = currentSearchTerm === '' || title.includes(currentSearchTerm);

        // Se o card corresponde a AMBOS os filtros, ele deve ser visível.
        if (platformMatch && searchMatch) {
            card.classList.remove('hidden');
            visibleGameCount++;
        } else {
            // Caso contrário, ele deve ser escondido.
            card.classList.add('hidden');
        }
    });

    // Remove a classe após um pequeno atraso para o efeito ser visível
    setTimeout(() => {
        if (gameGrid) gameGrid.classList.remove('reloading');
    }, 200); // 200ms é um bom tempo para o efeito ser notado

    // Mostra ou esconde a mensagem de "Nenhum jogo encontrado".
    const noResultsMessage = document.querySelector('#catalogo .no-results-message');
    if (noResultsMessage) {
        noResultsMessage.style.display = visibleGameCount === 0 ? 'block' : 'none';
    }
}

/**
 * Calcula e exibe as estatísticas e o gráfico na página "Sobre".
 */
// em script.js

/**
 * Calcula e exibe as estatísticas e os gráficos na página "Sobre".
 */
function renderStatistics() {
    // Pega os contêineres e os elementos <canvas> do HTML.
    const platformChartCanvas = document.getElementById('platform-chart');
    const statusChartCanvas = document.getElementById('status-chart');

    // Se algum dos canvas não for encontrado, interrompe a função.
    if (!platformChartCanvas || !statusChartCanvas || gamesData.length === 0) return;

    // Calcula a contagem de jogos por plataforma (USANDO O SLUG ORIGINAL como chave).
    const platformCounts = gamesData.reduce((acc, game) => {
        acc[game.platform] = (acc[game.platform] || 0) + 1; // Mantemos 'pc', 'nintendo-switch', etc.
        return acc;
    }, {});
    
    // Calcula a contagem de jogos por status.
    const statusCounts = gamesData.reduce((acc, game) => {
        acc[game.statusText] = (acc[game.statusText] || 0) + 1;
        return acc;
    }, {});

    // --- PREENCHE AS CAIXAS DE ESTATÍSTICAS DE TEXTO ---
    // Gera o HTML para a lista de plataformas usando nosso mapa de nomes.
    const platformsHTML = Object.entries(platformCounts).map(([slug, count]) => {
        // Para cada 'slug' (ex: 'nintendo-switch'), pegamos o nome bonito do nosso mapa.
        // Se não encontrar, usa o slug em maiúsculas como fallback.
        const displayName = PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase();
        return `<a href="jogos.html?platform=${slug}"><p>${displayName}: <span>${count}</span></p></a>`;
    }).join('');
    document.getElementById('platform-stats-list').innerHTML = platformsHTML;

    // Gera o HTML para a lista de status e insere no local correto.
    const statusHTML = Object.entries(statusCounts).map(([s, c]) => `<p>${s}: <span>${c}</span></p>`).join('');
    document.getElementById('status-stats-list').innerHTML = statusHTML;

    // Gera o HTML para as estatísticas gerais e insere no local correto.
    const generalHTML = `<p>Total de Jogos Catalogados: <span>${gamesData.length}</span></p>`;
    document.getElementById('general-stats-list').innerHTML = generalHTML;

    // --- GRÁFICO 1: Plataformas (Tipo Rosca) ---
    new Chart(platformChartCanvas, {
        type: 'doughnut',
        data: {
            // Usa o mapa para criar os rótulos do gráfico também.
            labels: Object.keys(platformCounts).map(slug => PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase()),
            datasets: [{
                label: 'Jogos por Plataforma',
                data: Object.values(platformCounts),
                backgroundColor: ['rgba(76, 175, 80, 0.8)','rgba(3, 169, 244, 0.8)','rgba(249, 168, 37, 0.8)','rgba(96, 125, 139, 0.8)','rgba(255, 152, 0, 0.8)','rgba(244, 67, 54, 0.8)'],
                borderColor: 'rgba(20, 21, 24, 0.5)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: getComputedStyle(document.body).getPropertyValue('--color-text-primary') }
                }
            }
        }
    });

    // --- GRÁFICO 2: Status (Tipo Pizza) ---
    const statusColorMap = {
        'Finalizado 100%': '#4CAF50', 'Finalizado': '#03A9F4', 'Jogando': '#F9A825',
        'Pausado': '#607D8B', 'Arquivado': '#FF9800', 'Abandonado': '#f44336'
    };

    new Chart(statusChartCanvas, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                label: 'Jogos por Status',
                data: Object.values(statusCounts),
                backgroundColor: Object.keys(statusCounts).map(status => statusColorMap[status] || '#cccccc'),
                borderColor: 'rgba(20, 21, 24, 0.5)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: getComputedStyle(document.body).getPropertyValue('--color-text-primary') }
                }
            }
        }
    });
}



// ===================================================================================
// --- SEÇÃO: UTILITÁRIOS GLOBAIS ----------------------------------------------------
// ===================================================================================

/**
 * Configura o botão de alternância de tema (claro/escuro).
 * Salva a preferência do usuário no `localStorage` para que a escolha seja lembrada.
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Função interna para aplicar um tema específico.
    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        // Adiciona ou remove a classe 'light-mode' do body, que ativa as cores claras no CSS.
        body.classList.toggle('light-mode', isLight);
        // Alterna qual ícone (sol ou lua) está visível.
        sunIcon.style.display = isLight ? 'none' : 'block';
        moonIcon.style.display = isLight ? 'block' : 'none';
    };

    // No carregamento da página, aplica o tema salvo no localStorage. Se não houver, usa 'dark' como padrão.
    applyTheme(localStorage.getItem('theme') || 'dark');

    // Adiciona o evento de clique para o botão.
    themeToggle.addEventListener('click', () => {
        // Verifica qual tema está ativo e define o novo tema como o oposto.
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        // Salva a nova preferência no localStorage.
        localStorage.setItem('theme', newTheme);
        // Aplica o novo tema.
        applyTheme(newTheme);
    });
}

/**
 * Configura o botão "Voltar ao Topo".
 * Ele aparece quando o usuário rola a página para baixo e some quando está no topo.
 */
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    // Função que é executada toda vez que o usuário rola a página.
    window.onscroll = () => {
        // Se a posição de rolagem for maior que 100 pixels, mostra o botão.
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };
    
    // Adiciona o evento de clique para rolar suavemente de volta ao topo da página.
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}