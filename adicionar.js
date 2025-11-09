// ===================================================================================
// === MEU ZERODEX - LÓGICA DA PÁGINA DE ADICIONAR JOGO (VERSÃO SEGURA) ===============
// ===================================================================================
// Este arquivo controla toda a funcionalidade da página 'adicionar.html'.
// A chave da API foi removida deste arquivo para segurança.


// --- [FUNÇÕES AUXILIARES DE COPIA] ---
// Funções para copiar o código gerado para a área de transferência do usuário.

/**
 * Copia um texto para a área de transferência e dá um feedback visual no botão.
 * @param {string} textToCopy - O texto que será copiado.
 * @param {HTMLElement} buttonElement - O elemento do botão que terá seu texto alterado.
 * @param {string} successMessage - A mensagem a ser exibida no botão em caso de sucesso.
 */
async function copyCodeToClipboard(textToCopy, buttonElement, successMessage = 'Copiado!') {
    // Fallback para navegadores mais antigos ou conexões não seguras (http)
    if (!navigator.clipboard) {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            updateCopyButton(buttonElement, successMessage);
        } catch (err) {
            console.error('Fallback: Falha ao copiar', err);
        }
        return;
    }

    // API moderna e segura
    try {
        await navigator.clipboard.writeText(textToCopy);
        updateCopyButton(buttonElement, successMessage);
    } catch (err) {
        console.error('Falha ao copiar: ', err);
    }
}

/**
 * Função auxiliar para atualizar o texto do botão e resetá-lo depois de um tempo.
 * @param {HTMLElement} buttonElement - O botão a ser atualizado.
 * @param {string} message - A mensagem temporária a ser exibida.
 */
function updateCopyButton(buttonElement, message) {
    const originalText = 'Copiar Código'; // Texto original padrão do botão
    buttonElement.textContent = message;
    setTimeout(() => {
        buttonElement.textContent = originalText;
    }, 2500); // Volta ao normal depois de 2.5 segundos
}


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
let tempGuides = []; // Armazena a lista de guias adicionados para o jogo que está sendo criado.
let currentNextId; // Armazena o próximo ID de jogo disponível para ser usado.


// --- [INICIALIZAÇÃO] ---
// Garante que a função de inicialização do ID seja chamada assim que a página carregar.
document.addEventListener('DOMContentLoaded', () => {
    // Esta função vai verificar se devemos entrar em "Modo Edição"
    checkForEditMode();

    // Se não estivermos em modo edição, a inicialização normal do ID acontece
    if (!localStorage.getItem('gameToEdit')) {
        initializeId();
    }
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
 * Verifica se a página foi carregada com a intenção de editar um jogo existente.
 * Os dados do jogo a ser editado são passados através do localStorage.
 */
function checkForEditMode() {
    // Pega os dados do jogo que guardamos no localStorage
    const gameToEditData = localStorage.getItem('gameToEdit');

    if (gameToEditData) {
        // Se encontramos dados, estamos em "Modo Edição"
        const gameToEdit = JSON.parse(gameToEditData);

        // 1. Mude os títulos e textos da página
        document.title = `Editando: ${gameToEdit.title}`;
        document.querySelector('#add-game-section h2').textContent = 'Editar Jogo';
        document.querySelector('#game-entry-form button[type="submit"]').textContent = 'Salvar Alterações';
        document.querySelector('#output-container h3').textContent = 'Código Atualizado para database.js';

        // 2. Preencha o formulário com os dados do jogo
        fillFormWithExistingData(gameToEdit);

        // 3. MUITO IMPORTANTE: Limpe os dados do localStorage para não entrar
        // no modo edição por acidente na próxima vez que visitar a página.
        localStorage.removeItem('gameToEdit');
    }
}

/**
 * Preenche o formulário com os dados de um jogo existente para edição.
 * @param {object} game - O objeto do jogo vindo do localStorage.
 */
function fillFormWithExistingData(game) {
    // Esconde a busca da API, pois já temos um jogo
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('api-results-container').style.display = 'none';
    document.getElementById('manual-entry-button').style.display = 'none';

    gameEntryForm.reset();
    tempGuides = game.guide || []; // Carrega os guias existentes
    updateGuidesList();

    // Preenche todos os campos
    document.getElementById('game-id').value = game.id;
    formGameTitleInput.value = game.title;
    document.getElementById('form-game-image').src = game.image;
    document.getElementById('game-image-url').value = game.image;
    document.getElementById('game-store-url').value = game.storeUrl || '';

    // Popula e seleciona o status correto
    const statusSelect = document.getElementById('game-status');
    statusSelect.innerHTML = `<option value="playing">Jogando</option><option value="completed">Finalizado</option><option value="completed-100">100% Concluído</option><option value="retired">Aposentado</option><option value="archived">Arquivado</option><option value="abandonado">Abandonado</option>`;
    statusSelect.value = game.status;

    // Popula e seleciona a plataforma correta
    const platformSelect = document.getElementById('game-platform');
    platformSelect.innerHTML = `<option value="${game.platform}">${game.platform.toUpperCase()}</option>`; // Apenas a opção atual

    // Lógica da tradução
    if (game.translation.includes("Feita por Fã")) {
        translationSelect.value = 'fan';
        fanTranslationGroup.style.display = 'flex';
        // Tenta extrair o link da tradução, se existir
        const linkMatch = game.translation.match(/href="([^"]+)"/);
        if (linkMatch && linkMatch[1]) {
            document.getElementById('fan-translation-link').value = linkMatch[1];
        }
    } else {
        translationSelect.value = game.translation;
    }

    document.getElementById('game-version').value = game.version || '';
    document.getElementById('game-review').value = game.review || '';

    // Mostra o formulário
    formContainer.style.display = 'block';
}

/**
 * Busca jogos chamando o nosso Cloudflare Worker.
 * Esta função age como um intermediário seguro (proxy), adicionando a chave de API no servidor
 * e nos devolvendo os resultados, sem nunca expor a chave no navegador.
 * @param {string} query - O nome do jogo a ser buscado.
 */
async function searchGames(query) {
    if (!query) return; // Não faz nada se a busca estiver vazia.

    resultsGrid.innerHTML = '<p>Buscando...</p>';
    formContainer.style.display = 'none';
    outputContainer.style.display = 'none';

    try {
        // =================================================================================
        // === MUDANÇA PRINCIPAL: DE NETLIFY PARA CLOUDFLARE WORKER ========================
        // =================================================================================
        // 1. Definimos a URL do nosso Worker.
        //    É ESSENCIAL que você substitua o valor abaixo pela URL real do seu Worker.
        const CLOUDFLARE_WORKER_URL = 'https://zerodex-api-proxy.igorrabenschlag.workers.dev'; // <-- MUITO IMPORTANTE: SUBSTITUA PELA SUA URL REAL!

        // 2. Construímos a URL final, passando o termo de busca como um parâmetro "query".
        //    O código do nosso Worker foi feito para entender este parâmetro.
        const url = `${CLOUDFLARE_WORKER_URL}?query=${encodeURIComponent(query)}`;

        // 3. Fazemos a chamada `fetch` para o nosso Worker.
        //    O Worker então fará a chamada segura para a API externa por nós.
        const response = await fetch(url);

        if (!response.ok) { // Verifica se o nosso Worker retornou um erro.
            throw new Error(`Erro na chamada do Worker: ${response.statusText}`);
        }

        const data = await response.json(); // A resposta do Worker é idêntica à da API original.
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
 * @param {Array} games - Uma lista de objetos de jogos retornados pelo nosso worker.
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
    platformSelect.innerHTML = gameData.platforms ?
        gameData.platforms.map(p => `<option value="${p.platform.slug}">${p.platform.name}</option>`).join('') :
        '<option value="pc">PC</option><option value="switch">Switch</option>';

    formContainer.style.display = 'block';
    formContainer.scrollIntoView({
        behavior: 'smooth'
    });
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
        populateForm({ ...selectedGame,
            isManual: false
        });
    }
});

manualEntryButton.addEventListener('click', () => {
    resultsGrid.innerHTML = '<p>Entrada manual selecionada.</p>';
    const manualGameData = {
        isManual: true,
        name: '',
        background_image: '',
        released: '',
        platforms: null
    };
    populateForm(manualGameData);
});

translationSelect.addEventListener('change', () => {
    fanTranslationGroup.style.display = translationSelect.value === 'fan' ? 'flex' : 'none';
});

addGuideBtn.addEventListener('click', () => {
    const title = document.getElementById('guide-title').value.trim();
    const url = document.getElementById('guide-url').value.trim();
    if (title && url) {
        tempGuides.push({
            title,
            url
        });
        updateGuidesList();
        document.getElementById('guide-title').value = '';
        document.getElementById('guide-url').value = '';
    }
});

// Ação de clique do botão para cópia manual
copyCodeBtn.addEventListener('click', () => {
    // Reutiliza a nossa função auxiliar para manter a consistência
    copyCodeToClipboard(outputCode.value, copyCodeBtn, 'Copiado!');
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
        'playing': {
            text: 'Jogando',
            overlay: 'Jogando Atualmente'
        },
        'completed': {
            text: 'Finalizado',
            overlay: 'Finalizado'
        },
        'completed-100': {
            text: '100%',
            overlay: '100% Concluído'
        },
        'retired': {
            text: 'Aposentado',
            overlay: 'Aposentado'
        },
        'archived': {
            text: 'Arquivado',
            overlay: 'Arquivado'
        },
        'abandoned': {
            text: 'Abandonado',
            overlay: 'Abandonado'
        }
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

    // Converte o objeto para uma string JSON formatada
    const baseJsonString = JSON.stringify(newGame, null, 4);

    // Garante que o bloco de código fique perfeitamente alinhado
    const indentedJsonString = baseJsonString
        .split('\n')
        .map((line, index) => {
            if (index === 0) {
                return line;
            }
            return `    ${line}`;
        })
        .join('\n');

    // Define o valor final na área de texto, adicionando a vírgula.
    const finalCodeString = `${indentedJsonString},`;
    outputCode.value = finalCodeString;

    // Mostra o container de output
    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({
        behavior: 'smooth'
    });

    // Copia o código gerado automaticamente para a área de transferência do usuário.
    copyCodeToClipboard(finalCodeString, copyCodeBtn, 'Copiado Automaticamente!');

    // Verificamos se estamos adicionando um novo jogo para incrementar o ID.
    if (document.querySelector('#game-entry-form button[type="submit"]').textContent === 'Salvar no Zerodex') {
        currentNextId = newGame.id + 1;
        localStorage.setItem('nextGameId', currentNextId);
    }
});