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
        renderFilterButtons();       // Desenha os botões de filtro (PC, Switch, etc.).
        readURLAndSetupControls();   // Lê filtros da URL (ex: ?platform=pc) e prepara os controles.
        updateDisplay();             // Exibe os jogos na tela, aplicando os filtros lidos.
    }
    
    // Se encontrar '#dynamic-stats', estamos na página "Sobre" (sobre.html).
    if (document.querySelector('#dynamic-stats')) {
        renderStatistics();          // Calcula e exibe as estatísticas e o gráfico.
    }

    // Se encontrar '.homepage-shelf', estamos na página inicial (index.html).
    if (document.querySelector('.homepage-shelf')) {
        setupHomepageShelves();      // Preenche as "estantes" de jogos (Jogando, Finalizados, etc.).
        setupStickyShelfNav();       // Ativa o menu de navegação que fica fixo ao rolar a página.
    }

    // Se QUALQUER página tiver uma grade de jogos (uma '.game-grid'), ativa a lógica do tooltip.
    // Isso torna a função do tooltip universal para a página inicial e o catálogo.
    if (document.querySelector('.game-grid')) {
        setupTooltipLogic();
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


// ===================================================================================
// --- SEÇÃO: LÓGICA DO CATÁLOGO (JOGOS.HTML) ----------------------------------------
// ===================================================================================

/**
 * Função central que atualiza a exibição dos jogos no catálogo.
 * Ela segue um processo de 3 passos: Filtrar -> Ordenar -> Renderizar.
 */
function updateDisplay() {
    // 1. FILTRAGEM: Começa com uma cópia da lista completa de jogos.
    let filteredGames = [...gamesData]; 

    // Filtra por termo de busca (se houver algum).
    if (currentSearchTerm) {
        // Mantém apenas os jogos cujo título (em minúsculas) inclui o termo de busca.
        filteredGames = filteredGames.filter(g => g.title.toLowerCase().includes(currentSearchTerm));
    }
    // Filtra por plataforma (se não for 'all').
    if (currentPlatform !== 'all') {
        filteredGames = filteredGames.filter(g => g.platform === currentPlatform);
    }
    
    // 2. ORDENAÇÃO: Organiza a lista filtrada com base na seleção do usuário.
    switch (currentSort) {
        case 'title-asc': // Ordem alfabética A-Z
            filteredGames.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc': // Ordem alfabética Z-A
            filteredGames.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'id-desc': // Padrão: Mais recentes primeiro
        default:
            filteredGames.sort((a, b) => b.id - a.id);
            break;
    }
    
    // 3. RENDERIZAÇÃO: Desenha os jogos filtrados e ordenados na tela.
    renderGames(filteredGames, '#catalogo .game-grid');
    // Atualiza a URL do navegador para refletir os filtros atuais (bom para compartilhar links).
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
 * É aqui que a interatividade do usuário é capturada.
 */
function setupControls() {
    // Barra de pesquisa: aciona a atualização a cada tecla pressionada ('keyup').
    document.getElementById('search-bar').addEventListener('keyup', e => {
        currentSearchTerm = e.target.value.toLowerCase();
        updateDisplay(); // Re-filtra e re-renderiza os jogos.
    });
    
    // Menu de ordenação: aciona a atualização quando uma nova opção é selecionada ('change').
    document.getElementById('sort-options').addEventListener('change', e => {
        currentSort = e.target.value;
        updateDisplay();
    });

    // Botões de filtro de plataforma: usa um loop para configurar todos.
    document.querySelectorAll('#filter-container .filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Pega a plataforma do atributo 'data-platform' do botão clicado.
            currentPlatform = button.dataset.platform;
            
            // Atualiza o estilo visual: remove 'active' de todos e adiciona apenas no clicado.
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            updateDisplay();
        });
    });

    // Botão "Me Surpreenda!": sorteia um jogo visível e rola a tela até ele.
    document.getElementById('surprise-btn').addEventListener('click', () => {
        const visibleCards = document.querySelectorAll('#catalogo .game-card:not(.hidden)');
        if (visibleCards.length === 0) return; // Não faz nada se não houver jogos visíveis.

        // Remove o destaque de um jogo sorteado anteriormente.
        const currentHighlight = document.querySelector('.highlight');
        if (currentHighlight) {
            currentHighlight.classList.remove('highlight');
        }

        // Escolhe um índice aleatório da lista de cards visíveis.
        const randomIndex = Math.floor(Math.random() * visibleCards.length);
        const randomCard = visibleCards[randomIndex];

        // Rola a página suavemente até o card sorteado.
        randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Adiciona uma classe de destaque visual.
        randomCard.classList.add('highlight');
        // Remove a classe de destaque após 2 segundos.
        setTimeout(() => {
            randomCard.classList.remove('highlight');
        }, 2000);
    });

     // Botão "Editar Jogo": usa delegação de eventos para funcionar.
     // O "ouvinte" é colocado na grade de jogos, e não em cada botão individualmente (melhor para performance).
    document.querySelector('#catalogo .game-grid').addEventListener('click', (event) => {
        // Verifica se o elemento que originou o clique tem a classe 'edit-btn'.
        if (event.target.classList.contains('edit-btn')) {
            const gameId = parseInt(event.target.dataset.editId);
            const gameToEdit = gamesData.find(game => game.id === gameId);

            if (gameToEdit) {
                // Guarda os dados do jogo no 'localStorage' do navegador.
                // O localStorage permite que dados persistam mesmo ao mudar de página.
                localStorage.setItem('gameToEdit', JSON.stringify(gameToEdit));
                
                // Redireciona o usuário para a página de edição.
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
 * @param {Array} gamesArray - A lista de jogos a ser exibida.
 * @param {string} gridSelector - O seletor CSS da grade onde os jogos serão inseridos.
 */
function renderGames(gamesArray, gridSelector) {
    const gameGrid = document.querySelector(gridSelector);
    if (!gameGrid) return; // Se a grade não for encontrada, interrompe a função.

    // Limpa a grade. Se o array de jogos estiver vazio, exibe uma mensagem.
    gameGrid.innerHTML = gamesArray.length === 0 ? '<p class="no-results-message">Nenhum jogo encontrado.</p>' : '';

    // Itera sobre cada jogo do array para criar seu card.
    gamesArray.forEach((game, index) => {
        // Prepara o HTML dos links de guias.
        const guideLinks = game.guide.map(g => `<a href="${g.url}" target="_blank">${g.title}</a>`).join(' | ');
        const guideHTML = game.guide.length > 0 ? `<p><strong>Guia:</strong> ${guideLinks}</p>` : '<p><strong>Guia:</strong> Não utilizado</p>';
        
        // Prepara o HTML da plataforma, adicionando um link para a loja se existir.
        const platformText = game.platform.toUpperCase();
        const platformHTML = game.storeUrl 
            ? `<a href="${game.storeUrl}" target="_blank">${platformText}</a>`
            : platformText;

        // Cria o elemento 'div' para o card.
        const cardElement = document.createElement('div');
        cardElement.className = 'game-card';
        cardElement.dataset.platform = game.platform; // Atributo usado para filtros.

        // Define o HTML interno do card usando template literals para facilitar a leitura.
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
                ${game.review ? `<div class="game-review"><button class="review-trigger secondary-btn">Ver Comentário</button></div>` : ''}
            </div>`;
        
        // Adiciona o card recém-criado à grade.
        gameGrid.appendChild(cardElement);
        // Aplica uma animação de entrada com um pequeno atraso (index * 50ms) para criar um efeito cascata.
        setTimeout(() => cardElement.classList.add('card-enter-animation'), index * 50);
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
    const buttonsHTML = platforms.map(p => 
        `<button class="filter-btn" data-platform="${p}">${p === 'all' ? 'Todos' : p.toUpperCase()}</button>`
    ).join('');
    
    // Adiciona os botões de filtro e também os botões de ação ("Surpreenda", "Adicionar").
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

    // Usa `reduce` para contar quantos jogos existem por plataforma.
    const platformCounts = gamesData.reduce((acc, game) => {
        acc[game.platform.toUpperCase()] = (acc[game.platform.toUpperCase()] || 0) + 1;
        return acc;
    }, {});
    
    // Usa `reduce` para contar quantos jogos existem por status.
    const statusCounts = gamesData.reduce((acc, game) => {
        acc[game.statusText] = (acc[game.statusText] || 0) + 1;
        return acc;
    }, {});

    // Gera o HTML para as estatísticas de texto a partir dos dados contados.
    const platformsHTML = Object.entries(platformCounts).map(([p, c]) => `<a href="jogos.html?platform=${p.toLowerCase()}"><p>${p}: <span>${c}</span></p></a>`).join('');
    const statusHTML = Object.entries(statusCounts).map(([s, c]) => `<p>${s}: <span>${c}</span></p>`).join('');

    // Insere o HTML gerado na página, antes do contêiner do gráfico.
    document.querySelector('#chart-container').insertAdjacentHTML('beforebegin', `
        <div class="stat-item"><h3>Jogos por Plataforma</h3>${platformsHTML}</div>
        <div class="stat-item"><h3>Jogos por Status</h3>${statusHTML}</div>
        <div class="stat-item"><h3>Estatísticas Gerais</h3><p>Total de Jogos Catalogados: <span>${gamesData.length}</span></p></div>
    `);

    // --- Configuração do Gráfico (usando a biblioteca Chart.js) ---
    new Chart(chartCanvas, {
        type: 'doughnut', // Tipo de gráfico: rosca.
        data: {
            labels: Object.keys(platformCounts), // Nomes das plataformas.
            datasets: [{
                label: 'Jogos por Plataforma',
                data: Object.values(platformCounts), // Quantidade de jogos.
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
                    position: 'top', // Posição da legenda.
                    // Pega a cor do texto do CSS para que a legenda se adapte ao tema claro/escuro.
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