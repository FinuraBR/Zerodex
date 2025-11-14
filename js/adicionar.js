// ===================================================================================
// === MEU ZERODEX - LÓGICA DA PÁGINA DE ADICIONAR JOGO (adicionar.js) ==============
// ===================================================================================
//
// DESCRIÇÃO:
// Este arquivo gerencia toda a interatividade da página 'adicionar.html'. Ele é
// responsável por buscar dados de jogos de APIs externas (RAWG e Steam),
// preencher o formulário de adição, gerenciar a galeria de capas, e gerar o
// objeto JavaScript final para ser inserido no banco de dados.
//
// ESTRUTURA:
// 1. Constantes e Variáveis de Estado
// 2. Seleção de Elementos do DOM
// 3. Ponto de Entrada e Inicialização
// 4. Funções de Busca (API)
// 5. Funções de Manipulação da UI
// 6. Funções da Galeria de Assets
// 7. Funções do Formulário
// 8. Funções Auxiliares e Componentes de UI
// 9. Configuração de Event Listeners
//
// ===================================================================================

// ===================================================================================
// --- 1. CONSTANTES E VARIÁVEIS DE ESTADO -------------------------------------------
// ===================================================================================

/** @const {string} URL do proxy da API no Cloudflare Worker. */
const CLOUDFLARE_WORKER_URL = 'https://zerodex-api-proxy.igorrabenschlag.workers.dev';

/** @type {Array<Object>} Armazena temporariamente os guias adicionados ao jogo. */
let tempGuides = [];
/** @type {number} ID que será usado para o próximo jogo a ser adicionado. */
let currentNextId;
/** @type {Object|null} Armazena os dados brutos da API da Steam para o jogo selecionado. */
let currentSteamData = null;

// ===================================================================================
// --- 2. SELEÇÃO DE ELEMENTOS DO DOM ------------------------------------------------
// ===================================================================================

const searchButton = document.getElementById('api-search-button');
const searchBar = document.getElementById('api-search-bar');
const steamSearchButton = document.getElementById('steam-search-button');
const steamSearchBar = document.getElementById('steam-search-bar');
const resultsContainer = document.getElementById('api-results-container');
const resultsGrid = document.querySelector('.results-grid');
const manualEntryButton = document.getElementById('manual-entry-button');
const formContainer = document.getElementById('add-form-container');
const gameEntryForm = document.getElementById('game-entry-form');
const formGameTitleInput = document.getElementById('form-game-title-input');
const translationSelect = document.getElementById('game-translation');
const fanTranslationGroup = document.getElementById('fan-translation-link-group');
const addGuideBtn = document.getElementById('add-guide-btn');
const guidesList = document.getElementById('guides-list');
const outputContainer = document.getElementById('output-container');
const outputCode = document.getElementById('output-code');
const copyCodeBtn = document.getElementById('copy-code-btn');
const platformSelect = document.getElementById('game-platform');
const statusSelect = document.getElementById('game-status');
const gameIdInput = document.getElementById('game-id');
const gameImagePreview = document.getElementById('form-game-image');
const gameImageUrlInput = document.getElementById('game-image-url');
const gameStoreUrlInput = document.getElementById('game-store-url-manual');
const gameReleaseDateElem = document.getElementById('form-game-release');
const gameReviewInput = document.getElementById('game-review');
const gameVersionSelect = document.getElementById('game-version');
const changeCoverBtn = document.getElementById('change-cover-btn');
const galleryOverlay = document.getElementById('gallery-overlay');
const assetGalleryModal = document.getElementById('asset-gallery-modal');
const closeGalleryBtn = document.getElementById('close-gallery-btn');
const assetGalleryContent = document.getElementById('asset-gallery-content');

// ===================================================================================
// --- 3. PONTO DE ENTRADA E INICIALIZAÇÃO -------------------------------------------
// ===================================================================================

/**
 * Ponto de entrada principal. Garante que o DOM esteja totalmente carregado
 * antes de executar qualquer script.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Componentes de UI que rodam em múltiplas páginas
    setupThemeToggle();
    setupBackToTopButton();

    // Lógica específica da página de adicionar
    if (!localStorage.getItem('gameToEdit')) {
        initializeNextId();
    }
    checkForEditMode();
    initializeEventListeners();
});

/**
 * Define o ID inicial para um novo jogo.
 * Compara o valor salvo no localStorage com um valor de fallback do arquivo
 * `id_counter.js` para garantir que o ID seja sempre o maior disponível.
 */
function initializeNextId() {
    const storedId = parseInt(localStorage.getItem('nextGameId'), 10);
    // `window.nextGameId` é definido em id_counter.js
    const fileId = window.nextGameId || 1;
    currentNextId = Math.max(storedId || 1, fileId);
    localStorage.setItem('nextGameId', currentNextId);
    gameIdInput.value = currentNextId;
}

// ===================================================================================
// --- 4. FUNÇÕES DE BUSCA (API) -----------------------------------------------------
// ===================================================================================

/**
 * Busca jogos na API RAWG com base em uma consulta de texto.
 * @param {string} query - O nome do jogo a ser pesquisado.
 */
async function searchGamesOnRawg(query) {
    if (!query) return;
    showLoadingMessage('Buscando na RAWG...');
    try {
        const response = await fetch(`${CLOUDFLARE_WORKER_URL}?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Falha na resposta da API RAWG.');

        const data = await response.json();
        displayRawgResults(data.results);
    } catch (error) {
        showErrorMessage("Ocorreu um erro ao buscar na RAWG.");
        console.error("Falha na busca RAWG:", error);
    }
}

/**
 * Busca um jogo diretamente na API da Steam usando seu AppID.
 * Após encontrar o jogo na Steam, busca o mesmo jogo na RAWG para obter
 * dados complementares, como a lista de plataformas.
 * @param {string} appId - O ID do aplicativo Steam a ser pesquisado.
 */
async function searchSteamDirectly(appId) {
    if (!appId || !/^\d+$/.test(appId)) {
        alert("Por favor, insira um AppID da Steam válido (apenas números).");
        return;
    }

    showLoadingMessage('Buscando na Steam...');
    try {
        const steamResponse = await fetch(`${CLOUDFLARE_WORKER_URL}?appid=${appId}`);
        if (!steamResponse.ok) throw new Error('Falha na chamada para a API da Steam.');

        const steamApiResponse = await steamResponse.json();
        const steamData = steamApiResponse?.[appId]?.data;

        if (steamData) {
            // Busca na RAWG para obter informações complementares (ex: plataformas)
            const rawgResponse = await fetch(`${CLOUDFLARE_WORKER_URL}?query=${encodeURIComponent(steamData.name)}`);
            const rawgData = await rawgResponse.json();
            // Tenta encontrar o jogo correspondente na RAWG pelo nome
            const matchingRawgGame = rawgData.results.find(g => g.name === steamData.name) || {};
            populateFormWithHybridData(matchingRawgGame, steamData);
        } else {
            throw new Error("AppID não encontrado ou resposta da API inválida.");
        }
    } catch (error) {
        showErrorMessage("AppID não encontrado ou erro na busca na Steam.");
        console.error("Falha na busca Steam direta:", error);
    }
}

/**
 * Processa a seleção de um jogo da lista de resultados da RAWG.
 * Primeiro, busca detalhes do jogo na RAWG para encontrar o AppID da Steam,
 * se disponível. Se encontrar, chama `searchSteamDirectly` para obter dados
 * mais ricos; caso contrário, usa apenas os dados da RAWG.
 * @param {string} slug - O slug do jogo na API RAWG.
 */
async function processRawgSelection(slug) {
    showLoadingMessage('Obtendo detalhes do jogo...');
    try {
        const rawgResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/${slug}`);
        if (!rawgResponse.ok) throw new Error('Falha ao buscar detalhes na RAWG.');

        const rawgData = await rawgResponse.json();

        // Tenta encontrar o AppID da Steam nos dados da RAWG
        const steamStore = rawgData.stores?.find(s => s.store.slug === 'steam');
        const steamAppIdMatch = steamStore?.url.match(/\/app\/(\d+)/);
        const steamAppId = steamAppIdMatch ? steamAppIdMatch[1] : null;

        if (steamAppId) {
            // Se encontrou um AppID, usa a busca da Steam para dados mais precisos
            await searchSteamDirectly(steamAppId);
        } else {
            // Se não, preenche o formulário apenas com dados da RAWG
            populateFormWithHybridData(rawgData, null);
        }
    } catch (error) {
        showErrorMessage("Erro ao processar a seleção do jogo.");
        console.error("Falha no processo de seleção:", error);
    }
}

// ===================================================================================
// --- 5. FUNÇÕES DE MANIPULAÇÃO DA UI -----------------------------------------------
// ===================================================================================

/**
 * Exibe uma mensagem de carregamento na área de resultados.
 * @param {string} message - A mensagem a ser exibida.
 */
function showLoadingMessage(message) {
    resultsContainer.style.display = 'block';
    formContainer.style.display = 'none';
    outputContainer.style.display = 'none';
    resultsGrid.innerHTML = `<p>${message}</p>`;
}

/**
 * Exibe uma mensagem de erro na área de resultados e o botão de entrada manual.
 * @param {string} message - A mensagem de erro a ser exibida.
 */
function showErrorMessage(message) {
    resultsContainer.style.display = 'block';
    resultsGrid.innerHTML = `<p class="no-results-message">${message}</p>`;
    manualEntryButton.style.display = 'block';
}

/**
 * Renderiza a lista de jogos encontrados pela busca da RAWG.
 * @param {Array<Object>} games - Uma lista de objetos de jogo da API RAWG.
 */
function displayRawgResults(games) {
    manualEntryButton.style.display = 'block';
    if (!games || games.length === 0) {
        resultsGrid.innerHTML = '<p class="no-results-message">Nenhum jogo encontrado.</p>';
        return;
    }
    resultsGrid.innerHTML = games.map(game => `
        <div class="api-result-item" data-slug="${game.slug}">
            <img src="${game.background_image || 'imagens/favicon.jpg'}" alt="Capa de ${game.name}" loading="lazy">
            <div>
                <h3>${game.name}</h3>
                <p>Lançamento: ${game.released ? new Date(game.released).toLocaleDateString('pt-BR') : 'Não informado'}</p>
            </div>
        </div>
    `).join('');
}

// ===================================================================================
// --- 6. FUNÇÕES DA GALERIA DE ASSETS -----------------------------------------------
// ===================================================================================

/**
 * Abre o modal da galeria de assets, buscando e exibindo todas as imagens
 * disponíveis para o jogo na API da Steam.
 */
function openAssetGallery() {
    if (!currentSteamData) return;
    const appId = currentSteamData.steam_appid;

    // Define os CDNs (Content Delivery Networks) da Steam para maior robustez
    const sharedCDN = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/`;
    const akamaiCDN = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/`;
    const communityCDN = `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/${appId}/`;
    const communityShared = `https://shared.fastly.steamstatic.com/community_assets/images/apps/${appId}/`;
    // Formatos a serem testados para cada imagem, pois a API não especifica a extensão
    const FORMATS_TO_TRY = ['jpg', 'png', 'ico'];

    // Estrutura de dados que organiza todos os assets conhecidos da Steam
    const masterAssetList = {
        'Assets da Biblioteca': [
            { name: 'library_600x900', cdns: [sharedCDN, akamaiCDN] },
            { name: 'library_600x900_2x', cdns: [sharedCDN, akamaiCDN] },
            { name: 'library_hero', cdns: [sharedCDN, akamaiCDN] },
            { name: 'library_hero_2x', cdns: [sharedCDN, akamaiCDN] },
            { name: 'logo', cdns: [sharedCDN, akamaiCDN] },
        ],
        'Assets da Loja': [
            { name: 'header', cdns: [sharedCDN, akamaiCDN] },
            { name: 'capsule_616x353', cdns: [sharedCDN, akamaiCDN] },
            { name: 'hero_capsule', cdns: [sharedCDN, akamaiCDN] },
        ],
        'Ícones': [
            { name: currentSteamData.clienticon, cdns: [communityCDN, communityShared] },
            { name: currentSteamData.community_icon, cdns: [communityCDN, communityShared] }
        ],
        'Fundos (API)': [
            { url: currentSteamData.background_raw }
        ],
        'Screenshots (API)': currentSteamData.screenshots?.map(ss => ({ url: ss.path_full, width: ss.width, height: ss.height })) || []
    };

    let galleryHTML = '';
    // Itera sobre cada categoria e seus assets para gerar o HTML
    for (const [category, assets] of Object.entries(masterAssetList)) {
        if (!assets || assets.length === 0) continue;

        const items = assets.map(asset => {
            if (!asset || (!asset.url && !asset.name)) return '';

            let pictureHTML;
            let finalUrl; // URL base para o data-attribute

            if (asset.url) {
                // Caso 1: A URL já está completa (ex: screenshots da API)
                finalUrl = asset.url;
                pictureHTML = `<img src="${finalUrl}" alt="${finalUrl.split('/').pop()}" loading="lazy" onerror="this.parentElement.style.display='none'">`;
            } else {
                // Caso 2: Precisa construir a URL com múltiplos CDNs e formatos
                const baseName = asset.name;
                const cdns = asset.cdns || [];
                
                // Usa a tag <picture> com <source> para tentar carregar a imagem de vários
                // CDNs e com vários formatos, oferecendo um fallback robusto.
                const sources = cdns.flatMap(cdn =>
                    FORMATS_TO_TRY.map(format =>
                        `<source srcset="${cdn}${baseName}.${format}" type="image/${format === 'jpg' ? 'jpeg' : format}">`
                    )
                ).join('');

                const fallbackSrc = `${cdns[0]}${baseName}.${FORMATS_TO_TRY[0]}`;
                finalUrl = fallbackSrc;

                pictureHTML = `
                    <picture>
                        ${sources}
                        <img src="${fallbackSrc}" alt="${baseName}" loading="lazy" onerror="this.parentElement.style.display='none'">
                    </picture>
                `;
            }

            const filename = finalUrl.split('/').pop().split('?')[0];
            const dimensions = (asset.width && asset.height) ? `${asset.width}x${asset.height}` : '';

            return `
                <figure class="asset-item" data-url="${finalUrl}">
                    ${pictureHTML}
                    <figcaption>
                        ${dimensions}
                        <span>${filename}</span>
                    </figcaption>
                </figure>
            `;
        }).join('');

        // Adiciona a categoria ao HTML final apenas se ela tiver itens válidos
        if (items.trim()) {
            galleryHTML += `<div class="asset-category"><h4>${category}</h4><div class="asset-grid">${items}</div></div>`;
        }
    }

    assetGalleryContent.innerHTML = galleryHTML || '<p>Nenhum asset adicional encontrado.</p>';
    galleryOverlay.classList.add('visible');
    assetGalleryModal.classList.add('visible');
}

/**
 * Fecha o modal da galeria de assets.
 */
function closeAssetGallery() {
    galleryOverlay.classList.remove('visible');
    assetGalleryModal.classList.remove('visible');
}

// ===================================================================================
// --- 7. FUNÇÕES DO FORMULÁRIO ------------------------------------------------------
// ===================================================================================

/**
 * Preenche o formulário com dados combinados das APIs RAWG e Steam.
 * @param {Object} rawgData - Dados da API RAWG.
 * @param {Object} [steamData=null] - Dados da API Steam (opcional).
 */
function populateFormWithHybridData(rawgData, steamData = null) {
    gameEntryForm.reset();
    tempGuides = [];
    updateGuidesList();
    fanTranslationGroup.style.display = 'none';
    currentSteamData = steamData;
    gameIdInput.value = currentNextId;

    // Preenche os campos com dados da Steam como prioridade, usando RAWG como fallback
    formGameTitleInput.value = steamData?.name || rawgData.name || '';
    gameStoreUrlInput.value = steamData ? `https://store.steampowered.com/app/${steamData.steam_appid}/` : '';
    const releaseDate = steamData?.release_date?.date || rawgData.released;
    gameReleaseDateElem.textContent = `Lançamento: ${releaseDate ? new Date(releaseDate).toLocaleDateString('pt-BR') : 'Não informado'}`;

    populatePlatformSelect(rawgData.platforms || []);

    // Define a capa padrão (biblioteca da Steam) ou a imagem de fundo da RAWG
    const defaultCover = steamData
        ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${steamData.steam_appid}/library_600x900.jpg`
        : rawgData.background_image || 'imagens/favicon.jpg';

    gameImagePreview.src = defaultCover;
    gameImageUrlInput.value = defaultCover;

    // Mostra o botão "Trocar Capa" apenas se houver dados da Steam
    changeCoverBtn.style.display = steamData ? 'block' : 'none';

    // Preenche as opções de status e exibe o formulário
    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandoned">Abandonado</option>`;
    resultsContainer.style.display = 'none';
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Lida com o evento de submissão do formulário, cria o objeto do jogo e o
 * exibe na área de saída.
 * @param {Event} event - O objeto do evento de submissão.
 */
function handleFormSubmit(event) {
    event.preventDefault(); // Previne o recarregamento da página

    // Lógica para o valor da tradução, incluindo o link para traduções de fãs
    let translationValue;
    if (translationSelect.value === 'fan') {
        const link = document.getElementById('fan-translation-link').value;
        translationValue = link ? `Feita por Fã (<a href="${link}" target="_blank" rel="noopener noreferrer">baixar</a>)` : "Feita por Fã";
    } else {
        translationValue = translationSelect.value;
    }

    // Mapeia os valores do status para os textos correspondentes
    const statusMap = {
        'playing': { text: 'Jogando', overlay: 'Jogando Atualmente' },
        'completed': { text: 'Finalizado', overlay: 'Finalizado' },
        'completed-100': { text: '100%', overlay: '100% Concluído' },
        'retired': { text: 'Aposentado', overlay: 'Aposentado' },
        'archived': { text: 'Arquivado', overlay: 'Arquivado' },
        'abandoned': { text: 'Abandonado', overlay: 'Abandonado' }
    };
    const statusValue = statusSelect.value;

    // Cria o objeto final do jogo com todos os dados do formulário
    const newGame = {
        id: parseInt(gameIdInput.value, 10),
        title: formGameTitleInput.value,
        image: gameImageUrlInput.value || "imagens/favicon.jpg",
        platform: Array.from(platformSelect.selectedOptions).map(option => option.value),
        status: statusValue,
        statusText: statusMap[statusValue].text,
        statusOverlay: statusMap[statusValue].overlay,
        translation: translationValue,
        guide: tempGuides,
        review: gameReviewInput.value || null,
        version: gameVersionSelect.value || null,
        storeUrl: gameStoreUrlInput.value || null,
    };

    // Formata o objeto como uma string JSON para ser colada no arquivo database.js
    const baseJsonString = JSON.stringify(newGame, null, 4);
    const indentedJsonString = baseJsonString.split('\n').map((line, index) => index === 0 ? line : `    ${line}`).join('\n');
    const finalCodeString = `${indentedJsonString},`;

    // Exibe o código na tela e o copia para a área de transferência
    outputCode.value = finalCodeString;
    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({ behavior: 'smooth' });
    copyCodeToClipboard(finalCodeString, copyCodeBtn, 'Copiado Automaticamente!');

    // Se não estiver em modo de edição, incrementa e salva o próximo ID
    if (document.querySelector('#game-entry-form button[type="submit"]').textContent.includes('Salvar no Zerodex')) {
        currentNextId = newGame.id + 1;
        localStorage.setItem('nextGameId', currentNextId);
    }
}

/**
 * Verifica se há um jogo para editar no localStorage (vindo da página do catálogo)
 * e, se houver, preenche o formulário com seus dados.
 */
function checkForEditMode() {
    const gameToEditData = localStorage.getItem('gameToEdit');
    if (gameToEditData) {
        const gameToEdit = JSON.parse(gameToEditData);
        // Altera a UI para o modo de edição
        document.title = `Editando: ${gameToEdit.title}`;
        document.querySelector('#add-game-section h2').textContent = 'Editar Jogo';
        document.querySelector('#game-entry-form button[type="submit"]').textContent = 'Salvar Alterações';
        document.querySelector('#output-container h3').textContent = 'Código Atualizado para database.js';

        fillFormWithExistingData(gameToEdit);
        localStorage.removeItem('gameToEdit'); // Limpa o item para não reabrir em modo de edição
    }
}

/**
 * Preenche o formulário com os dados de um jogo existente para edição.
 * @param {Object} game - O objeto do jogo a ser editado.
 */
function fillFormWithExistingData(game) {
    // Oculta as seções de busca, pois não são necessárias para edição
    document.getElementById('search-container').style.display = 'none';
    document.querySelector('.separator').style.display = 'none';
    document.getElementById('steam-search-container').style.display = 'none';

    gameEntryForm.reset();
    tempGuides = game.guide || [];
    updateGuidesList();

    // Preenche todos os campos do formulário com os dados do objeto `game`
    gameIdInput.value = game.id;
    formGameTitleInput.value = game.title;
    gameImagePreview.src = game.image;
    gameImageUrlInput.value = game.image;
    gameStoreUrlInput.value = game.storeUrl || '';
    populatePlatformSelect(); // Popula as opções antes de selecionar
    game.platform.forEach(slug => {
        const option = platformSelect.querySelector(`option[value="${slug}"]`);
        if (option) option.selected = true;
    });
    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandoned">Abandonado</option>`;
    statusSelect.value = game.status;

    // Lida com o campo de tradução, extraindo o link se for de fã
    if (game.translation.includes("Feita por Fã")) {
        translationSelect.value = 'fan';
        fanTranslationGroup.style.display = 'flex';
        const linkMatch = game.translation.match(/href="([^"]+)"/);
        if (linkMatch && linkMatch[1]) {
            document.getElementById('fan-translation-link').value = linkMatch[1];
        }
    } else {
        translationSelect.value = game.translation;
    }

    gameVersionSelect.value = game.version || '';
    gameReviewInput.value = game.review || '';
    formContainer.style.display = 'block';
}

// ===================================================================================
// --- 8. FUNÇÕES AUXILIARES E COMPONENTES DE UI -------------------------------------
// ===================================================================================

/** Atualiza a lista de guias exibida no formulário. */
function updateGuidesList() {
    guidesList.innerHTML = tempGuides.map(g => `<div class="guide-item"><span>${g.title} - <a href="${g.url}" target="_blank" rel="noopener noreferrer">Link</a></span></div>`).join('');
}

/**
 * Copia um texto para a área de transferência e fornece feedback visual no botão.
 * @param {string} textToCopy - O texto a ser copiado.
 * @param {HTMLElement} buttonElement - O botão que acionou a cópia.
 * @param {string} [successMessage='Copiado!'] - A mensagem a ser exibida no botão após o sucesso.
 */
function copyCodeToClipboard(textToCopy, buttonElement, successMessage = 'Copiado!') {
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = successMessage;
        setTimeout(() => { buttonElement.textContent = originalText; }, 2500);
    }).catch(err => console.error('Falha ao copiar o código: ', err));
}

/**
 * Preenche o <select> de plataformas com as opções de `database.js` e pré-seleciona
 * aquelas que correspondem às plataformas do jogo.
 * @param {Array<Object>} [gamePlatforms=[]] - A lista de plataformas do jogo buscado.
 */
function populatePlatformSelect(gamePlatforms = []) {
    platformSelect.innerHTML = '';
    const knownPlatforms = Object.entries(PLATFORM_DISPLAY_NAMES);
    const gamePlatformSlugs = new Set(gamePlatforms.map(p => p.platform.slug));

    knownPlatforms.forEach(([slug, name]) => {
        const option = document.createElement('option');
        option.value = slug;
        option.textContent = name;
        if (gamePlatformSlugs.has(slug)) {
            option.selected = true;
        }
        platformSelect.appendChild(option);
    });
}

/** Configura o botão de alternância de tema (claro/escuro). */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    if (!themeToggle) return;

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        body.classList.toggle('light-mode', isLight);
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isLight ? 'none' : 'block';
            moonIcon.style.display = isLight ? 'block' : 'none';
        }
    };
    applyTheme(localStorage.getItem('theme') || 'dark');
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

/** Configura o botão "Voltar ao Topo". */
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    window.onscroll = () => {
        backToTopButton.style.display = (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) ? "block" : "none";
    };
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================================================================================
// --- 9. CONFIGURAÇÃO DE EVENT LISTENERS --------------------------------------------
// ===================================================================================

/**
 * Centraliza a configuração de todos os "ouvintes de eventos" da página.
 */
function initializeEventListeners() {
    // Eventos de busca
    searchButton.addEventListener('click', () => searchGamesOnRawg(searchBar.value));
    searchBar.addEventListener('keyup', e => { if (e.key === 'Enter') searchGamesOnRawg(searchBar.value); });

    steamSearchButton.addEventListener('click', () => searchSteamDirectly(steamSearchBar.value));
    steamSearchBar.addEventListener('keyup', e => { if (e.key === 'Enter') searchSteamDirectly(steamSearchBar.value); });

    // Eventos da lista de resultados e entrada manual
    resultsContainer.addEventListener('click', e => {
        const resultItem = e.target.closest('.api-result-item');
        if (resultItem?.dataset.slug) {
            processRawgSelection(resultItem.dataset.slug);
        }
    });

    manualEntryButton.addEventListener('click', () => {
        resultsContainer.style.display = 'none';
        populateFormWithHybridData({}); // Popula um formulário vazio
    });

    // Eventos da galeria de assets
    changeCoverBtn.addEventListener('click', openAssetGallery);
    closeGalleryBtn.addEventListener('click', closeAssetGallery);
    galleryOverlay.addEventListener('click', closeAssetGallery);

    assetGalleryContent.addEventListener('click', e => {
        const selectedAsset = e.target.closest('.asset-item');
        if (selectedAsset) {
            const newImageUrl = selectedAsset.dataset.url;
            gameImagePreview.src = newImageUrl;
            gameImageUrlInput.value = newImageUrl;
            closeAssetGallery();
        }
    });

    // Eventos do formulário
    translationSelect.addEventListener('change', () => {
        fanTranslationGroup.style.display = translationSelect.value === 'fan' ? 'flex' : 'none';
    });

    addGuideBtn.addEventListener('click', () => {
        const titleInput = document.getElementById('guide-title');
        const urlInput = document.getElementById('guide-url');
        if (titleInput.value.trim() && urlInput.value.trim()) {
            tempGuides.push({ title: titleInput.value.trim(), url: urlInput.value.trim() });
            updateGuidesList();
            titleInput.value = '';
            urlInput.value = '';
        }
    });

    gameEntryForm.addEventListener('submit', handleFormSubmit);
    copyCodeBtn.addEventListener('click', () => copyCodeToClipboard(outputCode.value, copyCodeBtn, 'Copiado!'));
}