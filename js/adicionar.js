// ===================================================================================
// === MEU ZERODEX - LÓGICA DA PÁGINA DE ADICIONAR JOGO ===============================
// ===================================================================================

// --- [INICIALIZAÇÃO] ---
document.addEventListener('DOMContentLoaded', () => {
    // Funções globais que agora rodam nesta página
    setupThemeToggle();
    setupBackToTopButton();

    // Lógica principal da página
    if (!localStorage.getItem('gameToEdit')) {
        initializeId();
    }
    checkForEditMode();
});

// --- [VARIÁVEIS DE ESTADO GLOBAL] ---
let currentApiResults = [];
let tempGuides = [];
let currentNextId;

// --- [SELEÇÃO DE ELEMENTOS DO DOM] ---
const searchButton = document.getElementById('api-search-button');
const searchBar = document.getElementById('api-search-bar');
const resultsContainer = document.getElementById('api-results-container');
const resultsGrid = document.querySelector('.results-grid');
const manualEntryButton = document.getElementById('manual-entry-button');
const directManualAddBtn = document.getElementById('direct-manual-add-btn');
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

// --- [FUNÇÕES GLOBAIS COPIADAS DO SCRIPT.JS] ---

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

// --- [LÓGICA PRINCIPAL DA PÁGINA] ---

function initializeId() {
    const storedId = parseInt(localStorage.getItem('nextGameId'));
    const fileId = window.nextGameId || 1;
    currentNextId = Math.max(storedId || 1, fileId);
    localStorage.setItem('nextGameId', currentNextId);
}

async function searchGames(query) {
    if (!query) return;
    resultsGrid.innerHTML = '<p>Buscando...</p>';
    resultsContainer.style.display = 'block';
    formContainer.style.display = 'none';
    outputContainer.style.display = 'none';
    const CLOUDFLARE_WORKER_URL = 'https://zerodex-api-proxy.igorrabenschlag.workers.dev';
    try {
        const response = await fetch(`${CLOUDFLARE_WORKER_URL}?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Erro na chamada do Worker: ${response.statusText}`);
        const data = await response.json();
        currentApiResults = data.results;
        displayResults(data.results);
    } catch (error) {
        console.error("Falha ao buscar jogos:", error);
        resultsGrid.innerHTML = `<p class="no-results-message">Ocorreu um erro ao buscar.</p>`;
        manualEntryButton.style.display = 'block';
    }
}

function displayResults(games) {
    manualEntryButton.style.display = 'block';
    if (games.length === 0) {
        resultsGrid.innerHTML = '<p class="no-results-message">Nenhum jogo encontrado.</p>';
        return;
    }
    resultsGrid.innerHTML = games.map(game => `
    <div class="api-result-item" data-slug="${game.slug}">
        <img src="${game.background_image || 'https://placehold.co/300x400?text=Capa'}" alt="${game.name}">
        <div>
            <h3>${game.name}</h3>
            <p>Lançamento: ${game.released || 'Não informado'}</p>
        </div>
    </div>
`).join('');
}

// SUBSTITUA A FUNÇÃO populateForm INTEIRA PELA VERSÃO ABAIXO

async function populateForm(gameData) {
    gameEntryForm.reset();
    tempGuides = [];
    updateGuidesList();
    fanTranslationGroup.style.display = 'none';

    document.getElementById('game-id').value = currentNextId;
    formGameTitleInput.value = gameData.name || '';
    
    document.getElementById('form-game-image').src = gameData.background_image || 'imagens/placeholder.jpg';
    document.getElementById('game-image-url').value = gameData.background_image || '';

    document.getElementById('form-game-release').textContent = `Lançamento: ${gameData.released || 'Não informado'}`;
    
    // --- LÓGICA DAS LOJAS (permanece a mesma) ---
    const storeSelect = document.getElementById('game-store-select');
    const storeUrlInput = document.getElementById('game-store-url-manual');
    storeSelect.innerHTML = '<option value="manual">-- Inserir Manualmente --</option>';
    if (gameData.stores) {
        gameData.stores.forEach(sw => storeSelect.innerHTML += `<option value="${sw.url}">${sw.store.name}</option>`);
    }
    if (gameData.stores && gameData.stores.length > 0) {
        storeSelect.value = gameData.stores[0].url;
        storeUrlInput.value = gameData.stores[0].url;
    } else {
        storeUrlInput.value = '';
    }

    // --- NOVA LÓGICA PARA O SELECT MÚLTIPLO DE PLATAFORMAS ---
    const platformSelect = document.getElementById('game-platform');
    platformSelect.innerHTML = ''; // Limpa a lista

    // Preenche a lista com todas as opções do nosso mapa global
    Object.entries(PLATFORM_DISPLAY_NAMES).forEach(([slug, name]) => {
        platformSelect.innerHTML += `<option value="${slug}">${name}</option>`;
    });

    // Se os dados vieram da API, pré-seleciona as opções corretas
    if (gameData.platforms) {
        const platformSlugs = gameData.platforms.map(p => p.platform.slug);
        Array.from(platformSelect.options).forEach(option => {
            if (platformSlugs.includes(option.value)) {
                option.selected = false;
            }
        });
    }

    // --- RESTANTE DO FORMULÁRIO (permanece o mesmo) ---
    const statusSelect = document.getElementById('game-status');
    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandonado">Abandonado</option>`;
    
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });

    function updateGuidesList() {
        guidesList.innerHTML = tempGuides.map(g => `
            <div class="guide-item"><span>${g.title} - <a href="${g.url}" target="_blank">Link</a></span></div>`
        ).join('');
    }
}

// --- [EVENT LISTENERS] ---

searchButton.addEventListener('click', () => searchGames(searchBar.value));
searchBar.addEventListener('keyup', (event) => { if (event.key === 'Enter') searchGames(searchBar.value); });

//"OUVINTE" DE CLIQUE
resultsContainer.addEventListener('click', async (event) => {
    const resultItem = event.target.closest('.api-result-item');
    if (!resultItem) return;

    // Pega o slug que guardamos no passo 1
    const slug = resultItem.dataset.slug;
    
    // Mostra um feedback visual enquanto busca os detalhes
    resultsGrid.innerHTML = '<p>Carregando detalhes...</p>';

    // Define a URL do seu Worker
    const CLOUDFLARE_WORKER_URL = 'https://zerodex-api-proxy.igorrabenschlag.workers.dev';

    try {
        // --- A MÁGICA ACONTECE AQUI ---
        // Faz a segunda chamada, desta vez usando o parâmetro "details" que seu Worker entende
        // CÓDIGO CORRETO
        const response = await fetch(`${CLOUDFLARE_WORKER_URL}/${slug}`);
        if (!response.ok) throw new Error('Falha ao buscar detalhes completos do jogo');
        
        // A resposta agora contém todos os dados, incluindo as URLs das lojas
        const gameDetails = await response.json();
        
        // Preenche o formulário com os dados completos
        populateForm({ ...gameDetails, isManual: false });

    } catch (error) {
        console.error("Falha ao buscar detalhes:", error);
        // Fallback: se a busca de detalhes falhar, usa os dados básicos que já tínhamos.
        // Neste caso, o campo da URL da loja ficará vazio, o que é melhor que "undefined".
        const selectedGame = currentApiResults.find(game => game.slug === slug);
        if (selectedGame) {
            populateForm({ ...selectedGame, isManual: false });
        }
    }
});

const handleManualAdd = () => {
    resultsContainer.style.display = 'none';
    const manualGameData = { isManual: true, name: '', platforms: null, stores: null };
    populateForm(manualGameData);
};
manualEntryButton.addEventListener('click', handleManualAdd);
directManualAddBtn.addEventListener('click', handleManualAdd);

translationSelect.addEventListener('change', () => { fanTranslationGroup.style.display = translationSelect.value === 'fan' ? 'flex' : 'none'; });

addGuideBtn.addEventListener('click', () => {
    const title = document.getElementById('guide-title').value.trim();
    const url = document.getElementById('guide-url').value.trim();
    if (title && url) {
        tempGuides.push({ title, url });
        updateGuidesList();
        document.getElementById('guide-title').value = '';
        document.getElementById('guide-url').value = '';
    }
});

document.getElementById('game-store-select').addEventListener('change', (event) => {
    const manualInput = document.getElementById('game-store-url-manual');
    if (event.target.value === 'manual') {
        manualInput.value = '';
        manualInput.focus();
    } else {
        manualInput.value = event.target.value;
    }
});

gameEntryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let translationValue = translationSelect.value;
    if (translationValue === 'fan') {
        const link = document.getElementById('fan-translation-link').value;
        translationValue = link ? `Feita por Fã (<a href="${link}" target="_blank">baixar</a>)` : "Feita por Fã";
    }
    const statusMap = { 'playing': { text: 'Jogando', overlay: 'Jogando Atualmente' }, 'completed': { text: 'Finalizado', overlay: 'Finalizado' }, 'completed-100': { text: '100%', overlay: '100% Concluído' }, 'retired': { text: 'Aposentado', overlay: 'Aposentado' }, 'archived': { text: 'Arquivado', overlay: 'Arquivado' }, 'abandoned': { text: 'Abandonado', overlay: 'Abandonado' } };
    const statusValue = document.getElementById('game-status').value;
    const imageUrl = document.getElementById('game-image-url').value;
    const newGame = {
        id: parseInt(document.getElementById('game-id').value),
        title: formGameTitleInput.value,
        image: imageUrl || "imagens/favicon.jpg",
        platform: Array.from(document.getElementById('game-platform').selectedOptions).map(option => option.value),
        status: statusValue,
        statusText: statusMap[statusValue].text,
        statusOverlay: statusMap[statusValue].overlay,
        translation: translationValue,
        guide: tempGuides,
        review: document.getElementById('game-review').value || null,
        version: document.getElementById('game-version').value || null,
        storeUrl: document.getElementById('game-store-url-manual').value || null,
    };
    const baseJsonString = JSON.stringify(newGame, null, 4);
    const indentedJsonString = baseJsonString.split('\n').map((line, index) => index === 0 ? line : `    ${line}`).join('\n');
    const finalCodeString = `${indentedJsonString},`;
    outputCode.value = finalCodeString;
    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({ behavior: 'smooth' });
    copyCodeToClipboard(finalCodeString, copyCodeBtn, 'Copiado Automaticamente!');
    if (document.querySelector('#game-entry-form button[type="submit"]').textContent === 'Salvar no Zerodex') {
        currentNextId = newGame.id + 1;
        localStorage.setItem('nextGameId', currentNextId);
    }
});

copyCodeBtn.addEventListener('click', () => {
    copyCodeToClipboard(outputCode.value, copyCodeBtn, 'Copiado!');
});

function copyCodeToClipboard(textToCopy, buttonElement, successMessage = 'Copiado!') {
    navigator.clipboard.writeText(textToCopy).then(() => {
        updateCopyButton(buttonElement, successMessage);
    }).catch(err => {
        console.error('Falha ao copiar: ', err);
    });
}

function updateCopyButton(buttonElement, message) {
    const originalText = 'Copiar Código';
    buttonElement.textContent = message;
    setTimeout(() => {
        buttonElement.textContent = originalText;
    }, 2500);
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
    document.getElementById('direct-manual-add-btn').style.display = 'none';
    document.querySelector('.direct-manual-add-container p').style.display = 'none';
    
    gameEntryForm.reset();
    tempGuides = game.guide || [];
    updateGuidesList();

    document.getElementById('game-id').value = game.id;
    formGameTitleInput.value = game.title;
    document.getElementById('form-game-image').src = game.image;
    document.getElementById('game-image-url').value = game.image;

    // Lógica de Lojas
    const storeSelect = document.getElementById('game-store-select');
    const storeUrlInput = document.getElementById('game-store-url-manual');
    storeSelect.innerHTML = '<option value="manual">-- Inserir Manualmente --</option>';
    storeUrlInput.value = game.storeUrl || '';
    
    // Lógica de Status
    const statusSelect = document.getElementById('game-status');
    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandonado">Abandonado</option>`;
    statusSelect.value = game.status;

    // --- NOVA LÓGICA PARA PRÉ-SELECIONAR PLATAFORMAS NO MODO DE EDIÇÃO ---
    const platformSelect = document.getElementById('game-platform');
    platformSelect.innerHTML = ''; // Limpa
    Object.entries(PLATFORM_DISPLAY_NAMES).forEach(([slug, name]) => {
        platformSelect.innerHTML += `<option value="${slug}">${name}</option>`;
    });
    Array.from(platformSelect.options).forEach(option => {
        if (game.platform.includes(option.value)) {
            option.selected = true;
        }
    });
    
    // Restante do formulário
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
    document.getElementById('game-version').value = game.version || '';
    document.getElementById('game-review').value = game.review || '';
    formContainer.style.display = 'block';
}