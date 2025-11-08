// --- Lógica Principal ---
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupBackToTopButton();

    if (document.querySelector('#catalogo')) {
        renderFilterButtons();
        readURLAndSetupControls();
        updateDisplay();
    }
    if (document.querySelector('#dynamic-stats')) {
        renderStatistics();
    }
// Dentro do document.addEventListener('DOMContentLoaded', ...)

// Dentro do document.addEventListener('DOMContentLoaded', ...)

if (document.querySelector('.homepage-shelf')) {
    // Configuração das prateleiras da página inicial
    const homepageShelves = [
        { selector: '#currently-playing', status: 'playing' },
        { selector: '#archived-games', status: 'archived' },
        { selector: '#completed-100-games', status: 'completed-100' },
        { selector: '#finished-games', status: 'completed' },
        { selector: '#retired-games', status: 'retired' },
        { selector: '#abandoned-games', status: 'abandoned' },
    ];

    // Passa por cada configuração de prateleira
    homepageShelves.forEach(shelf => {
        const sectionElement = document.querySelector(shelf.selector);
        // A MUDANÇA ESTÁ AQUI: Encontramos o link correspondente na barra de navegação
        const navLink = document.querySelector(`#shelf-nav a[href="${shelf.selector}"]`);

        // Se a seção ou o link não existirem, pula para a próxima
        if (!sectionElement || !navLink) return;

        // Filtra os jogos que pertencem a esta prateleira
        const gamesForShelf = gamesData.filter(game => game.status === shelf.status);

        // Se encontrou jogos, renderiza e garante que o link está visível.
        if (gamesForShelf.length > 0) {
            navLink.style.display = ''; // Garante que o link apareça
            const gridSelector = `${shelf.selector} .game-grid`;
            renderGames(gamesForShelf, gridSelector);
        } else {
            // Se não encontrou jogos, esconde a seção E o link correspondente.
            sectionElement.style.display = 'none';
            navLink.style.display = 'none';
        }
    });
}

// Adicione esta nova verificação:
if (document.querySelector('#shelf-nav')) {
    const shelfNav = document.getElementById('shelf-nav');
    const heroSection = document.getElementById('hero');

    const checkScroll = () => {
        // Pega a posição onde a seção "hero" termina
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

        // Se o usuário rolou para além do final da seção hero, mostra o menu
        if (window.scrollY > heroBottom) {
            shelfNav.classList.add('shelf-nav-visible');
            shelfNav.classList.remove('shelf-nav-hidden');
        } else {
            shelfNav.classList.remove('shelf-nav-visible');
            shelfNav.classList.add('shelf-nav-hidden');
        }
    };

    // "Escuta" o evento de rolagem da página
    window.addEventListener('scroll', checkScroll);

    // A MUDANÇA ESTÁ AQUI: Executa a verificação uma vez no carregamento da página
    checkScroll();
}
});

let currentSearchTerm = '', currentPlatform = 'all', currentSort = 'id-desc';

function updateDisplay() {
    let filteredGames = [...gamesData];
    if (currentSearchTerm) filteredGames = filteredGames.filter(g => g.title.toLowerCase().includes(currentSearchTerm));
    if (currentPlatform !== 'all') filteredGames = filteredGames.filter(g => g.platform === currentPlatform);
    
    switch (currentSort) {
        case 'title-asc': filteredGames.sort((a, b) => a.title.localeCompare(b.title)); break;
        case 'title-desc': filteredGames.sort((a, b) => b.title.localeCompare(a.title)); break;
        case 'id-desc': filteredGames.sort((a, b) => b.id - a.id); break;
    }
    renderGames(filteredGames, '#catalogo .game-grid');
    updateURL();
}

// --- Função para Renderizar os Cards de Jogo ---
function renderGames(gamesArray, gridSelector) {
    const gameGrid = document.querySelector(gridSelector);
    if (!gameGrid) return;
    gameGrid.innerHTML = gamesArray.length === 0 ? '<p class="no-results-message">Nenhum jogo encontrado.</p>' : '';

    gamesArray.forEach((game, index) => {
        // --- Lógica dos guias ---
        const guideLinks = game.guide.map(g => `<a href="${g.url}" target="_blank">${g.title}</a>`).join(' | ');
        const guideHTML = game.guide.length > 0 ? `<p><strong>Guia:</strong> ${guideLinks}</p>` : '<p><strong>Guia:</strong> Não utilizado</p>';
        const platformText = game.platform.toUpperCase();
        const platformHTML = game.storeUrl 
            ? `<a href="${game.storeUrl}" target="_blank">${platformText}</a>`
            : platformText;

        const cardElement = document.createElement('div');
        cardElement.className = 'game-card';
        cardElement.dataset.platform = game.platform;

        cardElement.innerHTML = `
            <!-- A MUDANÇA ESTÁ AQUI: Os badges agora estão FORA e ANTES do container da imagem -->
            <div class="game-number">${game.id}</div>
            ${game.version ? `<div class="game-version-badge">${game.version}</div>` : ''}

            <div class="card-image-container">
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
                </div>
                ${game.review ? `<div class="game-review"><p class="review-comment">${game.review}</p></div>` : ''}
            </div>`;
        
        gameGrid.appendChild(cardElement);
        setTimeout(() => cardElement.classList.add('card-enter-animation'), index * 50);
    });
}

function renderFilterButtons() {
    const filterContainer = document.querySelector('#filter-container');
    if (!filterContainer) return;
    const platforms = ['all', ...new Set(gamesData.map(g => g.platform))];
    const buttonsHTML = platforms.map(p => `<button class="filter-btn" data-platform="${p}">${p === 'all' ? 'Todos' : p.toUpperCase()}</button>`).join('');
    // A tag <a> é melhor que <button> aqui, pois ela navega para outra página
filterContainer.innerHTML = buttonsHTML + `
    <button id="surprise-btn">Me Surpreenda!</button>
    <a href="adicionar.html" id="add-game-btn" class="cta-button">Adicionar Jogo</a>
`;
}

function renderStatistics() {
    const statsContainer = document.querySelector('#stats-container');
    const chartCanvas = document.getElementById('platform-chart');
    if (!statsContainer || !chartCanvas || gamesData.length === 0) return;

    // --- Cálculos ---
    const platformCounts = gamesData.reduce((acc, game) => {
        acc[game.platform.toUpperCase()] = (acc[game.platform.toUpperCase()] || 0) + 1;
        return acc;
    }, {});
    const statusCounts = gamesData.reduce((acc, game) => {
        acc[game.statusText] = (acc[game.statusText] || 0) + 1;
        return acc;
    }, {});

    // --- Geração do HTML ---
    const platformsHTML = Object.entries(platformCounts).map(([p, c]) => `<a href="jogos.html?platform=${p.toLowerCase()}"><p>${p}: <span>${c}</span></p></a>`).join('');
    const statusHTML = Object.entries(statusCounts).map(([s, c]) => `<p>${s}: <span>${c}</span></p>`).join('');

    document.querySelector('#chart-container').insertAdjacentHTML('beforebegin', `
        <div class="stat-item"><h3>Jogos por Plataforma</h3>${platformsHTML}</div>
        <div class="stat-item"><h3>Jogos por Status</h3>${statusHTML}</div>
        <div class="stat-item"><h3>Estatísticas Gerais</h3><p>Total de Jogos Catalogados: <span>${gamesData.length}</span></p></div>
    `);

    // --- Configuração do gráfico ---
    new Chart(chartCanvas, {
        type: 'doughnut', // Gráfico rosquinha
        data: {
            labels: Object.keys(platformCounts),
            datasets: [{
                label: 'Jogos por Plataforma',
                data: Object.values(platformCounts),
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',   // Verde
                    'rgba(3, 169, 244, 0.8)',   // Azul
                    'rgba(249, 168, 37, 0.8)',  // Amarelo
                    'rgba(96, 125, 139, 0.8)',  // Cinza-Azulado
                    'rgba(255, 152, 0, 0.8)',  // Laranja
                    'rgba(244, 67, 54, 0.8)'   // Vermelho
                ],
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
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--color-text-primary')
                    }
                }
            }
        }
    });
}

function readURLAndSetupControls() {
    const params = new URLSearchParams(window.location.search);
    currentPlatform = params.get('platform') || 'all';
    currentSearchTerm = params.get('search') || '';
    currentSort = params.get('sort') || 'id-desc';
    
    document.getElementById('search-bar').value = currentSearchTerm;
    document.getElementById('sort-options').value = currentSort;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.platform === currentPlatform));
    
    setupControls();
}

function updateURL() {
    const params = new URLSearchParams();
    if (currentPlatform !== 'all') params.set('platform', currentPlatform);
    if (currentSearchTerm) params.set('search', currentSearchTerm);
    if (currentSort !== 'id-desc') params.set('sort', currentSort);
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    history.pushState({}, '', newUrl);
}

function setupControls() {
    document.getElementById('search-bar').addEventListener('keyup', e => { currentSearchTerm = e.target.value.toLowerCase(); updateDisplay(); });
    document.getElementById('sort-options').addEventListener('change', e => { currentSort = e.target.value; updateDisplay(); });
    document.querySelectorAll('#filter-container .filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentPlatform = button.dataset.platform;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateDisplay();
        });
    });
    // --- Lógica do Botão "Me Surpreenda!" ---
    document.getElementById('surprise-btn').addEventListener('click', () => {
        const visibleCards = document.querySelectorAll('#catalogo .game-card:not(.hidden)');

        if (visibleCards.length === 0) {
            return;
        }

        const currentHighlight = document.querySelector('.highlight');
        if (currentHighlight) {
            currentHighlight.classList.remove('highlight');
        }

        const randomIndex = Math.floor(Math.random() * visibleCards.length);
        const randomCard = visibleCards[randomIndex];

        randomCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        randomCard.classList.add('highlight');

        setTimeout(() => {
            randomCard.classList.remove('highlight');
        }, 2000);
    });
}

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

function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    window.onscroll = () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}