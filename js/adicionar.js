// ===================================================================================
// === MEU ZERODEX - LÓGICA DA PÁGINA DE ADICIONAR JOGO (adicionar.js) ================
// ===================================================================================
// Este arquivo gerencia toda a interatividade da página 'adicionar.html', incluindo:
// - Busca de jogos em uma API externa.
// - Preenchimento automático ou manual do formulário de adição/edição.
// - Geração do objeto de dados do jogo para ser inserido no 'database.js'.
// - Lógica para o modo de edição de um jogo existente.
// ===================================================================================

// --- [CONFIGURAÇÃO E CONSTANTES GLOBAIS] ---------------------------------------------
const CLOUDFLARE_WORKER_URL = 'https://zerodex-api-proxy.igorrabenschlag.workers.dev';

// --- [VARIÁVEIS DE ESTADO GLOBAL] ----------------------------------------------------
// Armazenam dados que precisam ser acessados por múltiplas funções.
let currentApiResults = []; // Guarda os resultados da última busca na API.
let tempGuides = [];        // Guarda temporariamente os guias adicionados no formulário.
let currentNextId;          // Armazena o próximo ID de jogo a ser sugerido.

// --- [SELEÇÃO DE ELEMENTOS DO DOM (CACHE DE ELEMENTOS)] ------------------------------
// Selecionar os elementos uma vez e armazená-los em constantes melhora a performance
// e a organização do código.
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
const platformSelect = document.getElementById('game-platform');
const statusSelect = document.getElementById('game-status');
const gameIdInput = document.getElementById('game-id');
const gameImagePreview = document.getElementById('form-game-image');
const gameImageUrlInput = document.getElementById('game-image-url');
const gameStoreUrlInput = document.getElementById('game-store-url-manual');
const gameReleaseDateElem = document.getElementById('form-game-release');
const gameReviewInput = document.getElementById('game-review');
const gameVersionSelect = document.getElementById('game-version');

// --- [INICIALIZAÇÃO] -----------------------------------------------------------------
// O evento 'DOMContentLoaded' garante que o script só execute após o carregamento
// completo do HTML, evitando erros de elementos não encontrados.
document.addEventListener('DOMContentLoaded', () => {
    // Funções globais que também existem em 'script.js'.
    setupThemeToggle();
    setupBackToTopButton();

    // Lógica principal da página.
    // Se não houver um jogo sendo editado, inicializa o contador de ID.
    if (!localStorage.getItem('gameToEdit')) {
        initializeId();
    }
    // Verifica se a página foi carregada para editar um jogo existente.
    checkForEditMode();
});


// ===================================================================================
// --- SEÇÃO: LÓGICA PRINCIPAL DA PÁGINA ---------------------------------------------
// ===================================================================================

/**
 * Inicializa o próximo ID de jogo a ser usado.
 * Compara o valor salvo no armazenamento local com um valor de fallback do arquivo
 * 'id_counter.js' (se existir) e usa o maior, garantindo IDs sequenciais.
 */
function initializeId() {
    const storedId = parseInt(localStorage.getItem('nextGameId'));
    // 'window.nextGameId' viria do arquivo 'id_counter.js'.
    const fileId = window.nextGameId || 1;
    currentNextId = Math.max(storedId || 1, fileId);
    localStorage.setItem('nextGameId', currentNextId); // Salva o valor atualizado.
    gameIdInput.value = currentNextId; // Define o valor no campo do formulário.
}

/**
 * Lida com o fluxo de adição manual, escondendo os resultados da busca e exibindo o formulário.
 */
const handleManualAdd = () => {
    resultsContainer.style.display = 'none';
    const manualGameData = {
        isManual: true,
        name: '',
        background_image: '', // URL vazia para a imagem
        released: 'Não informado',
        platforms: null,
        stores: null
    };
    populateForm(manualGameData);
};


// ===================================================================================
// --- SEÇÃO: INTERAÇÃO COM API EXTERNA ----------------------------------------------
// ===================================================================================

/**
 * Busca jogos na API externa através de um proxy (Cloudflare Worker).
 * @param {string} query - O termo de busca digitado pelo usuário.
 */
async function searchGames(query) {
    if (!query) return; // Não faz nada se a busca estiver vazia.

    // Prepara a interface para a busca.
    resultsGrid.innerHTML = '<p>Buscando...</p>';
    resultsContainer.style.display = 'block';
    formContainer.style.display = 'none';
    outputContainer.style.display = 'none';

    try {
        const response = await fetch(`${CLOUDFLARE_WORKER_URL}?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Erro na chamada da API: ${response.statusText}`);
        }
        const data = await response.json();
        currentApiResults = data.results; // Salva os resultados para uso posterior.
        displayResults(data.results);
    } catch (error) {
        console.error("Falha ao buscar jogos:", error);
        resultsGrid.innerHTML = `<p class="no-results-message">Ocorreu um erro ao buscar. Tente novamente.</p>`;
        manualEntryButton.style.display = 'block';
    }
}

/**
 * Exibe os resultados da busca na tela, criando um card para cada jogo.
 * @param {Array} games - Uma lista de objetos de jogo retornados pela API.
 */
function displayResults(games) {
    manualEntryButton.style.display = 'block';
    if (!games || games.length === 0) {
        resultsGrid.innerHTML = '<p class="no-results-message">Nenhum jogo encontrado.</p>';
        return;
    }
    resultsGrid.innerHTML = games.map(game => `
        <div class="api-result-item" data-slug="${game.slug}">
            <img src="${game.background_image || 'imagens/placeholder.jpg'}" alt="${game.name}">
            <div>
                <h3>${game.name}</h3>
                <p>Lançamento: ${game.released || 'Não informado'}</p>
            </div>
        </div>
    `).join('');
}


// ===================================================================================
// --- SEÇÃO: MANIPULAÇÃO DO FORMULÁRIO -----------------------------------------------
// ===================================================================================

/**
 * Preenche o formulário de adição com os dados de um jogo (seja da API ou manual).
 * @param {Object} gameData - O objeto contendo os dados do jogo.
 */
async function populateForm(gameData) {
    gameEntryForm.reset(); // Limpa qualquer dado preenchido anteriormente.
    tempGuides = [];
    updateGuidesList();
    fanTranslationGroup.style.display = 'none';

    gameIdInput.value = currentNextId;
    formGameTitleInput.value = gameData.name || '';

    // Preenche os campos de imagem e URL.
    const imageUrl = gameData.background_image || 'imagens/placeholder.jpg';
    gameImagePreview.src = imageUrl;
    gameImageUrlInput.value = gameData.background_image || ''; // Deixa vazio se não houver.

    gameStoreUrlInput.value = ''; // A URL da loja precisa ser preenchida manualmente ou vir de detalhes específicos.
    gameReleaseDateElem.textContent = `Lançamento: ${gameData.released || 'Não informado'}`;

    // --- Lógica para o select múltiplo de plataformas ---
    platformSelect.innerHTML = ''; // Limpa a lista de opções.

    // Preenche a lista com todas as opções do mapa global 'PLATFORM_DISPLAY_NAMES'.
    Object.entries(PLATFORM_DISPLAY_NAMES).forEach(([slug, name]) => {
        platformSelect.innerHTML += `<option value="${slug}">${name}</option>`;
    });

    

    // Preenche as opções de status.
    statusSelect.innerHTML = `
        <option value="playing">Jogando</option>
        <option value="completed">Finalizado</option>
        <option value="completed-100">100% Concluído</option>
        <option value="retired">Aposentado</option>
        <option value="archived">Arquivado</option>
        <option value="abandoned">Abandonado</option>
    `;

    // Exibe o formulário e rola a tela até ele.
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Verifica se a página foi carregada em "Modo de Edição".
 * Se encontrar dados de um jogo no localStorage, preenche o formulário com eles.
 */
function checkForEditMode() {
    const gameToEditData = localStorage.getItem('gameToEdit');
    if (gameToEditData) {
        const gameToEdit = JSON.parse(gameToEditData);

        // Altera a interface para refletir o modo de edição.
        document.title = `Editando: ${gameToEdit.title}`;
        document.querySelector('#add-game-section h2').textContent = 'Editar Jogo';
        document.querySelector('#game-entry-form button[type="submit"]').textContent = 'Salvar Alterações';
        document.querySelector('#output-container h3').textContent = 'Código Atualizado para database.js';

        // Preenche o formulário com os dados do jogo.
        fillFormWithExistingData(gameToEdit);

        // Limpa os dados do localStorage para evitar que o modo de edição persista.
        localStorage.removeItem('gameToEdit');
    }
}

/**
 * Preenche o formulário com os dados de um jogo existente para edição.
 * @param {Object} game - O objeto do jogo vindo do 'database.js'.
 */
function fillFormWithExistingData(game) {
    // Esconde os elementos de busca, pois não são necessários na edição.
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('direct-manual-add-btn').style.display = 'none';
    document.querySelector('.direct-manual-add-container p').style.display = 'none';

    gameEntryForm.reset();
    tempGuides = game.guide || [];
    updateGuidesList();

    // Preenche os campos do formulário com os dados do jogo.
    gameIdInput.value = game.id;
    formGameTitleInput.value = game.title;
    gameImagePreview.src = game.image;
    gameImageUrlInput.value = game.image;
    gameStoreUrlInput.value = game.storeUrl || '';

    // Define o status correto.
    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandoned">Abandonado</option>`;
    statusSelect.value = game.status;

    // Lida com o campo de tradução, verificando se é de fã e extraindo o link.
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

    formContainer.style.display = 'block'; // Exibe o formulário preenchido.
}


// ===================================================================================
// --- SEÇÃO: ATUALIZAÇÕES DE UI E FUNÇÕES AUXILIARES --------------------------------
// ===================================================================================

/**
 * Atualiza a lista de guias exibida no formulário.
 */
function updateGuidesList() {
    guidesList.innerHTML = tempGuides.map(g => `
        <div class="guide-item">
            <span>${g.title} - <a href="${g.url}" target="_blank" rel="noopener noreferrer">Link</a></span>
        </div>`
    ).join('');
}

/**
 * Copia um texto para a área de transferência e atualiza o botão para dar feedback.
 * @param {string} textToCopy - O texto a ser copiado.
 * @param {HTMLElement} buttonElement - O botão que acionou a cópia.
 * @param {string} successMessage - A mensagem a ser exibida no botão após o sucesso.
 */
function copyCodeToClipboard(textToCopy, buttonElement, successMessage = 'Copiado!') {
    navigator.clipboard.writeText(textToCopy).then(() => {
        updateCopyButton(buttonElement, successMessage);
    }).catch(err => {
        console.error('Falha ao copiar o código: ', err);
        // Poderia-se adicionar um feedback de erro aqui.
    });
}

/**
 * Altera o texto de um botão temporariamente para dar feedback ao usuário.
 * @param {HTMLElement} buttonElement - O botão a ser atualizado.
 * @param {string} message - A mensagem temporária.
 */
function updateCopyButton(buttonElement, message) {
    const originalText = buttonElement.textContent; // Salva o texto original.
    buttonElement.textContent = message;
    setTimeout(() => {
        buttonElement.textContent = originalText; // Restaura o texto original após 2.5 segundos.
    }, 2500);
}


// ===================================================================================
// --- SEÇÃO: EVENT LISTENERS (OUVINTES DE EVENTOS) -----------------------------------
// ===================================================================================
// Agrupa toda a lógica que responde às interações do usuário.

// --- Eventos de Busca ---
searchButton.addEventListener('click', () => searchGames(searchBar.value));
searchBar.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchGames(searchBar.value);
    }
});

// --- Evento de Clique nos Resultados da Busca (Usa Delegação de Eventos) ---
resultsContainer.addEventListener('click', async (event) => {
    const resultItem = event.target.closest('.api-result-item');
    if (!resultItem) return;

    const slug = resultItem.dataset.slug;
    resultsGrid.innerHTML = '<p>Carregando detalhes...</p>';

    try {
        // Faz uma segunda chamada à API para obter detalhes completos, incluindo URLs de lojas.
        const response = await fetch(`${CLOUDFLARE_WORKER_URL}/${slug}`);
        if (!response.ok) throw new Error('Falha ao buscar detalhes completos do jogo');
        
        const gameDetails = await response.json();
        populateForm({ ...gameDetails, isManual: false });
    } catch (error) {
        console.error("Falha ao buscar detalhes:", error);
        // Se a busca detalhada falhar, usa os dados básicos que já tínhamos.
        const selectedGame = currentApiResults.find(game => game.slug === slug);
        if (selectedGame) {
            populateForm({ ...selectedGame, isManual: false });
        }
    }
});

// --- Eventos de Entrada Manual ---
manualEntryButton.addEventListener('click', handleManualAdd);
directManualAddBtn.addEventListener('click', handleManualAdd);

// --- Eventos do Formulário ---
translationSelect.addEventListener('change', () => {
    fanTranslationGroup.style.display = translationSelect.value === 'fan' ? 'flex' : 'none';
});

addGuideBtn.addEventListener('click', () => {
    const titleInput = document.getElementById('guide-title');
    const urlInput = document.getElementById('guide-url');
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if (title && url) {
        tempGuides.push({ title, url });
        updateGuidesList();
        titleInput.value = ''; // Limpa os campos.
        urlInput.value = '';
    }
});

// --- Evento de Submissão do Formulário (Geração do Código) ---
gameEntryForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o recarregamento da página.

    // 1. Processa os dados do formulário.
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

    // 2. Monta o objeto final do jogo.
    const newGame = {
        id: parseInt(gameIdInput.value),
        title: formGameTitleInput.value,
        image: gameImageUrlInput.value || "imagens/favicon.jpg", // Usa um placeholder se vazio.
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

    // 3. Formata o objeto como uma string JSON para exibição.
    const baseJsonString = JSON.stringify(newGame, null, 4); // 'null, 4' formata com 4 espaços de indentação.
    const indentedJsonString = baseJsonString.split('\n').map((line, index) => index === 0 ? line : `    ${line}`).join('\n');
    const finalCodeString = `${indentedJsonString},`;

    // 4. Exibe o código gerado e o copia automaticamente.
    outputCode.value = finalCodeString;
    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({ behavior: 'smooth' });
    copyCodeToClipboard(finalCodeString, copyCodeBtn, 'Copiado Automaticamente!');

    // 5. Se for um jogo novo (não edição), atualiza o próximo ID para o próximo número.
    if (document.querySelector('#game-entry-form button[type="submit"]').textContent.includes('Salvar no Zerodex')) {
        currentNextId = newGame.id + 1;
        localStorage.setItem('nextGameId', currentNextId);
    }
});

// --- Evento do Botão de Copiar Manualmente ---
copyCodeBtn.addEventListener('click', () => {
    copyCodeToClipboard(outputCode.value, copyCodeBtn, 'Copiado!');
});


// ===================================================================================
// --- SEÇÃO: FUNÇÕES GLOBAIS COMPARTILHADAS ------------------------------------------
// ===================================================================================
// NOTA: Estas funções são duplicadas de 'script.js'. Em um projeto maior,
// seria ideal movê-las para um arquivo 'utils.js' compartilhado para evitar
// redundância e facilitar a manutenção.

/**
 * Configura o botão de alternância de tema (claro/escuro).
 */
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
    // Aplica o tema salvo ou o padrão 'dark'.
    applyTheme(localStorage.getItem('theme') || 'dark');
    // Adiciona o evento de clique para trocar o tema.
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

/**
 * Configura o botão "Voltar ao Topo".
 */
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    window.onscroll = () => {
        // Mostra o botão se a rolagem passar de 100 pixels.
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };
    // Adiciona o evento de clique para rolar suavemente ao topo.
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}