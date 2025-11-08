// ===================================================================================
// === MEU ZERODEX - LÓGICA DA PÁGINA DE ADICIONAR JOGO (VERSÃO SEGURA) ===============
// ===================================================================================
// Este arquivo controla toda a funcionalidade da página 'adicionar.html'.
// A chave da API foi removida deste arquivo para segurança.

// --- [SELEÇÃO DE ELEMENTOS DO DOM] ---
// Guardamos todos os elementos HTML que vamos manipular em constantes.
// Isso melhora a performance (evita buscas repetidas no documento) e organiza o código.

// Elementos da Busca da API
const searchButton = document.getElementById('api-search-button');
const searchBar = document.getElementById('api-search-bar');
const resultsContainer = document.getElementById('api-results-container');
const resultsGrid = document.querySelector('.results-grid');

// Elementos do Formulário
const manualEntryButton = document.getElementById('manual-entry-button');
const formContainer = document.getElementById('add-form-container');
const gameEntryForm = document.getElementById('game-entry-form');
const formGameTitleInput = document.getElementById('form-game-title-input');

// Elementos de Campos Específicos
const translationSelect = document.getElementById('game-translation');
const fanTranslationGroup = document.getElementById('fan-translation-link-group');
const addGuideBtn = document.getElementById('add-guide-btn');
const guidesList = document.getElementById('guides-list');

// Elementos da Área de Saída (Código Gerado)
const outputContainer = document.getElementById('output-container');
const outputCode = document.getElementById('output-code');
const copyCodeBtn = document.getElementById('copy-code-btn');


// --- [VARIÁVEIS DE ESTADO GLOBAL] ---
// Variáveis que guardam informações importantes enquanto a página está aberta.
let currentApiResults = []; // Armazena os resultados da última busca para podermos encontrar o jogo selecionado.
let tempGuides = [];         // Armazena a lista de guias adicionados para o jogo que está sendo criado.
let currentNextId;           // Armazena o próximo ID de jogo disponível para ser usado.


// --- [INICIALIZAÇÃO] ---
// Garante que a função de inicialização do ID seja chamada assim que a página carregar.
document.addEventListener('DOMContentLoaded', () => {
    initializeId();
});

/**
 * Define o próximo ID de jogo a ser usado.
 * Ele compara o ID salvo no navegador (localStorage) com o ID do arquivo `id_counter.js`,
 * e usa o MAIOR valor para garantir que nunca haja IDs duplicados.
 */
function initializeId() {
    const storedId = parseInt(localStorage.getItem('nextGameId'));
    const fileId = window.nextGameId || 1; // 'window.nextGameId' vem do arquivo id_counter.js.
    currentNextId = Math.max(storedId || 1, fileId);
    localStorage.setItem('nextGameId', currentNextId); // Salva o ID correto de volta no navegador.
}


// --- [FUNÇÕES PRINCIPAIS DE LÓGICA] ---

/**
 * Busca jogos chamando a nossa própria Função Serverless na Netlify.
 * Esta função age como um intermediário seguro, escondendo nossa chave de API.
 * @param {string} query - O nome do jogo a ser buscado.
 */
async function searchGames(query) {
    if (!query) return; // Não faz nada se a busca estiver vazia.

    resultsGrid.innerHTML = '<p>Buscando...</p>';
    formContainer.style.display = 'none';
    outputContainer.style.display = 'none';

    try {
        // === A GRANDE MUDANÇA ESTÁ AQUI ===
        // Em vez de chamar a API da RAWG diretamente com nossa chave, chamamos um "endpoint"
        // no nosso próprio site. A Netlify automaticamente executa o código do arquivo
        // 'netlify/functions/search-rawg.js' quando este endereço é chamado.
        const response = await fetch(`/.netlify/functions/search-rawg?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) { // Verifica se a nossa função serverless retornou um erro.
            throw new Error(`Erro na chamada da função serverless: ${response.statusText}`);
        }
        
        const data = await response.json(); // A resposta da nossa função é idêntica à da API original.
        currentApiResults = data.results;
        displayResults(data.results);
    } catch (error) {
        console.error("Falha ao buscar jogos:", error);
        resultsGrid.innerHTML = `<p class="no-results-message">Ocorreu um erro ao buscar.</p>`;
        manualEntryButton.style.display = 'block';
    }
}

/**
 * Exibe os resultados da busca na tela, criando os cards dos jogos.
 * (Esta função não precisou de nenhuma alteração).
 * @param {Array} games - Uma lista de objetos de jogos retornados pela nossa função serverless.
 */
function displayResults(games) {
    manualEntryButton.style.display = 'block';
    if (games.length === 0) {
        resultsGrid.innerHTML = '<p class="no-results-message">Nenhum jogo encontrado.</p>';
        return;
    }
    resultsGrid.innerHTML = games.map(game => `
        <div class="api-result-item" data-game-id="${game.id}">
            <img src="${game.background_image || 'https://placehold.co/300x400?text=Capa'}" alt="${game.name}">
            <div>
                <h3>${game.name}</h3>
                <p>Lançamento: ${game.released || 'Não informado'}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Preenche o formulário de adição com os dados de um jogo selecionado.
 * (Esta função não precisou de nenhuma alteração).
 * @param {object} gameData - Dados do jogo vindos da API.
 */
function populateForm(gameData) {
    gameEntryForm.reset();
    tempGuides = [];
    updateGuidesList();
    fanTranslationGroup.style.display = 'none';

    document.getElementById('game-id').value = currentNextId;
    formGameTitleInput.value = gameData.name || '';
    document.getElementById('form-game-image').src = gameData.background_image || 'https://placehold.co/300x400?text=Capa';
    document.getElementById('game-image-url').value = gameData.background_image || '';
    document.getElementById('form-game-release').textContent = `Lançamento: ${gameData.released || 'Não informado'}`;
    document.getElementById('game-store-url').value = gameData.isManual ? '' : `https://rawg.io/games/${gameData.slug}`;

    const statusSelect = document.getElementById('game-status');
    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandoned">Abandonado</option>`;
    
    const platformSelect = document.getElementById('game-platform');
    platformSelect.innerHTML = gameData.platforms 
        ? gameData.platforms.map(p => `<option value="${p.platform.slug}">${p.platform.name}</option>`).join('') 
        : '<option value="pc">PC</option><option value="switch">Switch</option>';
    
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Atualiza a lista de guias exibida no formulário.
 */
function updateGuidesList() {
    guidesList.innerHTML = tempGuides.map((g, index) => `
        <div class="guide-item">
            <span>${g.title} - <a href="${g.url}" target="_blank">Link</a></span>
        </div>
    `).join('');
}


// --- [EVENT LISTENERS (Ouvintes de Eventos)] ---
// Esta seção conecta as ações do usuário (cliques, digitação) às nossas funções.
// Nenhuma alteração foi necessária aqui.

searchButton.addEventListener('click', () => searchGames(searchBar.value));

searchBar.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchGames(searchBar.value);
    }
});

resultsContainer.addEventListener('click', (event) => {
    const resultItem = event.target.closest('.api-result-item');
    if (!resultItem) return;

    const gameId = parseInt(resultItem.dataset.gameId);
    const selectedGame = currentApiResults.find(game => game.id === gameId);
    
    if (selectedGame) {
        populateForm({ ...selectedGame, isManual: false });
    }
});

manualEntryButton.addEventListener('click', () => {
    resultsGrid.innerHTML = '<p>Entrada manual selecionada.</p>';
    const manualGameData = { isManual: true, name: '', background_image: '', released: '', platforms: null };
    populateForm(manualGameData);
});

translationSelect.addEventListener('change', () => {
    fanTranslationGroup.style.display = translationSelect.value === 'fan' ? 'flex' : 'none';
});

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

copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputCode.value).then(() => {
        copyCodeBtn.textContent = 'Copiado!';
        setTimeout(() => { copyCodeBtn.textContent = 'Copiar Código'; }, 2000);
    }).catch(err => {
        console.error('Falha ao copiar: ', err);
        copyCodeBtn.textContent = 'Erro ao copiar';
    });
});

// Evento principal: quando o formulário é enviado para gerar o código do objeto.
gameEntryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Lógica para o valor da tradução
    let translationValue = translationSelect.value;
    if (translationValue === 'fan') {
        const link = document.getElementById('fan-translation-link').value;
        translationValue = link ? `Feita por Fã (<a href="${link}" target="_blank">baixar</a>)` : "Feita por Fã";
    }

    // Mapeia o valor do status (ex: 'playing') para os textos correspondentes
    const statusMap = {
        'playing': { text: 'Jogando', overlay: 'Jogando Atualmente' },
        'completed': { text: 'Finalizado', overlay: 'Finalizado' },
        'completed-100': { text: '100%', overlay: '100% Concluído' },
        'retired': { text: 'Aposentado', overlay: 'Aposentado' },
        'archived': { text: 'Arquivado', overlay: 'Arquivado' },
        'abandoned': { text: 'Abandonado', overlay: 'Abandonado' }
    };
    
    const statusValue = document.getElementById('game-status').value;
    const imageUrl = document.getElementById('game-image-url').value;

    // Cria o objeto final do novo jogo com todos os dados do formulário
    const newGame = {
        id: parseInt(document.getElementById('game-id').value),
        title: formGameTitleInput.value,
        image: imageUrl || "imagens/placeholder.jpg",
        platform: document.getElementById('game-platform').value,
        status: statusValue,
        statusText: statusMap[statusValue].text,
        statusOverlay: statusMap[statusValue].overlay,
        translation: translationValue,
        guide: tempGuides,
        review: document.getElementById('game-review').value || null,
        version: document.getElementById('game-version').value || null,
        storeUrl: document.getElementById('game-store-url').value || null,
    };

    // Converte o objeto para uma string JSON formatada e a exibe na área de saída
    const outputString = JSON.stringify(newGame, null, 4);
    outputCode.value = `${outputString},\n`;

    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({ behavior: 'smooth' });

    // ATUALIZA o próximo ID e salva no navegador para a próxima vez
    currentNextId = newGame.id + 1;
    localStorage.setItem('nextGameId', currentNextId);
    
    copyCodeBtn.textContent = 'Copiar Código';
});