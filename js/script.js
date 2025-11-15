// ===================================================================================
// === ZERODEX - SCRIPT PRINCIPAL (script.js) ====================================
// ===================================================================================
//
// DESCRIÇÃO:
// Este arquivo contém toda a lógica de interatividade do site Zerodex. Ele é
// responsável por renderizar os jogos, controlar os filtros, gerenciar o estado
// da aplicação, calcular estatísticas e lidar com eventos do usuário.
//
// ÍNDICE DO ARQUIVO:
//
// 1. VARIÁVEIS DE ESTADO E INICIALIZAÇÃO
//    - Variáveis Globais de Estado
//    - Ponto de Entrada Principal (DOMContentLoaded)
// 2. LÓGICA ESPECÍFICA DAS PÁGINAS
//    - Página Inicial (index.html)
//    - Catálogo de Jogos (jogos.html)
//    - Página Sobre (sobre.html)
// 3. COMPONENTES E LÓGICAS COMPARTILHADAS
//    - Tooltip de Comentários
//    - Funções de Renderização (Criação de HTML)
//    - Lazy Loading de Imagens
// 4. UTILITÁRIOS GLOBAIS
//    - Alternador de Tema
//    - Botão "Voltar ao Topo"
//
// ===================================================================================


// ===================================================================================
// --- 1. VARIÁVEIS DE ESTADO E INICIALIZAÇÃO ----------------------------------------
// ===================================================================================

// ====== VARIÁVEIS GLOBAIS DE ESTADO ======
// Armazenam o estado atual dos filtros do catálogo, funcionando como a "memória"
// da página de jogos para permitir uma experiência de usuário consistente.
let currentSearchTerm = '';
let currentPlatform = 'all';
let currentSort = 'id-desc';

// ====== PONTO DE ENTRADA PRINCIPAL ======
/**
 * O evento 'DOMContentLoaded' é o ponto de partida de toda a lógica do site.
 * Ele garante que o JavaScript só será executado após o HTML da página ser
 * completamente carregado e analisado, evitando erros de elementos não encontrados.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Funções Globais (rodam em todas as páginas) ---
    setupThemeToggle();
    setupBackToTopButton();

    // --- Lógica Específica para Cada Página ---
    // A abordagem a seguir verifica a existência de elementos únicos em cada página
    // para executar apenas o código necessário, mantendo a performance.

    if (document.querySelector('.homepage-shelf')) {
        initializeHomepage();
    }
    if (document.querySelector('#catalogo')) {
        initializeCatalog();
    }
    if (document.querySelector('#dynamic-stats')) {
        renderStatistics();
    }
    if (document.querySelector('.game-grid')) {
        setupTooltipLogic();
    }

});


// ===================================================================================
// --- 2. LÓGICA ESPECÍFICA DAS PÁGINAS ----------------------------------------------
// ===================================================================================

// ====== PÁGINA INICIAL (index.html) ======

/**
 * Orquestra a inicialização de todas as funcionalidades da página inicial.
 */
function initializeHomepage() {
    setupHomepageShelves();
    setupStickyShelfNav();
    setupSmoothShelfScrolling();
}

/**
 * Preenche as "estantes" da página inicial com os jogos correspondentes.
 * Cada estante exibe um número limitado de jogos. Se uma categoria não tiver
 * jogos, a seção inteira e seu link de navegação são ocultados.
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
    const MAX_GAMES_PER_SHELF = 8; // Limite de jogos por estante

    homepageShelves.forEach(shelf => {
        const sectionElement = document.querySelector(shelf.selector);
        const navLink = document.querySelector(`#shelf-nav a[href="${shelf.selector}"]`);
        if (!sectionElement || !navLink) return;

        // Filtra os jogos pelo status e limita a quantidade com slice().
        const gamesForShelf = gamesData
            .filter(game => game.status === shelf.status)
            .slice(0, MAX_GAMES_PER_SHELF);

        if (gamesForShelf.length > 0) {
            renderGames(gamesForShelf, `${shelf.selector} .game-grid`);
        } else {
            // Se não há jogos, esconde a seção e o link de navegação para manter a UI limpa.
            sectionElement.style.display = 'none';
            navLink.style.display = 'none';
        }
    });
}

/**
 * Controla o menu de navegação fixo ('shelf-nav') da página inicial, que se torna
 * visível quando o usuário rola a página para além da seção inicial.
 */
function setupStickyShelfNav() {
    const shelfNav = document.getElementById('shelf-nav');
    const heroSection = document.getElementById('hero');
    if (!shelfNav || !heroSection) return;

    const checkScroll = () => {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        // Adiciona ou remove classes CSS que controlam a visibilidade do menu.
        if (window.scrollY > heroBottom) {
            shelfNav.classList.add('shelf-nav-visible');
            shelfNav.classList.remove('shelf-nav-hidden');
        } else {
            shelfNav.classList.remove('shelf-nav-visible');
            shelfNav.classList.add('shelf-nav-hidden');
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verifica a posição no carregamento inicial da página.
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
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ====== CATÁLOGO DE JOGOS (jogos.html) ======

/**
 * Orquestra a inicialização completa da página do catálogo.
 */
function initializeCatalog() {
    renderFilterButtons();
    initializeStateFromURL();
    setupCatalogControls();
    sortAndReRender(); // Renderização inicial baseada no estado da URL ou padrão.
}

/**
 * Retorna um array de jogos filtrado com base no estado atual das variáveis globais.
 * Esta função centraliza a lógica de manipulação dos DADOS, separando-a da renderização.
 * @returns {Array<Object>} Uma lista de objetos de jogo que correspondem aos filtros.
 */
function getFilteredGames() {
    // Começa com uma cópia para não modificar o array original 'gamesData'.
    let games = [...gamesData];

    // 1. Aplica filtro de plataforma.
    if (currentPlatform !== 'all') {
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
 * Este método é rápido para filtros de texto e plataforma, pois evita a reconstrução
 * total da grade de jogos.
 */
function applyFilters() {
    const allCards = document.querySelectorAll('#catalogo .game-grid .game-card');
    const gameGrid = document.querySelector('#catalogo .game-grid');
    const noResultsMessage = document.querySelector('#catalogo .no-results-message');
    let visibleGameCount = 0;

    if (gameGrid) gameGrid.classList.add('reloading'); // Efeito visual de recarga.

    allCards.forEach(card => {
        const cardPlatforms = card.dataset.platform.split(',');
        const platformMatch = currentPlatform === 'all' || cardPlatforms.includes(currentPlatform);

        const title = card.querySelector('.game-title').textContent.toLowerCase();
        const searchMatch = !currentSearchTerm || title.includes(currentSearchTerm);

        // O card só é visível se corresponder a ambos os filtros.
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
    if (noResultsMessage) {
        noResultsMessage.style.display = visibleGameCount === 0 ? 'block' : 'none';
    }
}

/**
 * Ordena os jogos e re-renderiza completamente a grade. Esta função é mais "pesada"
 * e é chamada apenas quando o critério de ordenação é alterado.
 */
function sortAndReRender() {
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
    updateURL(); // Sincroniza a URL com o estado atual.
}

/**
 * Lê os parâmetros da URL (ex: ?platform=pc) ao carregar a página e define
 * o estado inicial dos filtros e controles. Permite que links compartilhados
 * apliquem os filtros automaticamente.
 */
function initializeStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    currentPlatform = params.get('platform') || 'all';
    currentSearchTerm = params.get('search') || '';
    currentSort = params.get('sort') || 'id-desc';

    // Atualiza a UI para refletir os valores da URL.
    const searchBar = document.getElementById('search-bar');
    const sortOptions = document.getElementById('sort-options');
    if (searchBar) searchBar.value = currentSearchTerm;
    if (sortOptions) sortOptions.value = currentSort;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.platform === currentPlatform);
    });
}

/**
 * Atualiza a URL na barra de endereço do navegador sem recarregar a página,
 * usando a History API. Isso cria URLs compartilháveis e uma melhor experiência.
 */
function updateURL() {
    const params = new URLSearchParams();
    if (currentPlatform !== 'all') params.set('platform', currentPlatform);
    if (currentSearchTerm) params.set('search', currentSearchTerm);
    if (currentSort !== 'id-desc') params.set('sort', currentSort);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    history.pushState(null, '', newUrl);
}

/**
 * Configura os "ouvintes de eventos" para todos os controles do catálogo,
 * utilizando delegação de eventos sempre que possível para otimizar a performance.
 */
function setupCatalogControls() {
    // --- Barra de Pesquisa ---
    document.getElementById('search-bar')?.addEventListener('keyup', e => {
        currentSearchTerm = e.target.value.toLowerCase();
        applyFilters(); // Usa o método rápido que não re-renderiza.
        updateURL();
    });

    // --- Menu de Ordenação ---
    document.getElementById('sort-options')?.addEventListener('change', e => {
        currentSort = e.target.value;
        sortAndReRender(); // Precisa re-renderizar para aplicar a nova ordem.
    });

    // --- Contêiner de Botões (Filtros e Surpresa) ---
    // Utiliza delegação de eventos para gerenciar cliques nos botões de forma eficiente.
    const filterContainer = document.getElementById('filter-container');
    if (filterContainer) {
        filterContainer.addEventListener('click', (event) => {
            const target = event.target;

            // Delegação para botões de filtro de plataforma.
            if (target.matches('.filter-btn')) {
                currentPlatform = target.dataset.platform;
                filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
                applyFilters();
                updateURL();
            }

            // Delegação para o botão "Me Surpreenda!".
            if (target.matches('#surprise-btn')) {
                const visibleCards = document.querySelectorAll('#catalogo .game-card:not(.hidden)');
                if (visibleCards.length === 0) return;

                const currentHighlight = document.querySelector('.highlight');
                if (currentHighlight) currentHighlight.classList.remove('highlight');

                const randomIndex = Math.floor(Math.random() * visibleCards.length);
                const randomCard = visibleCards[randomIndex];

                randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                randomCard.classList.add('highlight');
                setTimeout(() => randomCard.classList.remove('highlight'), 5000);
            }
        });
    }

    // --- Botão de Edição (dentro dos cards) ---
    // Delegação de evento no contêiner pai da grade de jogos.
    document.querySelector('#catalogo .game-grid')?.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const gameId = parseInt(event.target.dataset.editId, 10);
            const gameToEdit = gamesData.find(game => game.id === gameId);

            if (gameToEdit) {
                // Salva os dados do jogo no localStorage e redireciona para a página de adição/edição.
                localStorage.setItem('gameToEdit', JSON.stringify(gameToEdit));
                window.location.href = 'adicionar.html';
            }
        }
    });
}

// ====== PÁGINA SOBRE (sobre.html) ======

/**
 * Calcula e exibe as estatísticas e os gráficos na página "Sobre".
 */
function renderStatistics() {
    const platformChartCanvas = document.getElementById('platform-chart');
    const statusChartCanvas = document.getElementById('status-chart');
    if (!platformChartCanvas || !statusChartCanvas || typeof Chart === 'undefined' || gamesData.length === 0) return;

    // Calcula a contagem de jogos por plataforma.
    const platformCounts = gamesData.reduce((acc, game) => {
        game.platform.forEach(slug => {
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

    document.getElementById('general-stats-list').innerHTML = `<p>Total de Jogos Catalogados: <span>${gamesData.length}</span></p>`;

    const textColor = getComputedStyle(document.body).getPropertyValue('--color-text-primary');
    const chartOptions = { plugins: { legend: { position: 'top', labels: { color: textColor } } } };

    // Renderiza o gráfico de Plataformas (Doughnut).
    new Chart(platformChartCanvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(platformCounts).map(slug => PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase()),
            datasets: [{
                data: Object.values(platformCounts),
                backgroundColor: ['#4CAF50', '#03A9F4', '#F9A825', '#607D8B', '#FF9800', '#f44336', '#9C27B0'],
                borderColor: 'rgba(20, 21, 24, 0.5)',
                borderWidth: 2
            }]
        },
        options: chartOptions
    });

    // Renderiza o gráfico de Status (Pie).
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
        options: chartOptions
    });
}


// ===================================================================================
// --- 3. COMPONENTES E LÓGICAS COMPARTILHADAS ---------------------------------------
// ===================================================================================

// ====== TOOLTIP DE COMENTÁRIOS ======

/**
 * Configura a lógica para exibir um tooltip com o comentário do jogo.
 * Usa delegação de eventos para performance e posiciona o tooltip de forma
 * inteligente para não sair da tela.
 */
function setupTooltipLogic() {
    document.querySelectorAll('.game-grid').forEach(grid => {
        // Usa delegação de eventos para ouvir cliques nos gatilhos de review.
        grid.addEventListener('click', (event) => {
            const trigger = event.target.closest('.review-trigger');
            if (!trigger) return;

            removeExistingTooltip(); // Fecha qualquer tooltip que já esteja aberto.

            const card = trigger.closest('.game-card');
            const gameId = parseInt(card.querySelector('.game-number').textContent, 10);
            const gameData = gamesData.find(g => g.id === gameId);

            if (gameData && gameData.review) {
                const tooltip = createTooltipElement(gameData);
                grid.appendChild(tooltip); // Adiciona ao DOM para calcular dimensões.
                positionTooltip(tooltip, card);
                setTimeout(() => tooltip.classList.add('active'), 10); // Adiciona classe para animar a entrada.
            }
        });
    });

    // Adiciona um listener global para fechar o tooltip ao clicar fora dele.
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.game-card') && !event.target.closest('.review-card')) {
            removeExistingTooltip();
        }
    });
}

/** Remove o tooltip ativo do DOM com uma animação de saída. */
function removeExistingTooltip() {
    const existingTooltip = document.querySelector('.review-card');
    if (existingTooltip) {
        existingTooltip.classList.remove('active');
        setTimeout(() => existingTooltip.remove(), 300); // Remove após a animação.
    }
}

/**
 * Cria o elemento HTML do tooltip.
 * @param {Object} gameData - O objeto do jogo contendo o comentário.
 * @returns {HTMLElement} O elemento do tooltip criado.
 */
function createTooltipElement(gameData) {
    const tooltip = document.createElement('div');
    tooltip.className = 'review-card';
    tooltip.innerHTML = `<h3>Comentário</h3><p>${gameData.review}</p>`;
    return tooltip;
}

/**
 * Calcula e aplica a posição ideal para o tooltip (direita ou esquerda do card).
 * @param {HTMLElement} tooltip - O elemento do tooltip a ser posicionado.
 * @param {HTMLElement} card - O card de jogo de referência.
 */
function positionTooltip(tooltip, card) {
    const cardRect = card.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const margin = 15;
    const spaceRight = window.innerWidth - cardRect.right;

    // Decide se o tooltip ficará à direita ou à esquerda com base no espaço disponível.
    if (spaceRight > (tooltipWidth + margin)) {
        tooltip.classList.add('on-right');
        tooltip.style.left = `${card.offsetLeft + card.offsetWidth + margin}px`;
    } else {
        tooltip.classList.add('on-left');
        tooltip.style.left = `${card.offsetLeft - tooltipWidth - margin}px`;
    }
    tooltip.style.top = `${card.offsetTop}px`; // Alinha verticalmente com o topo do card.
}

// ====== FUNÇÕES DE RENDERIZAÇÃO ======

/**
 * Gera e insere o HTML dos cards de jogos na grade especificada.
 * Utiliza renderização assíncrona em lotes com `requestAnimationFrame` para
 * evitar que a página congele ao renderizar centenas de jogos de uma vez.
 * @param {Array<Object>} gamesArray - A lista de jogos a ser exibida.
 * @param {string} gridSelector - O seletor CSS da grade de destino.
 */
function renderGames(gamesArray, gridSelector) {
    const gameGrid = document.querySelector(gridSelector);
    if (!gameGrid) return;

    gameGrid.innerHTML = ''; // Limpa a grade antes de renderizar.
    if (gamesArray.length === 0) {
        gameGrid.innerHTML = '<p class="no-results-message">Nenhum jogo encontrado.</p>';
        return;
    }

    let currentIndex = 0;
    const batchSize = 10; // Processa 10 jogos por frame para manter a fluidez.

    function processBatch() {
        const fragment = document.createDocumentFragment(); // Mais eficiente para adicionar múltiplos elementos.
        const endIndex = Math.min(currentIndex + batchSize, gamesArray.length);

        for (let i = currentIndex; i < endIndex; i++) {
            const game = gamesArray[i];
            const cardElement = document.createElement('div');
            cardElement.className = 'game-card';
            cardElement.dataset.platform = game.platform.join(','); // Guarda dados para filtragem rápida.
            cardElement.innerHTML = createGameCardHTML(game);
            fragment.appendChild(cardElement);
        }

        gameGrid.appendChild(fragment);
        currentIndex = endIndex;

        if (currentIndex < gamesArray.length) {
            requestAnimationFrame(processBatch); // Agenda o processamento do próximo lote.
        } else {
            // Finalização: todos os cards estão no DOM.
            setupLazyLoading();
        }
    }
    requestAnimationFrame(processBatch); // Inicia o processo.
}

/**
 * Cria e retorna a string HTML para um único card de jogo.
 * @param {Object} game - O objeto do jogo.
 * @returns {string} A string HTML do card.
 */
function createGameCardHTML(game) {
    const platformText = game.platform.map(slug => PLATFORM_DISPLAY_NAMES[slug] || slug.toUpperCase()).join(', ');
    const platformHTML = game.storeUrl
        ? `<a href="${game.storeUrl}" target="_blank" rel="noopener noreferrer">${platformText}</a>`
        : platformText;

    const guideLinks = game.guide.map(g => `<a href="${g.url}" target="_blank" rel="noopener noreferrer">${g.title}</a>`).join(' | ');
    const guideHTML = game.guide.length > 0
        ? `<p><strong>Guia:</strong> ${guideLinks}</p>`
        : '<p><strong>Guia:</strong> Não utilizado</p>';

    const reviewButtonHTML = game.review
        ? `<div class="game-review"><button class="review-trigger secondary-btn" aria-label="Ver comentário para ${game.title}">Ver Comentário</button></div>`
        : '';

    const versionBadgeHTML = game.version ? `<div class="game-version-badge">${game.version}</div>` : '';

    return `
        <div class="card-image-container">
            <div class="game-number">${game.id}</div>
            ${versionBadgeHTML}
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
            ${reviewButtonHTML}
        </div>`;
}


/**
 * Cria dinamicamente os botões de filtro de plataforma no catálogo.
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
        <a href="adicionar.html" id="add-game-btn" class="cta-button">Adicionar Jogo</a>`;
}

// ====== LAZY LOADING DE IMAGENS ======

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
                image.src = image.dataset.src; // A "mágica" acontece aqui.
                image.classList.remove('lazy-image');
                observer.unobserve(image); // Para de observar a imagem após o carregamento.
            }
        });
    }, { rootMargin: '0px 0px 250px 0px' }); // Carrega a imagem 250px antes de ela entrar na tela.

    lazyImages.forEach(image => imageObserver.observe(image));
}


// ===================================================================================
// --- 4. UTILITÁRIOS GLOBAIS --------------------------------------------------------
// ===================================================================================

/**
 * Configura o botão de alternância de tema (claro/escuro) e aplica o tema
 * salvo no `localStorage` do usuário.
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    if (!themeToggle || !body || !sunIcon || !moonIcon) return;

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        body.classList.toggle('light-mode', isLight);
        sunIcon.style.display = isLight ? 'none' : 'block';
        moonIcon.style.display = isLight ? 'block' : 'none';
    };

    // Aplica o tema salvo ou o padrão 'dark' no carregamento.
    applyTheme(localStorage.getItem('theme') || 'dark');

    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

/**
 * Configura o botão "Voltar ao Topo", que aparece ao rolar a página para baixo.
 */
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        const isScrolled = document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
        backToTopButton.style.display = isScrolled ? "block" : "none";
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}