// ===================================================================================
// === MEU ZERODEX - SCRIPT PRINCIPAL ================================================
// ===================================================================================
// Este arquivo controla toda a interatividade do site, desde a exibição dos jogos
// até a troca de tema e os botões de navegação.

// --- [INICIALIZAÇÃO GERAL] ---

/**
 * O evento 'DOMContentLoaded' é disparado quando o HTML da página foi completamente
 * carregado e analisado, sem esperar por folhas de estilo, imagens, etc.
 * É o ponto de partida ideal para executar nosso JavaScript.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Funções de configuração que rodam em todas as páginas
    setupThemeToggle();
    setupBackToTopButton();

    // --- Lógica Específica da Página ---

    // Se estivermos na página do catálogo (jogos.html)
    if (document.querySelector('#catalogo')) {
        renderFilterButtons();       // Cria os botões de filtro (PC, Switch, etc.)
        readURLAndSetupControls();   // Lê os filtros da URL e configura os controles
        updateDisplay();             // Exibe os jogos com base nos filtros
    }
    
    // Se estivermos na página "Sobre" (sobre.html) que tem as estatísticas
    if (document.querySelector('#dynamic-stats')) {
        renderStatistics();          // Calcula e exibe as estatísticas e o gráfico
    }

    // Se estivermos na página inicial (index.html) que tem as "estantes"
    if (document.querySelector('.homepage-shelf')) {
        setupHomepageShelves();      // Configura e exibe os jogos em cada seção
        setupStickyShelfNav();       // Controla o menu de navegação fixo das estantes
    }
});


// --- [VARIÁVEIS DE ESTADO DO CATÁLOGO] ---
// Guardam os filtros e a ordenação atuais na página de catálogo.
let currentSearchTerm = '';
let currentPlatform = 'all';
let currentSort = 'id-desc';


// ===================================================================================
// --- SEÇÃO: LÓGICA DA PÁGINA INICIAL (INDEX.HTML) ----------------------------------
// ===================================================================================

/**
 * Configura as "estantes" de jogos na página inicial.
 * Filtra os jogos por status e os exibe nas seções corretas.
 * Se uma seção não tiver jogos, ela e seu link no menu de navegação são escondidos.
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

    homepageShelves.forEach(shelf => {
        const sectionElement = document.querySelector(shelf.selector);
        const navLink = document.querySelector(`#shelf-nav a[href="${shelf.selector}"]`);

        if (!sectionElement || !navLink) return; // Pula se o elemento não existir

        // Filtra o banco de dados principal para encontrar os jogos desta estante
        const gamesForShelf = gamesData.filter(game => game.status === shelf.status);

        if (gamesForShelf.length > 0) {
            // Se encontrou jogos:
            navLink.style.display = ''; // Garante que o link no menu apareça
            const gridSelector = `${shelf.selector} .game-grid`;
            renderGames(gamesForShelf, gridSelector); // Renderiza os jogos na grade correta
        } else {
            // Se não encontrou jogos, esconde tanto a seção quanto o link do menu
            sectionElement.style.display = 'none';
            navLink.style.display = 'none';
        }
    });
}

/**
 * Controla o menu de navegação fixo ('shelf-nav') na página inicial.
 * Ele aparece quando o usuário rola a página para além da seção "hero".
 */
function setupStickyShelfNav() {
    const shelfNav = document.getElementById('shelf-nav');
    const heroSection = document.getElementById('hero');

    if (!shelfNav || !heroSection) return; // Não faz nada se os elementos não existirem

    const checkScroll = () => {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        // Se a posição de rolagem vertical da janela for maior que o final da seção hero...
        if (window.scrollY > heroBottom) {
            shelfNav.classList.add('shelf-nav-visible');    // Mostra o menu
            shelfNav.classList.remove('shelf-nav-hidden');
        } else {
            shelfNav.classList.remove('shelf-nav-visible'); // Esconde o menu
            shelfNav.classList.add('shelf-nav-hidden');
        }
    };
    
    window.addEventListener('scroll', checkScroll); // Verifica a cada rolagem de página
    checkScroll(); // Verifica uma vez no carregamento para o caso da página já carregar rolada
}


// ===================================================================================
// --- SEÇÃO: LÓGICA DO CATÁLOGO (JOGOS.HTML) ----------------------------------------
// ===================================================================================

/**
 * Função central que atualiza a exibição de jogos no catálogo.
 * Ela filtra, ordena e depois chama a função `renderGames` para exibir o resultado.
 */
function updateDisplay() {
    let filteredGames = [...gamesData]; // Cria uma cópia da lista de jogos para não modificar a original

    // 1. Filtragem
    if (currentSearchTerm) {
        filteredGames = filteredGames.filter(g => g.title.toLowerCase().includes(currentSearchTerm));
    }
    if (currentPlatform !== 'all') {
        filteredGames = filteredGames.filter(g => g.platform === currentPlatform);
    }
    
    // 2. Ordenação
    switch (currentSort) {
        case 'title-asc':
            filteredGames.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            filteredGames.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'id-desc':
        default: // Caso padrão
            filteredGames.sort((a, b) => b.id - a.id);
            break;
    }
    
    // 3. Renderização
    renderGames(filteredGames, '#catalogo .game-grid');
    updateURL(); // Atualiza a URL do navegador para refletir os filtros atuais
}

/**
 * Lê os parâmetros da URL (ex: ?platform=pc&sort=title-asc) ao carregar a página.
 * Isso permite compartilhar links com filtros já aplicados.
 */
function readURLAndSetupControls() {
    const params = new URLSearchParams(window.location.search);
    currentPlatform = params.get('platform') || 'all';
    currentSearchTerm = params.get('search') || '';
    currentSort = params.get('sort') || 'id-desc';
    
    // Atualiza os controles na tela para refletirem os valores da URL
    document.getElementById('search-bar').value = currentSearchTerm;
    document.getElementById('sort-options').value = currentSort;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.platform === currentPlatform);
    });
    
    // Depois de ler os valores, configura os "ouvintes de eventos"
    setupControls();
}

/**
 * Atualiza a URL na barra de endereço do navegador SEM recarregar a página.
 * Isso cria uma experiência de usuário mais fluida.
 */
function updateURL() {
    const params = new URLSearchParams();
    // Adiciona os parâmetros à URL apenas se não forem os valores padrão
    if (currentPlatform !== 'all') params.set('platform', currentPlatform);
    if (currentSearchTerm) params.set('search', currentSearchTerm);
    if (currentSort !== 'id-desc') params.set('sort', currentSort);

    // Constrói a nova URL
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    // `history.pushState` altera a URL sem recarregar a página
    history.pushState({}, '', newUrl);
}

/**
 * Configura os "ouvintes de eventos" para os controles de filtro, busca e ordenação.
 */
function setupControls() {
    // Barra de pesquisa: atualiza a cada tecla pressionada
    document.getElementById('search-bar').addEventListener('keyup', e => {
        currentSearchTerm = e.target.value.toLowerCase();
        updateDisplay();
    });
    // Menu de ordenação: atualiza quando uma nova opção é selecionada
    document.getElementById('sort-options').addEventListener('change', e => {
        currentSort = e.target.value;
        updateDisplay();
    });
    // Botões de filtro de plataforma
    document.querySelectorAll('#filter-container .filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentPlatform = button.dataset.platform; // Pega a plataforma do atributo 'data-platform'
            // Atualiza o estilo visual dos botões
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateDisplay();
        });
    });
    // Lógica do Botão "Me Surpreenda!"
    document.getElementById('surprise-btn').addEventListener('click', () => {
        // Pega apenas os cards que estão visíveis no momento
        const visibleCards = document.querySelectorAll('#catalogo .game-card:not(.hidden)');
        if (visibleCards.length === 0) return;

        // Remove o destaque anterior, se houver
        const currentHighlight = document.querySelector('.highlight');
        if (currentHighlight) {
            currentHighlight.classList.remove('highlight');
        }

        // Escolhe um card aleatório
        const randomIndex = Math.floor(Math.random() * visibleCards.length);
        const randomCard = visibleCards[randomIndex];

        // Rola a página suavemente até o card sorteado
        randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Adiciona um destaque visual temporário
        randomCard.classList.add('highlight');
        setTimeout(() => {
            randomCard.classList.remove('highlight');
        }, 2000); // Remove o destaque após 2 segundos
    });
     // --- Lógica do Botão "Editar Jogo" ---
    document.querySelector('#catalogo .game-grid').addEventListener('click', (event) => {
        // Verifica se o elemento clicado é o nosso botão de editar
        if (event.target.classList.contains('edit-btn')) {
            const gameId = parseInt(event.target.dataset.editId);
            // Encontra o objeto do jogo completo no nosso banco de dados
            const gameToEdit = gamesData.find(game => game.id === gameId);

            if (gameToEdit) {
                // Guarda os dados do jogo no localStorage do navegador.
                // localStorage é uma forma de guardar dados que persistem entre páginas.
                localStorage.setItem('gameToEdit', JSON.stringify(gameToEdit));
                
                // Redireciona o usuário para a página de adicionar/editar.
                window.location.href = 'adicionar.html';
            }
        }
    });
}


// ===================================================================================
// --- SEÇÃO: FUNÇÕES DE RENDERIZAÇÃO (CRIAM HTML) -----------------------------------
// ===================================================================================

/**
 * Gera e insere o HTML dos cards de jogos na grade especificada.
 * @param {Array} gamesArray - A lista de jogos a ser exibida.
 * @param {string} gridSelector - O seletor CSS da grade onde os jogos serão inseridos.
 */
function renderGames(gamesArray, gridSelector) {
    const gameGrid = document.querySelector(gridSelector);
    if (!gameGrid) return; // Para a execução se a grade não for encontrada

    // Limpa a grade e exibe uma mensagem se não houver jogos
    gameGrid.innerHTML = gamesArray.length === 0 ? '<p class="no-results-message">Nenhum jogo encontrado.</p>' : '';

    gamesArray.forEach((game, index) => {
        // Prepara o HTML dos guias
        const guideLinks = game.guide.map(g => `<a href="${g.url}" target="_blank">${g.title}</a>`).join(' | ');
        const guideHTML = game.guide.length > 0 ? `<p><strong>Guia:</strong> ${guideLinks}</p>` : '<p><strong>Guia:</strong> Não utilizado</p>';
        
        // Prepara o HTML da plataforma (com link para a loja, se existir)
        const platformText = game.platform.toUpperCase();
        const platformHTML = game.storeUrl 
            ? `<a href="${game.storeUrl}" target="_blank">${platformText}</a>`
            : platformText;

        // Cria o elemento do card
        const cardElement = document.createElement('div');
        cardElement.className = 'game-card';
        cardElement.dataset.platform = game.platform;

        // Define o HTML interno do card
        cardElement.innerHTML = `
            <div class="card-image-container">
                <div class="game-number">${game.id}</div>
                ${game.version ? `<div class="game-version-badge">${game.version}</div>` : ''}
                
                <img src="${game.image}" alt="Capa do jogo ${game.title}" loading="lazy">
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
                ${game.review ? `<div class="game-review"><p class="review-comment">${game.review}</p></div>` : ''}
            </div>`;
        
        // Adiciona o card à grade e aplica uma animação de entrada com um pequeno atraso
        gameGrid.appendChild(cardElement);
        setTimeout(() => cardElement.classList.add('card-enter-animation'), index * 50);
    });
}

/**
 * Cria dinamicamente os botões de filtro de plataforma no catálogo.
 */
function renderFilterButtons() {
    const filterContainer = document.querySelector('#filter-container');
    if (!filterContainer) return;

    // Pega todas as plataformas únicas do banco de dados, sem repetição
    const platforms = ['all', ...new Set(gamesData.map(g => g.platform))];
    
    // Gera o HTML dos botões
    const buttonsHTML = platforms.map(p => `<button class="filter-btn" data-platform="${p}">${p === 'all' ? 'Todos' : p.toUpperCase()}</button>`).join('');
    
    // Adiciona os botões de filtro e os botões de ação ("Surpreenda", "Adicionar")
    filterContainer.innerHTML = buttonsHTML + `
        <button id="surprise-btn">Me Surpreenda!</button>
        <a href="adicionar.html" id="add-game-btn" class="cta-button">Adicionar Jogo</a>
    `;
}

/**
 * Calcula e exibe as estatísticas e o gráfico na página "Sobre".
 */
function renderStatistics() {
    const statsContainer = document.querySelector('#stats-container');
    const chartCanvas = document.getElementById('platform-chart');
    if (!statsContainer || !chartCanvas || gamesData.length === 0) return;

    // Calcula a contagem de jogos por plataforma
    const platformCounts = gamesData.reduce((acc, game) => {
        acc[game.platform.toUpperCase()] = (acc[game.platform.toUpperCase()] || 0) + 1;
        return acc;
    }, {});
    // Calcula a contagem de jogos por status
    const statusCounts = gamesData.reduce((acc, game) => {
        acc[game.statusText] = (acc[game.statusText] || 0) + 1;
        return acc;
    }, {});

    // Gera o HTML para as estatísticas de texto
    const platformsHTML = Object.entries(platformCounts).map(([p, c]) => `<a href="jogos.html?platform=${p.toLowerCase()}"><p>${p}: <span>${c}</span></p></a>`).join('');
    const statusHTML = Object.entries(statusCounts).map(([s, c]) => `<p>${s}: <span>${c}</span></p>`).join('');

    // Insere o HTML das estatísticas antes do contêiner do gráfico
    document.querySelector('#chart-container').insertAdjacentHTML('beforebegin', `
        <div class="stat-item"><h3>Jogos por Plataforma</h3>${platformsHTML}</div>
        <div class="stat-item"><h3>Jogos por Status</h3>${statusHTML}</div>
        <div class="stat-item"><h3>Estatísticas Gerais</h3><p>Total de Jogos Catalogados: <span>${gamesData.length}</span></p></div>
    `);

    // --- Configuração do Gráfico (usando a biblioteca Chart.js) ---
    new Chart(chartCanvas, {
        type: 'doughnut', // Tipo de gráfico: rosquinha
        data: {
            labels: Object.keys(platformCounts),
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
}


// ===================================================================================
// --- SEÇÃO: UTILITÁRIOS GLOBAIS ----------------------------------------------------
// ===================================================================================

/**
 * Configura o botão de alternância de tema (claro/escuro).
 * Salva a preferência do usuário no `localStorage` do navegador.
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Função para aplicar o tema com base no valor salvo
    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        body.classList.toggle('light-mode', isLight); // Adiciona/remove a classe 'light-mode'
        // Alterna a visibilidade dos ícones de sol e lua
        sunIcon.style.display = isLight ? 'none' : 'block';
        moonIcon.style.display = isLight ? 'block' : 'none';
    };

    // Aplica o tema salvo ou o tema escuro como padrão no primeiro carregamento
    applyTheme(localStorage.getItem('theme') || 'dark');

    // Adiciona o evento de clique para trocar o tema
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme); // Salva a nova preferência
        applyTheme(newTheme);
    });
}

/**
 * Configura o botão "Voltar ao Topo".
 * Ele aparece quando o usuário rola a página para baixo e some no topo.
 */
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    window.onscroll = () => {
        // Se a rolagem for maior que 100 pixels, mostra o botão
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };
    
    // Adiciona o evento de clique para rolar suavemente de volta ao topo
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}