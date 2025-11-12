// ===================================================================================
// === MEU ZERODEX - SCRIPT PRINCIPAL (script.js) ====================================
// ===================================================================================
//
// INDÍCE DO ARQUIVO:
//
// 1. INICIALIZAÇÃO GERAL E EVENTOS
// 2. VARIÁVEIS DE ESTADO DO CATÁLOGO
// 3. SEÇÃO: LÓGICA DA PÁGINA INICIAL (index.html)
// 4. SEÇÃO: LÓGICA DO CATÁLOGO (jogos.html)
//    - Funções de Filtragem e Ordenação
//    - Manipulação da URL
//    - Configuração dos Controles
// 5. SEÇÃO: LÓGICA DO TOOLTIP DE COMENTÁRIOS
// 6. SEÇÃO: FUNÇÕES DE RENDERIZAÇÃO (CRIAM HTML)
//    - Renderização Principal dos Jogos
//    - Lazy Loading de Imagens
//    - Renderização de Botões e Inicialização
// 7. SEÇÃO: LÓGICA DA PÁGINA SOBRE (sobre.html)
//    - Cálculo e Renderização de Estatísticas
// 8. SEÇÃO: UTILITÁRIOS GLOBAIS
//
// ===================================================================================


// ===================================================================================
// --- 1. INICIALIZAÇÃO GERAL E EVENTOS ----------------------------------------------
// ===================================================================================

/**
 * O evento 'DOMContentLoaded' é o ponto de partida de toda a lógica do site.
 * Ele garante que o JavaScript só será executado após o HTML da página ser
 * completamente carregado, evitando erros de elementos não encontrados.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Funções Globais (rodam em todas as páginas) ---
    setupThemeToggle();
    setupBackToTopButton();

    // --- Lógica Específica para Cada Página ---
    // O código verifica qual página está ativa procurando por um elemento com um ID específico.
    // Esta abordagem modular mantém o código organizado e performático.

    // Se estiver na página inicial (index.html).
    if (document.querySelector('.homepage-shelf')) {
        setupHomepageShelves();
        setupStickyShelfNav();
        setupSmoothShelfScrolling();
    }

    // Se estiver na página do catálogo de jogos (jogos.html).
    if (document.querySelector('#catalogo')) {
        initializeCatalog();
    }
    
    // Se estiver na página "Sobre" (sobre.html).
    if (document.querySelector('#dynamic-stats')) {
        renderStatistics();
    }

    // Se QUALQUER página tiver uma grade de jogos, ativa a lógica do tooltip.
    // Isso torna a função universal para a página inicial e o catálogo.
    if (document.querySelector('.game-grid')) {
        setupTooltipLogic();
    }
    
    // --- REGISTRO DO SERVICE WORKER (para funcionalidade offline) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => console.log('Service Worker registrado com sucesso:', registration))
                .catch(error => console.log('Falha ao registrar o Service Worker:', error));
        });
    }
});


// ===================================================================================
// --- 2. VARIÁVEIS DE ESTADO DO CATÁLOGO --------------------------------------------
// ===================================================================================
// Guardam o estado atual dos filtros, funcionando como a "memória" da página.
let currentSearchTerm = '';
let currentPlatform = 'all';
let currentSort = 'id-desc';


// ===================================================================================
// --- 3. SEÇÃO: LÓGICA DA PÁGINA INICIAL (index.html) -------------------------------
// ===================================================================================

/**
 * Preenche as seções ("estantes") da página inicial com os jogos correspondentes.
 * Cada estante exibe um número limitado de jogos (MAX_GAMES_PER_SHELF).
 * Se uma categoria não tiver jogos, a seção inteira é ocultada.
 */
function setupHomepageShelves() {
    const homepageShelves = [
        { selector: '#currently-playing', status: 'playing' },
        { selector: '#archived-games', status: 'archived' },
        { selector: '#completed-100-games', status: 'completed-100' },
        { selector: '#finished-games', status: 'completed' },
        { selector: '#retired-games', status: 'retired' },
        { selector: '#abandoned-games', status: 'abandoned' },
    ];
    
    const MAX_GAMES_PER_SHELF = 8;

    homepageShelves.forEach(shelf => {
        const sectionElement = document.querySelector(shelf.selector);
        const navLink = document.querySelector(`#shelf-nav a[href="${shelf.selector}"]`);

        if (!sectionElement || !navLink) return;

        // Filtra os jogos pelo status e limita a quantidade com slice().
        const gamesForShelf = gamesData
            .filter(game => game.status === shelf.status)
            .slice(0, MAX_GAMES_PER_SHELF);

        if (gamesForShelf.length > 0) {
            navLink.style.display = '';
            renderGames(gamesForShelf, `${shelf.selector} .game-grid`);
        } else {
            // Se não há jogos, esconde a seção e o link de navegação.
            sectionElement.style.display = 'none';
            navLink.style.display = 'none';
        }
    });
}

/**
 * Controla o menu de navegação fixo ('shelf-nav') da página inicial.
 * Ele se torna visível quando o usuário rola a página para além da seção inicial.
 */
function setupStickyShelfNav() {
    const shelfNav = document.getElementById('shelf-nav');
    const heroSection = document.getElementById('hero');
    if (!shelfNav || !heroSection) return;

    const checkScroll = () => {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        // Adiciona ou remove a classe que controla a visibilidade do menu.
        if (window.scrollY > heroBottom) {
            shelfNav.classList.add('shelf-nav-visible');
            shelfNav.classList.remove('shelf-nav-hidden');
        } else {
            shelfNav.classList.remove('shelf-nav-visible');
            shelfNav.classList.add('shelf-nav-hidden');
        }
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verifica a posição no carregamento da página.
}

/**
 * Adiciona uma animação de rolagem suave para os links da navegação de seções.
 */
function setupSmoothShelfScrolling() {
    document.querySelectorAll('#shelf-nav a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Previne o salto padrão do navegador.
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Rola a página suavemente até a seção de destino.
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}


// ===================================================================================
// --- 4. SEÇÃO: LÓGICA DO CATÁLOGO (jogos.html) -------------------------------------
// ===================================================================================

// --- Funções de Filtragem e Ordenação ---

/**
 * NOVO: Função auxiliar que centraliza a lógica de filtragem dos DADOS.
 * Retorna um array de jogos filtrado com base no estado atual das variáveis globais.
 * @returns {Array<Object>} Uma lista de jogos que correspondem aos filtros.
 */
function getFilteredGames() {
    let games = [...gamesData]; // Começa com uma cópia para não modificar o array original.

    // 1. Aplica filtro de plataforma.
    if (currentPlatform !== 'all') {
        // CORREÇÃO: `platform` é um array, então usamos `includes`.
        games = games.filter(game => game.platform.includes(currentPlatform));
    }

    // 2. Aplica filtro de busca (termo de pesquisa).
    if (currentSearchTerm) {
        const searchTerm = currentSearchTerm.toLowerCase();
        games = games.filter(game => game.title.toLowerCase().includes(searchTerm));
    }
    
    return games;
}

/**
 * Aplica filtros de forma eficiente, escondendo ou mostrando os cards já existentes no DOM.
 * Isso torna a filtragem por texto ou plataforma instantânea, sem recarregar a grade.
 */
function applyFilters() {
    const allCards = document.querySelectorAll('#catalogo .game-grid .game-card');
    const gameGrid = document.querySelector('#catalogo .game-grid');
    let visibleGameCount = 0;

    if (gameGrid) gameGrid.classList.add('reloading'); // Efeito visual de recarga.

    allCards.forEach(card => {
        const cardPlatforms = card.dataset.platform.split(',');
        const platformMatch = currentPlatform === 'all' || cardPlatforms.includes(currentPlatform);
        
        const title = card.querySelector('.game-title').textContent.toLowerCase();
        const searchMatch = currentSearchTerm === '' || title.includes(currentSearchTerm);

        // Se o card corresponde a ambos os filtros, ele fica visível.
        if (platformMatch && searchMatch) {
            card.classList.remove('hidden');
            visibleGameCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    setTimeout(() => {
        if (gameGrid) gameGrid.classList.remove('reloading');
    }, 200);

    // Mostra ou esconde a mensagem de "Nenhum jogo encontrado".
    const noResultsMessage = document.querySelector('#catalogo .no-results-message');
    if (noResultsMessage) {
        noResultsMessage.style.display = visibleGameCount === 0 ? 'block' : 'none';
    }
}

/**
 * Ordena os jogos e re-renderiza completamente a grade.
 * Esta função é chamada apenas quando o critério de ordenação é alterado,
 * pois exige a reconstrução do DOM na nova ordem.
 */
function sortAndReRender() {
    // Usa a função auxiliar para obter a lista de jogos já filtrada.
    let gamesToRender = getFilteredGames(); 
    
    // Aplica a ordenação escolhida.
    switch (currentSort) {
        case 'title-asc':
            gamesToRender.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            gamesToRender.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'id-desc':
        default:
            gamesToRender.sort((a, b) => b.id - a.id);
            break;
    }
    
    renderGames(gamesToRender, '#catalogo .game-grid');
    updateURL(); // Atualiza a URL para refletir o novo estado.
}


// --- Manipulação da URL ---

/**
 * Lê os parâmetros da URL (ex: ?platform=pc) ao carregar a página.
 * Isso permite que um link compartilhado já aplique os filtros automaticamente.
 */
function readURLAndSetupControls() {
    const params = new URLSearchParams(window.location.search);
    currentPlatform = params.get('platform') || 'all';
    currentSearchTerm = params.get('search') || '';
    currentSort = params.get('sort') || 'id-desc';
    
    // Atualiza os elementos visuais para corresponderem aos valores da URL.
    document.getElementById('search-bar').value = currentSearchTerm;
    document.getElementById('sort-options').value = currentSort;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.platform === currentPlatform);
    });
    
    setupControls(); // Após ler os valores, configura os "ouvintes de eventos".
}

/**
 * Atualiza a URL na barra de endereço do navegador sem recarregar a página.
 * Isso cria uma experiência de usuário mais fluida e URLs compartilháveis.
 */
function updateURL() {
    const params = new URLSearchParams();
    if (currentPlatform !== 'all') params.set('platform', currentPlatform);
    if (currentSearchTerm) params.set('search', currentSearchTerm);
    if (currentSort !== 'id-desc') params.set('sort', currentSort);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    history.pushState(null, '', newUrl);
}

// --- Configuração dos Controles ---

/**
 * Configura os "ouvintes de eventos" para os controles de filtro, busca e ordenação.
 */
function setupControls() {
    // Barra de pesquisa: resposta instantânea usando applyFilters.
    document.getElementById('search-bar').addEventListener('keyup', e => {
        currentSearchTerm = e.target.value.toLowerCase();
        applyFilters();
        updateURL();
    });
    
    // Menu de ordenação: a única ação que precisa re-renderizar tudo.
    document.getElementById('sort-options').addEventListener('change', e => {
        currentSort = e.target.value;
        sortAndReRender();
    });

    // Botões de filtro: resposta instantânea usando applyFilters.
    document.querySelectorAll('#filter-container .filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentPlatform = button.dataset.platform;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilters();
            updateURL();
        });
    });

    // Botão "Me Surpreenda!".
    document.getElementById('surprise-btn').addEventListener('click', () => {
        const visibleCards = document.querySelectorAll('#catalogo .game-card:not(.hidden)');
        if (visibleCards.length === 0) return;

        // Remove destaque anterior, se houver.
        const currentHighlight = document.querySelector('.highlight');
        if (currentHighlight) currentHighlight.classList.remove('highlight');

        const randomIndex = Math.floor(Math.random() * visibleCards.length);
        const randomCard = visibleCards[randomIndex];

        randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        randomCard.classList.add('highlight');
        setTimeout(() => randomCard.classList.remove('highlight'), 5000);
    });

    // Delegação de evento para o botão "Editar Jogo" dentro da grade.
    document.querySelector('#catalogo .game-grid').addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const gameId = parseInt(event.target.dataset.editId);
            const gameToEdit = gamesData.find(game => game.id === gameId);

            if (gameToEdit) {
                // Salva os dados do jogo no localStorage e redireciona para a página de edição.
                localStorage.setItem('gameToEdit', JSON.stringify(gameToEdit));
                window.location.href = 'adicionar.html';
            }
        }
    });
}


// ===================================================================================
// --- 5. SEÇÃO: LÓGICA DO TOOLTIP DE COMENTÁRIOS ------------------------------------
// ===================================================================================

/**
 * Configura a lógica para exibir um tooltip com o comentário do jogo.
 * O tooltip é posicionado de forma inteligente para não sair da tela.
 */
function setupTooltipLogic() {
    document.querySelectorAll('.game-grid').forEach(grid => {
        // Usa delegação de eventos para performance.
        grid.addEventListener('click', (event) => {
            const trigger = event.target.closest('.review-trigger');
            if (!trigger) return;

            removeExistingTooltip(); // Fecha qualquer tooltip que já esteja aberto.

            const card = trigger.closest('.game-card');
            const gameId = parseInt(card.querySelector('.game-number').textContent);
            const gameData = gamesData.find(g => g.id === gameId);

            if (gameData && gameData.review) {
                const tooltip = createTooltipElement(gameData, card);
                grid.appendChild(tooltip);
                positionTooltip(tooltip, card);
                
                // Anima a entrada do tooltip.
                setTimeout(() => tooltip.classList.add('active'), 10);
            }
        });
    });

    // Adiciona um listener para fechar o tooltip ao clicar fora dele.
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.game-card') && !event.target.closest('.review-card')) {
            removeExistingTooltip();
        }
    });
}

/** Função auxiliar para remover o tooltip ativo. */
function removeExistingTooltip() {
    const existingTooltip = document.querySelector('.review-card');
    if (existingTooltip) {
        existingTooltip.classList.remove('active');
        setTimeout(() => existingTooltip.remove(), 300); // Remove do DOM após a animação.
    }
}

/** Função auxiliar para criar o elemento HTML do tooltip. */
function createTooltipElement(gameData, card) {
    const tooltip = document.createElement('div');
    tooltip.className = 'review-card';
    tooltip.setAttribute('data-tooltip-for-id', gameData.id);
    tooltip.innerHTML = `<h3>Comentário</h3><p>${gameData.review}</p>`;
    return tooltip;
}

/** Função auxiliar para posicionar o tooltip de forma inteligente. */
function positionTooltip(tooltip, card) {
    const cardRect = card.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const margin = 15;
    const spaceRight = window.innerWidth - cardRect.right;

    // Decide se o tooltip ficará à direita ou à esquerda.
    if (spaceRight > (tooltipWidth + margin)) {
        tooltip.classList.add('on-right');
        tooltip.style.left = `${card.offsetLeft + card.offsetWidth + margin}px`;
    } else {
        tooltip.classList.add('on-left');
        tooltip.style.left = `${card.offsetLeft - tooltipWidth - margin}px`;
    }
    // Alinha verticalmente com o topo do card.
    tooltip.style.top = `${card.offsetTop}px`;
}


// ===================================================================================
// --- 6. SEÇÃO: FUNÇÕES DE RENDERIZAÇÃO (CRIAM HTML) --------------------------------
// ===================================================================================

/**
 * Orquestra a inicialização da página do catálogo.
 */
function initializeCatalog() {
    renderFilterButtons();
    readURLAndSetupControls();
    // Inicia a renderização. A própria `renderGames` aplicará o filtro inicial
    // lido da URL no final do processo, garantindo que tudo apareça corretamente.
    renderGames(gamesData, '#catalogo .game-grid');
}

/**
 * Gera e insere o HTML dos cards de jogos na grade.
 * Utiliza renderização assíncrona em lotes com `requestAnimationFrame` para
 * evitar que a página congele ao renderizar muitos jogos de uma vez.
 * @param {Array} gamesArray - A lista de jogos a ser exibida.
 * @param {string} gridSelector - O seletor CSS da grade de destino.
 */
function renderGames(gamesArray, gridSelector) {
    const gameGrid = document.querySelector(gridSelector);
    if (!gameGrid) return;

    gameGrid.innerHTML = gamesArray.length === 0 ? '<p class="no-results-message">Nenhum jogo encontrado.</p>' : '';
    if (gamesArray.length === 0) return;

    let currentIndex = 0;
    const batchSize = 10; // Processa 10 jogos por frame.

    function processBatch() {
        const fragment = document.createDocumentFragment(); // Mais eficiente para adicionar múltiplos elementos.
        const endIndex = Math.min(currentIndex + batchSize, gamesArray.length);

        for (let i = currentIndex; i < endIndex; i++) {
            const game = gamesArray[i];
            const cardElement = document.createElement('div');
            cardElement.className = 'game-card';
            cardElement.dataset.platform = game.platform.join(',');
            
            // Lógica para criar o HTML de cada card.
            const platformText = game.platform.map(slug => PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase()).join(', ');
            const platformHTML = game.storeUrl ? `<a href="${game.storeUrl}" target="_blank" rel="noopener noreferrer">${platformText}</a>` : platformText;
            const guideLinks = game.guide.map(g => `<a href="${g.url}" target="_blank" rel="noopener noreferrer">${g.title}</a>`).join(' | ');
            const guideHTML = game.guide.length > 0 ? `<p><strong>Guia:</strong> ${guideLinks}</p>` : '<p><strong>Guia:</strong> Não utilizado</p>';

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
            requestAnimationFrame(processBatch); // Agenda o próximo lote.
        } else {
            // Finalização: todos os cards estão no DOM.
            gameGrid.querySelectorAll('.game-card').forEach(card => card.classList.add('card-enter-animation'));
            setupLazyLoading();
            if (document.querySelector('#catalogo')) applyFilters(); // Aplica o filtro inicial se estiver no catálogo.
        }
    }
    requestAnimationFrame(processBatch); // Inicia o processo.
}

/**
 * Configura o Intersection Observer para carregar imagens sob demanda (lazy loading),
 * melhorando a performance de carregamento inicial da página.
 */
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src; // A mágica acontece aqui!
                image.classList.remove('lazy-image');
                observer.unobserve(image); // Para de observar a imagem após o carregamento.
            }
        });
    }, { rootMargin: '0px 0px 250px 0px' }); // Carrega a imagem 250px antes de ela entrar na tela.

    lazyImages.forEach(image => imageObserver.observe(image));
}

/**
 * Cria dinamicamente os botões de filtro de plataforma no catálogo,
 * tornando o sistema extensível a novas plataformas sem alterar o HTML.
 */
function renderFilterButtons() {
    const filterContainer = document.querySelector('#filter-container');
    if (!filterContainer) return;

    // Extrai todas as plataformas únicas de todos os jogos.
    const allPlatforms = gamesData.flatMap(g => g.platform);
    const uniquePlatforms = ['all', ...new Set(allPlatforms)];
    
    const buttonsHTML = uniquePlatforms.map(slug => {
        const displayName = slug === 'all' ? 'Todos' : (PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase());
        return `<button class="filter-btn" data-platform="${slug}">${displayName}</button>`;
    }).join('');
    
    filterContainer.innerHTML = buttonsHTML + `
        <button id="surprise-btn">Me Surpreenda!</button>
        <a href="adicionar.html" id="add-game-btn" class="cta-button">Adicionar Jogo</a>
    `;
}


// ===================================================================================
// --- 7. SEÇÃO: LÓGICA DA PÁGINA SOBRE (sobre.html) ---------------------------------
// ===================================================================================

/**
 * Calcula e exibe as estatísticas e os gráficos na página "Sobre".
 */
function renderStatistics() {
    const platformChartCanvas = document.getElementById('platform-chart');
    const statusChartCanvas = document.getElementById('status-chart');
    if (!platformChartCanvas || !statusChartCanvas || gamesData.length === 0) return;

    // Calcula a contagem de jogos por plataforma.
    const platformCounts = gamesData.reduce((acc, game) => {
        (Array.isArray(game.platform) ? game.platform : [game.platform]).forEach(slug => {
            acc[slug] = (acc[slug] || 0) + 1;
        });
        return acc;
    }, {});
    
    // Calcula a contagem de jogos por status.
    const statusCounts = gamesData.reduce((acc, game) => {
        acc[game.statusText] = (acc[game.statusText] || 0) + 1;
        return acc;
    }, {});

    // Preenche as caixas de estatísticas de texto.
    const platformsHTML = Object.entries(platformCounts).map(([slug, count]) => {
        const displayName = PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase();
        return `<a href="jogos.html?platform=${slug}"><p>${displayName}: <span>${count}</span></p></a>`;
    }).join('');
    document.getElementById('platform-stats-list').innerHTML = platformsHTML;

    const statusHTML = Object.entries(statusCounts).map(([s, c]) => `<p>${s}: <span>${c}</span></p>`).join('');
    document.getElementById('status-stats-list').innerHTML = statusHTML;

    const generalHTML = `<p>Total de Jogos Catalogados: <span>${gamesData.length}</span></p>`;
    document.getElementById('general-stats-list').innerHTML = generalHTML;

    // Renderiza o gráfico de Plataformas.
    new Chart(platformChartCanvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(platformCounts).map(slug => PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase()),
            datasets: [{
                data: Object.values(platformCounts),
                backgroundColor: ['#4CAF50', '#03A9F4', '#F9A825', '#607D8B', '#FF9800', '#f44336'],
                borderColor: 'rgba(20, 21, 24, 0.5)',
                borderWidth: 2
            }]
        },
        options: { plugins: { legend: { position: 'top', labels: { color: getComputedStyle(document.body).getPropertyValue('--color-text-primary') } } } }
    });

    // Renderiza o gráfico de Status.
    const statusColorMap = {
        '100%': '#4CAF50', 'Finalizado': '#03A9F4', 'Jogando': '#F9A825',
        'Aposentado': '#607D8B', 'Arquivado': '#FF9800', 'Abandonado': '#f44336'
    };
    new Chart(statusChartCanvas, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: Object.keys(statusCounts).map(status => statusColorMap[status] || '#cccccc'),
                borderColor: 'rgba(20, 21, 24, 0.5)',
                borderWidth: 2
            }]
        },
        options: { plugins: { legend: { position: 'top', labels: { color: getComputedStyle(document.body).getPropertyValue('--color-text-primary') } } } }
    });
}


// ===================================================================================
// --- 8. SEÇÃO: UTILITÁRIOS GLOBAIS -------------------------------------------------
// ===================================================================================

/**
 * Configura o botão de alternância de tema (claro/escuro).
 * Salva a preferência do usuário no `localStorage`.
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        body.classList.toggle('light-mode', isLight);
        sunIcon.style.display = isLight ? 'none' : 'block';
        moonIcon.style.display = isLight ? 'block' : 'none';
    };

    applyTheme(localStorage.getItem('theme') || 'dark');

    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

/**
 * Configura o botão "Voltar ao Topo", que aparece ao rolar a página.
 */
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    window.onscroll = () => {
        const isScrolled = document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
        backToTopButton.style.display = isScrolled ? "block" : "none";
    };
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}