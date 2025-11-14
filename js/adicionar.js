// ===================================================================================
// === MEU ZERODEX - LÓGICA DA PÁGINA DE ADICIONAR JOGO (adicionar.js) [FINAL] ======
// ===================================================================================
// DESCRIÇÃO: Usa a API pública da Steam e uma lista mestra de assets com fallback
//            entre múltiplos CDNs e múltiplos formatos de imagem.
// ===================================================================================

const CLOUDFLARE_WORKER_URL = 'https://zerodex-api-proxy.igorrabenschlag.workers.dev';

let tempGuides = [];
let currentNextId;
let currentSteamData = null;

// --- Seleção de Elementos do DOM ---
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

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupBackToTopButton();
    if (!localStorage.getItem('gameToEdit')) {
        initializeId();
    }
    checkForEditMode();
    initializeEventListeners();
});

function initializeId() {
    const storedId = parseInt(localStorage.getItem('nextGameId'));
    const fileId = window.nextGameId || 1;
    currentNextId = Math.max(storedId || 1, fileId);
    localStorage.setItem('nextGameId', currentNextId);
    gameIdInput.value = currentNextId;
}

// --- Funções de Busca ---

async function searchGamesOnRawg(query) {
    if (!query) return;
    showLoadingMessage('Buscando na RAWG...');
    try {
        const response = await fetch(`${CLOUDFLARE_WORKER_URL}?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Falha ao buscar na RAWG.');
        const data = await response.json();
        displayRawgResults(data.results);
    } catch (error) {
        showErrorMessage("Ocorreu um erro ao buscar na RAWG.");
        console.error("Falha na busca RAWG:", error);
    }
}

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
            const rawgResponse = await fetch(`${CLOUDFLARE_WORKER_URL}?query=${encodeURIComponent(steamData.name)}`);
            const rawgData = await rawgResponse.json();
            const matchingRawgGame = rawgData.results.find(g => g.name === steamData.name) || {};
            populateFormWithHybridData(matchingRawgGame, steamData);
        } else {
            throw new Error("AppID não encontrado ou resposta inválida.");
        }
    } catch (error) {
        showErrorMessage("AppID não encontrado ou erro na busca na Steam.");
        console.error("Falha na busca Steam direta:", error);
    }
}

async function processRawgSelection(slug) {
    showLoadingMessage('Buscando informações...');
    try {
        const rawgResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/${slug}`);
        if (!rawgResponse.ok) throw new Error('Falha ao buscar detalhes na RAWG.');
        const rawgData = await rawgResponse.json();

        const steamStore = rawgData.stores?.find(s => s.store.slug === 'steam');
        const steamAppIdMatch = steamStore?.url.match(/\/app\/(\d+)/);
        const steamAppId = steamAppIdMatch ? steamAppIdMatch[1] : null;

        if (steamAppId) {
            await searchSteamDirectly(steamAppId);
        } else {
            populateFormWithHybridData(rawgData, null);
        }
    } catch (error) {
        showErrorMessage("Erro ao processar a seleção do jogo.");
        console.error("Falha no processo de seleção:", error);
    }
}

// --- Funções de UI e Formulário ---

function showLoadingMessage(message) {
    resultsContainer.style.display = 'block';
    formContainer.style.display = 'none';
    outputContainer.style.display = 'none';
    resultsGrid.innerHTML = `<p>${message}</p>`;
}

function showErrorMessage(message) {
    resultsContainer.style.display = 'block';
    resultsGrid.innerHTML = `<p class="no-results-message">${message}</p>`;
    manualEntryButton.style.display = 'block';
}

function displayRawgResults(games) {
    manualEntryButton.style.display = 'block';
    if (!games || games.length === 0) {
        resultsGrid.innerHTML = '<p class="no-results-message">Nenhum jogo encontrado.</p>';
        return;
    }
    resultsGrid.innerHTML = games.map(game => `
        <div class="api-result-item" data-slug="${game.slug}">
            <img src="${game.background_image || 'imagens/favicon.jpg'}" alt="${game.name}">
            <div>
                <h3>${game.name}</h3>
                <p>Lançamento: ${game.released || 'Não informado'}</p>
            </div>
        </div>
    `).join('');
}

function populateFormWithHybridData(rawgData, steamData = null) {
    gameEntryForm.reset();
    tempGuides = [];
    updateGuidesList();
    fanTranslationGroup.style.display = 'none';
    currentSteamData = steamData;
    changeCoverBtn.style.display = 'none';
    gameIdInput.value = currentNextId;

    formGameTitleInput.value = steamData?.name || rawgData.name || '';
    gameStoreUrlInput.value = steamData ? `https://store.steampowered.com/app/${steamData.steam_appid}/` : '';
    gameReleaseDateElem.textContent = `Lançamento: ${rawgData.released || steamData?.release_date?.date || 'Não informado'}`;
    populatePlatformSelect(rawgData.platforms || []);
    
    const defaultCover = steamData ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${steamData.steam_appid}/library_600x900.jpg`
        : rawgData.background_image || 'imagens/favicon.jpg';
    
    gameImagePreview.src = defaultCover;
    gameImageUrlInput.value = defaultCover;

    if (steamData) {
        changeCoverBtn.style.display = 'block';
    }

    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandoned">Abandonado</option>`;
    resultsContainer.style.display = 'none';
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

// --- Galeria de Assets ---

function openAssetGallery() {
    if (!currentSteamData) return;
    const appId = currentSteamData.steam_appid;

    const sharedCDN = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/`;
    const akamaiCDN = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/`;
    const communityCDN = `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/${appId}/`;
    const communityShared = `https://shared.fastly.steamstatic.com/community_assets/images/apps/${appId}/`;
    const FORMATS_TO_TRY = ['jpg', 'png', 'ico', 'png'];

    const masterAssetList = {
        'Ícones': [
            { name: currentSteamData.clienticon, cdns: [communityCDN, communityShared] },
            { name: currentSteamData.icon, cdns: [communityCDN, communityShared] },
            { name: currentSteamData.logo, cdns: [communityCDN, communityShared] },
            { name: currentSteamData.logo_small, cdns: [communityCDN, communityShared] },
            { name: currentSteamData.community_icon, cdns: [communityCDN, communityShared] }
        ],
        'Assets da Biblioteca': [
            { name: 'library_600x900', cdns: [sharedCDN, akamaiCDN] },
            { name: 'library_600x900_2x', cdns: [sharedCDN, akamaiCDN] },
            { name: 'library_hero', cdns: [sharedCDN, akamaiCDN] },
            { name: 'library_hero_2x', cdns: [sharedCDN, akamaiCDN] },
            { name: 'library_header', cdns: [sharedCDN, akamaiCDN] },
            { name: 'logo', cdns: [sharedCDN, akamaiCDN] },
            { name: 'logo_2x', cdns: [sharedCDN, akamaiCDN] }
        ],
        'Assets da Loja': [
            { name: 'header', cdns: [sharedCDN, akamaiCDN] },
            { name: 'capsule_231x87', cdns: [sharedCDN, akamaiCDN] },
            { name: 'capsule_616x353', cdns: [sharedCDN, akamaiCDN] },
            { name: 'hero_capsule', cdns: [sharedCDN, akamaiCDN] },
        ],
        'Fundos (API)': [
            { url: currentSteamData.background },
            { url: currentSteamData.background_raw },
            { url: currentSteamData.community_icon }
        ],
        'Screenshots (API)': currentSteamData.screenshots?.map(ss => ({ url: ss.path_full, width: ss.width, height: ss.height })) || []
    };

    let galleryHTML = '';
    for (const [category, assets] of Object.entries(masterAssetList)) {
        if (!assets || assets.length === 0) continue;
        
        const items = assets.map(asset => {
            if (!asset || (!asset.url && !asset.name)) return '';
            
            let pictureHTML;
            let finalUrl; // URL para usar no data-url
            
            if (asset.url) {
                // Se a URL já é completa (screenshots, backgrounds)
                finalUrl = asset.url;
                pictureHTML = `<img src="${finalUrl}" alt="${finalUrl.split('/').pop()}" loading="lazy" onerror="this.parentElement.style.display='none'">`;
            } else {
                // Se precisa construir a URL com múltiplos CDNs e formatos
                const baseName = asset.name;
                const cdns = asset.cdns || [];
                
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

        if (items.trim()) {
            galleryHTML += `<div class="asset-category"><h4>${category}</h4><div class="asset-grid">${items}</div></div>`;
        }
    }

    assetGalleryContent.innerHTML = galleryHTML || '<p>Nenhum asset encontrado.</p>';
    galleryOverlay.classList.add('visible');
    assetGalleryModal.classList.add('visible');
}


// O resto do arquivo permanece o mesmo...

function closeAssetGallery() {
    galleryOverlay.classList.remove('visible');
    assetGalleryModal.classList.remove('visible');
}

function initializeEventListeners() {
    searchButton.addEventListener('click', () => searchGamesOnRawg(searchBar.value));
    searchBar.addEventListener('keyup', e => { if (e.key === 'Enter') searchGamesOnRawg(searchBar.value); });

    steamSearchButton.addEventListener('click', () => searchSteamDirectly(steamSearchBar.value));
    steamSearchBar.addEventListener('keyup', e => { if (e.key === 'Enter') searchSteamDirectly(steamSearchBar.value); });

    resultsContainer.addEventListener('click', e => {
        const resultItem = e.target.closest('.api-result-item');
        if (resultItem && resultItem.dataset.slug) {
            processRawgSelection(resultItem.dataset.slug);
        }
    });

    manualEntryButton.addEventListener('click', () => {
        resultsContainer.style.display = 'none';
        populateFormWithHybridData({});
    });

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

// ===================================================================================
// --- Funções Auxiliares (sem alteração) ---
// ===================================================================================
function updateGuidesList() {
    guidesList.innerHTML = tempGuides.map(g => `<div class="guide-item"><span>${g.title} - <a href="${g.url}" target="_blank" rel="noopener noreferrer">Link</a></span></div>`).join('');
}
function copyCodeToClipboard(textToCopy, buttonElement, successMessage = 'Copiado!') {
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = successMessage;
        setTimeout(() => buttonElement.textContent = originalText, 2500);
    }).catch(err => console.error('Falha ao copiar o código: ', err));
}
function handleFormSubmit(event) {
    event.preventDefault();
    let translationValue;
    if (translationSelect.value === 'fan') {
        const link = document.getElementById('fan-translation-link').value;
        translationValue = link ? `Feita por Fã (<a href="${link}" target="_blank" rel="noopener noreferrer">baixar</a>)` : "Feita por Fã";
    } else {
        translationValue = translationSelect.value;
    }
    const statusMap = {
        'playing': { text: 'Jogando', overlay: 'Jogando Atualmente' },
        'completed': { text: 'Finalizado', overlay: 'Finalizado' },
        'completed-100': { text: '100%', overlay: '100% Concluído' },
        'retired': { text: 'Aposentado', overlay: 'Aposentado' },
        'archived': { text: 'Arquivado', overlay: 'Arquivado' },
        'abandoned': { text: 'Abandonado', overlay: 'Abandonado' }
    };
    const statusValue = statusSelect.value;
    const newGame = {
        id: parseInt(gameIdInput.value),
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
    const baseJsonString = JSON.stringify(newGame, null, 4);
    const indentedJsonString = baseJsonString.split('\n').map((line, index) => index === 0 ? line : `    ${line}`).join('\n');
    const finalCodeString = `${indentedJsonString},`;
    outputCode.value = finalCodeString;
    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({ behavior: 'smooth' });
    copyCodeToClipboard(finalCodeString, copyCodeBtn, 'Copiado Automaticamente!');
    if (document.querySelector('#game-entry-form button[type="submit"]').textContent.includes('Salvar no Zerodex')) {
        currentNextId = newGame.id + 1;
        localStorage.setItem('nextGameId', currentNextId);
    }
}
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
function checkForEditMode() {
    const gameToEditData = localStorage.getItem('gameToEdit');
    if (gameToEditData) {
        const gameToEdit = JSON.parse(gameToEditData);
        document.title = `Editando: ${gameToEdit.title}`;
        document.querySelector('#add-game-section h2').textContent = 'Editar Jogo';
        document.querySelector('#game-entry-form button[type="submit"]').textContent = 'Salvar Alterações';
        document.querySelector('#output-container h3').textContent = 'Código Atualizado para database.js';
        fillFormWithExistingData(gameToEdit);
        localStorage.removeItem('gameToEdit');
    }
}
function fillFormWithExistingData(game) {
    document.getElementById('search-container').style.display = 'none';
    document.querySelector('.separator').style.display = 'none';
    document.getElementById('steam-search-container').style.display = 'none';
    gameEntryForm.reset();
    tempGuides = game.guide || [];
    updateGuidesList();
    gameIdInput.value = game.id;
    formGameTitleInput.value = game.title;
    gameImagePreview.src = game.image;
    gameImageUrlInput.value = game.image;
    gameStoreUrlInput.value = game.storeUrl || '';
    populatePlatformSelect();
    game.platform.forEach(slug => {
        const option = platformSelect.querySelector(`option[value="${slug}"]`);
        if (option) option.selected = true;
    });
    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandoned">Abandonado</option>`;
    statusSelect.value = game.status;
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