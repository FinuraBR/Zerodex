// ===================================================================================
// === MEU ZERODEX - BANCO DE DADOS DE JOGOS (database.js) ===========================
// ===================================================================================
//
// DESCRIÇÃO:
// Este arquivo serve como o banco de dados central para toda a aplicação. Ele contém
// as configurações globais e o array principal `gamesData` que armazena todos os
// jogos catalogados. A manutenção e adição de novos jogos é feita diretamente aqui.
//
// ===================================================================================


// =============================================================================
// === CONFIGURAÇÕES GLOBAIS ===================================================
// =============================================================================

/**
 * @const {Object<string, string>} PLATFORM_DISPLAY_NAMES
 * @description Mapeia os 'slugs' (identificadores de sistema) das plataformas para
 * nomes legíveis e amigáveis que serão exibidos na interface do usuário (UI).
 * Esta constante é declarada globalmente para ser acessível por `script.js` e
 * `adicionar.js`, garantindo consistência na exibição dos nomes das plataformas.
 */
const PLATFORM_DISPLAY_NAMES = {
    'pc': 'PC',
    'android': 'Android',
    'ios': 'iOS',
    'xbox360': 'Xbox 360',
    'xbox-one': 'Xbox One',
    'nintendo-switch': 'Switch',
    // Adicione outras plataformas aqui conforme necessário, mantendo o formato 'slug': 'Nome Visível'.
};


// ===================================================================================
// === BANCO DE DADOS PRINCIPAL DE JOGOS =============================================
// ===================================================================================

/*
|--------------------------------------------------------------------------
| GUIA E TEMPLATE PARA ADICIONAR UM NOVO JOGO
|--------------------------------------------------------------------------
|
| INSTRUÇÕES:
| 1. Copie o "Template Limpo" abaixo.
| 2. Cole-o no topo da lista 'gamesData' (logo após o colchete de abertura '[').
| 3. Preencha os campos de acordo com a explicação detalhada de cada um.
|
|--------------------------------------------------------------------------
| EXPLICAÇÃO DETALHADA DOS CAMPOS
|--------------------------------------------------------------------------
|
| id: (Obrigatório | Número)
|   O identificador único do jogo. O jogo mais recente deve ter o maior número.
|   Exemplo: Se o último jogo da lista tem o ID 103, o novo será 104.
|
| title: (Obrigatório | String)
|   O nome exato e completo do jogo.
|   Exemplo: "The Legend of Zelda: Breath of the Wild"
|
| image: (Obrigatório | String)
|   O link (URL) para a imagem da capa do jogo. Dê preferência a links permanentes
|   e de alta qualidade (ex: Steam, SteamGridDB).
|   Exemplo: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/..."
|
| platform: (Obrigatório | Array<String>)
|   Uma lista de 'slugs' (identificadores em minúsculas) das plataformas. Usado para filtros.
|   Consulte `PLATFORM_DISPLAY_NAMES` para os slugs disponíveis.
|   Exemplo: ["pc", "nintendo-switch"]
|
| status: (Obrigatório | String)
|   A classe interna que define a cor do 'badge' e a categoria do jogo.
|   Valores Válidos:
|     - "completed-100": Para jogos 100% concluídos.
|     - "completed":     Para jogos com a campanha principal finalizada.
|     - "playing":       Para jogos que você está jogando atualmente.
|     - "retired":       Para jogos sem fim definido que você parou de jogar (ex: multiplayer).
|     - "archived":      Para jogos pausados com intenção de voltar.
|     - "abandoned":     Para jogos abandonados sem intenção de voltar.
|   Exemplo: "completed-100"
|
| statusText: (Obrigatório | String)
|   O texto curto que aparece no card do jogo no catálogo.
|   Exemplos: "100%", "Finalizado", "Jogando", "Aposentado", "Arquivado", "Abandonado"
|
| statusOverlay: (Obrigatório | String)
|   O texto mais descritivo que aparece nos detalhes (overlay) do card.
|   Exemplos: "100% Concluído", "Campanha Finalizada", "Jogando Atualmente"
|
| translation: (Obrigatório | String)
|   Informação sobre a tradução. Pode conter HTML para links.
|   Exemplo (texto simples): "Oficial" ou "Não possui"
|   Exemplo (com link): "Feita por Fã (<a href='URL_DO_PATCH' target='_blank' rel='noopener noreferrer'>baixar</a>)"
|
| guide: (Obrigatório | Array<Object>)
|   Uma lista de guias utilizados. Se nenhum foi usado, deixe a lista vazia: `[]`.
|   Cada objeto na lista deve ter `title` e `url`.
|   Exemplo: [{ title: "IGN", url: "https://ign.com/..." }]
|
| review: (Opcional | String ou null)
|   Seu comentário pessoal ou mini-review sobre o jogo.
|   Se não houver comentário, use o valor `null`.
|
| version: (Opcional | String ou null)
|   Indica uma versão especial do jogo, como Demo, Beta ou Acesso Antecipado.
|   Se for a versão padrão/completa, use `null`.
|   Exemplo: "Demo"
|
| storeUrl: (Opcional | String ou null)
|   O link para a página do jogo na loja (Steam, Epic, PSN, etc.).
|   Se não houver link, use o valor `null`.
|   Exemplo: "https://store.steampowered.com/app/12345"
|
|--------------------------------------------------------------------------
| Template Limpo para Copiar
|--------------------------------------------------------------------------
*/
/*
{
    id: 0,
    title: "",
    image: "",
    platform: ["pc"],
    status: "completed",
    statusText: "Finalizado",
    statusOverlay: "Finalizado",
    translation: "Oficial",
    guide: [],
    review: null,
    version: null,
    storeUrl: null,
},
*/

/**
 * @const {Array<Object>} gamesData
 * @description Array principal que armazena a coleção completa de jogos catalogados.
 * Para garantir a ordenação padrão por "Mais Recentes", novos jogos devem ser
 * adicionados sempre no início (topo) desta lista.
 */
const gamesData = [
    {
        "id": 155,
        "title": "The Backroom - Lost and Found",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2019830/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2019830/"
    },
    {
        "id": 154,
        "title": "while True: learn()",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/619150/library_600x900.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Steam",
                "url": "https://steamcommunity.com/app/619150/guides/?searchText=&browsefilter=toprated&browsesort=creationorder&requiredtags%5B%5D=-1#scrollTop=400"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/619150/"
    },
    {
        "id": 153,
        "title": "The Awesome Adventures of Captain Spirit",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/845070/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/845070/"
    },
    {
        "id": 152,
        "title": "Backrooms Break",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2248330/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2248330/"
    },
    {
        "id": 151,
        "title": "Harold Halibut",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/924750/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Guide for 100% Completion and Collectibles",
                "url": "https://youtube.com/playlist?list=PLFC9pcaL3V_01cIU1tP_eblxfn7scTw4C&si=YP_NL6DbOf9Uycg7"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/924750/"
    },
    {
        "id": 150,
        "title": "Spirit City: Lofi Sessions",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2113850/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": "nas primeiras 6 horas de jogo eu fiz namoral, apos isso eu usei uma ferramenta para acelerar o jogo",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2113850/"
    },
    {
        "id": 149,
        "title": "Private Dorm Manager",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2273420/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [
            {
                "title": "Walkthrough",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=3116039280"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2273420/"
    },
    {
        "id": 148,
        "title": "The DvD idle game",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3801340/25711d72d5462686349d8cee72b716c43ac3c1ad/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/3801340/"
    },
    {
        "id": 147,
        "title": "Supercar Collection Simulator",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3453600/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/3453600/"
    },
    {
        "id": 146,
        "title": "Condemned: Criminal Origins",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4720/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://www.centraldetraducoes.net.br/2006/04/traducao-do-condemned-criminal-origins-pc.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "Todos os itens colecionáveis",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=2851745738"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/4720/"
    },
    {
        "id": 145,
        "title": "Martha Is Dead",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/515960/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "100% Achievement Guide",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=2763741638"
            },
            {
                "title": "All Infrared Photos",
                "url": "https://www.youtube.com/watch?v=Kr6Y-OM2Jhw"
            },
            {
                "title": "Lapo Quest",
                "url": "https://www.youtube.com/watch?v=dcCbud3xncY"
            },
            {
                "title": "The Tower Achievement",
                "url": "https://www.youtube.com/watch?v=u0vy1TT58TI"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/515960/"
    },
    {
        "id": 144,
        "title": "Anonymous Hacker Simulator",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2487060/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Walkthrough",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=3315504605"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2487060/"
    },
    {
        "id": 143,
        "title": "Terra Memoria",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1912750/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1912750/"
    },
    {
        "id": 142,
        "title": "Make Good Choices",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3410310/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [
            {
                "title": "The Watcher Guide",
                "url": "https://youtu.be/IAUj8tJMGps?si=hq6-RVF5ZGGnCEvR"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/3410310/"
    },
    {
        "id": 141,
        "title": "Evoland Legendary Edition",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1020470/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Feita por Fã (<a href=\"https://www.centraldetraducoes.net.br/2020/11/traducao-do-evoland-legendary-edition-pc.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1020470/"
    },
    {
        "id": 140,
        "title": "Enigma do Medo",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1507580/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "DICAS e RESPOSTAS para TODOS os Puzzles",
                "url": "https://youtu.be/B2IoJTF3eVo?si=AfzdrSDGNgJyo0AI"
            },
            {
                "title": "Localização de todos itens amaldiçoados",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=3377013568"
            },
            {
                "title": "Enigmas do Samuel",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=3382830804"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1507580/"
    },
    {
        "id": 139,
        "title": "CSS Clicker",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfFdB2XBlod4Fsjpz5CqXpC26JYy3cgMshFelLmBdqO9OSlg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://lyra.horse/css-clicker/"
    },
    {
        "id": 138,
        "title": "Turbo Dismount 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2280350/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "retired",
        "statusText": "Aposentado",
        "statusOverlay": "Aposentado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2280350/"
    },
    {
        "id": 137,
        "title": "PAYDAY 3",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1272080/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1272080/"
    },
    {
        "id": 136,
        "title": "Visage",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/594330/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Steam",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=2317074645"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/594330/"
    },
    {
        "id": 135,
        "title": "Craftmine",
        "image": "https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/marketplace/YTTHUMBAPRILFOOLS.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": "é uma versão do minecraft de 1 de abril de 2025 q é tipo um roguelite",
        "version": null,
        "storeUrl": "https://www.minecraft.net/pt-br/article/the-craftmine-update"
    },
    {
        "id": 134,
        "title": "Crime Scene Cleaner",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1040200/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "All Secrets and Cassette Locations",
                "url": "https://youtu.be/GBuIu8sc760?si=vONkF_9F91-CKzXm"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1040200/"
    },
    {
        "id": 133,
        "title": "The Dark Pictures Anthology: Little Hope",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1194630/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "All Collectibles [All Secrets & Framed Pictures]",
                "url": "https://youtu.be/adxJZyWolYo?si=aWGqq1frX-l-lL69"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1194630/"
    },
    {
        "id": 132,
        "title": "Brothers: A Tale of Two Sons Remake",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2153350/library_600x900.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2153350/"
    },
    {
        "id": 131,
        "title": "Max Manos",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3428620/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/3428620/"
    },
    {
        "id": 130,
        "title": "Pacific Drive",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1458140/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "How to open all the new goodies added in the Trips and Treasures Update",
                "url": "https://www.reddit.com/r/pacificDrive/comments/1gypxei/goldshells_and_you_how_to_open_all_the_new/?tl=pt-br&utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1458140/"
    },
    {
        "id": 129,
        "title": "SCHiM",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1519710/library_600x900.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "All 71 Lost SCHiM",
                "url": "https://youtu.be/6T_Fg6WLU6A?si=pU7xCIIaIA_7vGBY"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1519710/"
    },
    {
        "id": 128,
        "title": "Ghost on the Shore",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1211930/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1211930/"
    },
    {
        "id": 127,
        "title": "Rayman Raving Rabbids",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/15080/portrait.png",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/15080/"
    },
    {
        "id": 126,
        "title": "Half-Life 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/220/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Half-Life 2 Dublado PT-BR",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=3366526045"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/220/"
    },
    {
        "id": 125,
        "title": "Angry Birds Go",
        "image": "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co4gd5.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Audio Tour",
                "url": "https://youtube.com/playlist?list=PLY-EuCfOnRzkrdhJvpF0CaIKwrwBzSaus&si=TKrpuq1m2amWh8v7"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://apkpure.com/br/angry-birds-go/com.rovio.angrybirdsgo"
    },
    {
        "id": 124,
        "title": "Firewatch",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/383870/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://steamcommunity.com/sharedfiles/filedetails/?id=3239381666\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/383870/"
    },
    {
        "id": 123,
        "title": "LEGO Horizon Adventures",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2428810/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2428810/"
    },
    {
        "id": 122,
        "title": "RATUZ",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1550840/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1550840/RATUZ/"
    },
    {
        "id": 121,
        "title": "Feed Us",
        "image": "https://m.media-amazon.com/images/I/71Q5iFFY-SL._h1_.png",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://flashpointarchive.org/downloads/"
    },
    {
        "id": 120,
        "title": "Wheely",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/548330/portrait.png",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/548330/"
    },
    {
        "id": 119,
        "title": "Stimulation Clicker",
        "image": "https://neal.fun/link-images/stimulation-clicker.svg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://neal.fun/stimulation-clicker/"
    },
    {
        "id": 118,
        "title": "Chair Simulator",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1610870/library_600x900.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1610870/"
    },
    {
        "id": 117,
        "title": "Bubble People",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1710930/library_600x900.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1710930/"
    },
    {
        "id": 116,
        "title": "Summerland",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1444110/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://github.com/bbepis/XUnity.AutoTranslator\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1444110/"
    },
    {
        "id": 115,
        "title": "The Pilgrim",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1132880/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://github.com/bbepis/XUnity.AutoTranslator\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1132880/"
    },
    {
        "id": 114,
        "title": "The Murder of Sonic the Hedgehog",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2324650/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://github.com/bbepis/XUnity.AutoTranslator\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2324650/"
    },
    {
        "id": 113,
        "title": "The Backrooms Deluxe",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2558700/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/1fTvLasrL38?si=8KH5VZu1ckJtajPf"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2558700/"
    },
    {
        "id": 112,
        "title": "112 Operator",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/793460/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/793460/112_Operator/"
    },
    {
        "id": 111,
        "title": "03.04",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/952950/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "archived",
        "statusText": "Arquivado",
        "statusOverlay": "Arquivado",
        "translation": "Não possui",
        "guide": [],
        "review": "dropei, pois n tem traduçao e quando percebi ja tava bem avançado no jogo e n tava entendo nada da historia",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/952950/0304/"
    },
    {
        "id": 110,
        "title": "TRY AGAIN",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2448340/library_600x900_2x.jpg",
        "platform": [
            "pc"
        ],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://github.com/bbepis/XUnity.AutoTranslator\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2448340/TRY_AGAIN/"
    },
    {
        "id": 109,
        "title": "Roblox",
        "image": "https://cdn2.steamgriddb.com/thumb/4d3767318b2f7769ae8413ac4c145f57.jpg",
        "platform": [
            "pc",
            "android",
            "xbox-one"
        ],
        "status": "retired",
        "statusText": "Aposentado",
        "statusOverlay": "Aposentado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://www.roblox.com"
    },
    {
        "id": 108,
        "title": "Minecraft",
        "image": "https://cdn2.steamgriddb.com/thumb/a73027901f88055aaa0fd1a9e25d36c7.jpg",
        "platform": ["pc", "xbox360"],
        "status": "retired",
        "statusText": "Aposentado",
        "statusOverlay": "Aposentado",
        "translation": "Oficial",
        "guide": [],
        "review": "Já joguei no PC, Xbox 360, Xbox One e Celular",
        "version": null,
        "storeUrl": "https://www.minecraft.net/pt-br"
    },
    {
        "id": 107,
        "title": "Integer",
        "image": "https://img.itch.zone/aW1nLzQ5NjExNzcucG5n/original/%2B47CRP.png",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://aiet.itch.io/integer"
    },
    {
        "id": 106,
        "title": "Infinite Monkeys",
        "image": "https://img.itch.zone/aW1hZ2UvMTI4MTU4MS83NDkzODQ3LnBuZw==/original/mRvGHP.png",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://skullbutton.itch.io/infinite-monkeys"
    },
    {
        "id": 105,
        "title": "[Nightmare Files] Clap Clap",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2933290/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://github.com/bbepis/XUnity.AutoTranslator\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/0wjeN8PeoOM?si=p_LW7dbMEAKUNIkx"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2933290/Nightmare_Files_Clap_Clap/"
    },
    {
        "id": 104,
        "title": "Limbo",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/48000/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/48000/LIMBO/"
    },
    {
        "id": 103,
        "title": "I Didn't Cheat (v.1.2)",
        "image": "https://img.itch.zone/aW1nLzE4MjkyNjUzLnBuZw==/original/uUlJOy.png",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://flycatgames.itch.io/i-didnt-cheat"
    },
    {
        "id": 102,
        "title": "Mirror's Edge Catalyst",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1233570/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "GamesRadar+",
                "url": "https://www.gamesradar.com/mirrors-edge-catalyst-collectibles-guide/2/"
            },
            {
                "title": "3 Stars in Every Dash (All Dashes)",
                "url": "https://youtu.be/WJ3_n72NsEU?si=JPuOtXgo1rmX-rUC"
            },
            {
                "title": "All Fragile Delivery Opportunities",
                "url": "https://youtu.be/na7G-G63ab0?si=THTSk9mJGs9j2kCp"
            },
            {
                "title": "All Covert Delivery Opportunities",
                "url": "https://youtu.be/cZUdJSuQHgE?si=TX-jYTaJa9CfpF1g"
            },
            {
                "title": "All Diversion Opportunities",
                "url": "https://youtu.be/-IXMOEcI45k?si=fF_yKj6aAubZVCLP"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1233570/Mirrors_Edge_Catalyst/"
    },
    {
        "id": 101,
        "title": "Mirror's Edge",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/17410/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/sHqZjZmwoYg?si=qVNUf5LTpemdsrMO"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/17410/Mirrors_Edge/"
    },
    {
        "id": 100,
        "title": "The Punisher (2005)",
        "image": "https://cdn2.steamgriddb.com/thumb/9a44100c280747961774218de69d688c.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://www.centraldetraducoes.net.br/2015/10/traducao-do-the-punisher-pc.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://www.reddit.com/r/abandonware/comments/198lq2l/the_punisher_2006_download_link/"
    },
    {
        "id": 99,
        "title": "Superliminal",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1049410/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Steam",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=2279247827"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1049410/Superliminal/"
    },
    {
        "id": 98,
        "title": "Bituca Clicker",
        "image": "https://img.itch.zone/aW1nLzE3MDY2Mjc5LnBuZw==/original/jLbd6E.png",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://silvazuao.itch.io/bituca-clicker"
    },
    {
        "id": 97,
        "title": "Assassin's Creed: Director's Cut Edition",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/15100/portrait.png?t=1602600542",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": "*NÃO JOGUEI* pois nao tem traduçao, porem assisti o filme completo e legendado.\n\nFilme: https://youtu.be/p4pm8UA0G9k?si=jGpMKsUZNPxxP5l3",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/15100/Assassins_Creed_Directors_Cut_Edition/"
    },
    {
        "id": 96,
        "title": "Left 4 Dead 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/550/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/550/Left_4_Dead_2/"
    },
    {
        "id": 95,
        "title": "Left 4 Dead",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/500/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/500/Left_4_Dead/"
    },
    {
        "id": 94,
        "title": "Please Subscribe",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1826910/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1826910/Please_Subscribe_Streamer_Career/"
    },
    {
        "id": 93,
        "title": "Leaf Blower Revolution - Idle Game",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1468260/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1468260/Leaf_Blower_Revolution__Idle_Game/"
    },
    {
        "id": 92,
        "title": "DORONKO WANKO",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2512840/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2512840/DORONKO_WANKO/"
    },
    {
        "id": 91,
        "title": "Little Kitty, Big City",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1177980/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/0nQCnKh5Gaw?si=VbqncTFD74mjSdXH"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1177980/Little_Kitty_Big_City/"
    },
    {
        "id": 90,
        "title": "DEATH STRANDING DIRECTOR'S CUT",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/death-stranding/maps/world"
            },
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/death-stranding"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1850570/DEATH_STRANDING_DIRECTORS_CUT/"
    },
    {
        "id": 89,
        "title": "Youtubers Life 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1493760/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1493760/Youtubers_Life_2/"
    },
    {
        "id": 88,
        "title": "Alan Wake Remastered",
        "image": "https://cdn2.steamgriddb.com/thumb/f25f7b9e7ee973a3720e1261cf3a30c8.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/alan-wake"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.epicgames.com/pt-BR/p/alan-wake-remastered"
    },
    {
        "id": 87,
        "title": "Blair Witch",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1092660/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/l5CoiMx5N2U?si=fFDGL2_P6OXHg5dH"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1092660/Blair_Witch/"
    },
    {
        "id": 86,
        "title": "Assassin's Creed II",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/33230/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://www.centraldetraducoes.net.br/2025/02/traducao-do-assassins-creed-ii-pc.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/assassins-creed-2"
            },
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/assassins-creed-2"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/33230/Assassins_Creed_2/"
    },
    {
        "id": 85,
        "title": "Irmão do Jorel e o Jogo Mais Importante da Galáxia - Edição Completa",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1398910/library_600x900_brazilian_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://www.youtube.com/watch?v=ISUoFctpJpM"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1398910/Irmo_do_Jorel_e_o_Jogo_Mais_Importante_da_Galxia__Edio_Completa/"
    },
    {
        "id": 84,
        "title": "HITMAN World of Assassination",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659040/893b14fe999e64777ad2660cf88c52f1f403053f/library_capsule_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [
            {
                "title": "é coisa pra krl ent procura no youtube q ce vai achar",
                "url": "https://www.youtube.com/"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1659040/HITMAN_World_of_Assassination/"
    },
    {
        "id": 83,
        "title": "Kill It With Fire",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1179210/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/lz3WdPyOZKg?si=bOWf3X-FodeJp-AM"
            }
        ],
        "review": "esse video nao tem o modo halloween e o modo festa",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1179210/Kill_It_With_Fire/"
    },
    {
        "id": 82,
        "title": "Mortal Kombat 11 Ultimate",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/976310/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/mortal-kombat-11"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/976310/Mortal_Kombat_11/"
    },
    {
        "id": 81,
        "title": "Poppy Playtime (Capitulos 1-4)",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1721470/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": "n consegui completar o jogo pois o jogo trava em um parte do cap 4 e n tem o q eu faça, sempre crasha",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1721470/Poppy_Playtime/"
    },
    {
        "id": 80,
        "title": "Esquadrão Suicida: Mate a Liga da Justiça",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/315210/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/315210/Esquadro_Suicida_Mate_a_Liga_da_Justia/"
    },
    {
        "id": 79,
        "title": "Tomb Raider I•II•III Remastered",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2478970/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Stella's Site",
                "url": "https://tombraiders.net/stella/tomb1.html"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2478970/Tomb_Raider_IIII_Remastered_Starring_Lara_Croft/"
    },
    {
        "id": 78,
        "title": "There Is No Game: Wrong Dimension",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1240210/library_600x900.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://www.youtube.com/watch?v=xsJOAmGjM5s"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1240210/There_Is_No_Game_Wrong_Dimension/"
    },
    {
        "id": 77,
        "title": "Red Dead Redemption 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://rdr2map.com/"
            },
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/red-dead-redemption-2"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/"
    },
    {
        "id": 76,
        "title": "The Outer Worlds: Spacer's Choice Edition",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1920490/library_600x900.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/the-outer-worlds"
            },
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-outer-worlds"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1920490/The_Outer_Worlds_Spacers_Choice_Edition/"
    },
    {
        "id": 75,
        "title": "Grand Theft Auto IV: Complete Edition",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/12210/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://www.centraldetraducoes.net.br/2023/04/traducao-do-gta-iv-complete-edition-pc.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/grand-theft-auto-4"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/12210/Grand_Theft_Auto_IV_The_Complete_Edition/"
    },
    {
        "id": 74,
        "title": "Max Payne",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/12140/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Feita por Fã (<a href=\"https://steamcommunity.com/sharedfiles/filedetails/?id=945245625\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/max-payne"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://steamcommunity.com/app/12140"
    },
    {
        "id": 73,
        "title": "Days Gone",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1259420/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/days-gone"
            },
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/days-gone/"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1259420/Days_Gone/"
    },
    {
        "id": 72,
        "title": "Borderlands 2: Game of the Year Edition",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/49520/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://www.centraldetraducoes.net.br/2014/12/traducao-do-borderlands-2-goty-edition-pc.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/borderlands-2"
            },
            {
                "title": "Glitch de invencibilidade com o Krieg",
                "url": "https://www.youtube.com/watch?v=mSOUJfy3xLo"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/49520/Borderlands_2/"
    },
    {
        "id": 71,
        "title": "Borderlands Game of the Year Enhanced",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/729040/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://steamcommunity.com/sharedfiles/filedetails/?id=2329586285\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/borderlands"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/729040/Borderlands_Game_of_the_Year_Enhanced/"
    },
    {
        "id": 70,
        "title": "Microcivilization",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1822550/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1822550/Microcivilization/"
    },
    {
        "id": 69,
        "title": "DON'T SCREAM",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2497900/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2497900/DONT_SCREAM/"
    },
    {
        "id": 68,
        "title": "Super Mario Bros. Wonder",
        "image": "https://cdn2.steamgriddb.com/thumb/66da3b21fe18692332284c64e08b8e02.jpg",
        "platform": ["nintendo-switch"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/super-mario-bros-wonder"
            },
            {
                "title": "Youtube",
                "url": "https://youtu.be/A_qMu9ClfC8"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://www.nintendo.com/pt-br/store/products/super-mario-bros-wonder-switch/"
    },
    {
        "id": 67,
        "title": "God of War (2018)",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/god-of-war-2018"
            },
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/god-of-war-2018"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1593500/God_of_War/"
    },
    {
        "id": 66,
        "title": "SUPERHOT: MIND CONTROL DELETE",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/690040/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Oficial",
        "guide": [],
        "review": "dropei, muito enjoativo e repetitivo",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/690040/SUPERHOT_MIND_CONTROL_DELETE/"
    },
    {
        "id": 65,
        "title": "SUPERHOT",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/322500/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/5PkogxoWGDk?si=Q5RwEBwPW3CbVVZ7"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/322500/SUPERHOT/"
    },
    {
        "id": 64,
        "title": "Marvel's Spider-Man 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2651280/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/marvels-spider-man-2/maps/new-york"
            }
        ],
        "review": "fiz tudo (tudo q da pra pegar já tá no map genie). fui jogar o ng+  pra fazer 100%, mas desisti, pois basicamente teria q ZERAR, mais 2 vezes o ng+, no total 3 jogatinas (1 normal e 2 no ng+)",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2651280/Marvels_SpiderMan_2/"
    },
    {
        "id": 63,
        "title": "Marvel's Spider-Man: Miles Morales",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817190/library_600x900.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/marvels-spider-man-miles-morales/maps/manhattan"
            }
        ],
        "review": "na primeira run eu fiz tudo q dava (TUDO MSM) e na segunda run eu fiz apenas o necessario para concluir o q faltava (as coisas q só desbloqueiam no new game plus).\ne só pra dar uma brisa a mais botei na dificuldade maxima (dificuldade supremo)",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1817190/Marvels_SpiderMan_Miles_Morales/"
    },
    {
        "id": 62,
        "title": "Marvel's Spider-Man Remastered",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/marvels-spider-man/maps/manhattan"
            },
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/marvels-spider-man/"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1817070/Marvels_SpiderMan_Remastered/"
    },
    {
        "id": 61,
        "title": "The Evil Within 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/601430/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Steam",
                "url": "https://steamcommunity-com.translate.goog/sharedfiles/filedetails/?id=2094826878&_x_tr_sl=auto&_x_tr_tl=pt&_x_tr_hl=pt-BR&_x_tr_pto=wapp"
            },
            {
                "title": "Sem Spoilers",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=1181659147"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/601430/The_Evil_Within_2/"
    },
    {
        "id": 60,
        "title": "The Evil Within",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/268050/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://steamcommunity.com/app/268050/discussions/0/492379159715516576/\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "Steam",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=332983566"
            },
            {
                "title": "The Assignment - Chapter 1",
                "url": "https://youtu.be/LKt23YW8We0?si=tujuLf_HwFgbLhBZ"
            },
            {
                "title": "The Assignment - Chapter 2",
                "url": "https://youtu.be/huSXqZFa87A?si=_2GzkPsbF7pPZRqv"
            },
            {
                "title": "The Consequence - Chapter 3",
                "url": "https://youtu.be/315R9VqgzbM?si=aNQNZX5ei_H_TJLz"
            },
            {
                "title": "The Consequence - Chapter 4",
                "url": "https://youtu.be/LapjfiNA5to?si=IIr2OZyBwpb1vqJe"
            },
            {
                "title": "The Executioner",
                "url": "https://youtu.be/zpDBFPD9uF4?si=ZC63ApIg2ZOX2BF4"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/268050/The_Evil_Within/"
    },
    {
        "id": 59,
        "title": "Lego Star Wars: The Skywalker Saga",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/920210/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-star-wars-the-skywalker-saga"
            }
        ],
        "review": "EU NÃO TERMINEI ESSA PORRA, POIS O MEU SAVE CORROMPEU! PERDI UMA SEMANA JOGANDO A TARDE TODA ATÉ UMAS ONZE DA NOITE!",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/920210/LEGO_Star_Wars_A_Saga_Skywalker/"
    },
    {
        "id": 58,
        "title": "The LEGO Movie 2 Videogame",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/881320/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/pXzvwc_5row?si=AFUUf9Q6ks7YHk9L"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/881320/The_LEGO_Movie_2_Videogame/"
    },
    {
        "id": 57,
        "title": "LEGO DC Super-Villains",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/829110/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-dc-super-villains"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/829110/LEGO_DC_SuperVillains/"
    },
    {
        "id": 56,
        "title": "LEGO The Incredibles",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/818320/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/818320/LEGO_The_Incredibles/"
    },
    {
        "id": 55,
        "title": "LEGO Marvel Super Heroes 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/647830/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-marvel-super-heroes-2"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/647830/LEGO_Marvel_Super_Heroes_2/"
    },
    {
        "id": 54,
        "title": "The LEGO NINJAGO Movie Video Game",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/640590/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-lego-ninjago-movie-video-game"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/640590/The_LEGO_NINJAGO_Movie_Video_Game/"
    },
    {
        "id": 53,
        "title": "LEGO Star Wars: The Force Awakens",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/438640/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Steam",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=712686492"
            },
            {
                "title": "Curiosidades",
                "url": "https://youtube.com/playlist?list=PLKnK4jzjfh6ZhWm80tBZqQtrfulZ3mEfb&si=txF0ghjibYCaVE4q"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/438640/LEGO_STAR_WARS_The_Force_Awakens/"
    },
    {
        "id": 52,
        "title": "LEGO Marvel's Avengers",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/405310/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-marvel-avengers"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/405310/LEGO_MARVELs_Avengers/"
    },
    {
        "id": 51,
        "title": "LEGO Jurassic World",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/352400/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-jurassic-world"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/352400/LEGO_Jurassic_World/"
    },
    {
        "id": 50,
        "title": "LEGO The Hobbit",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/285160/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-the-hobbit"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/285160/LEGO_The_Hobbit/"
    },
    {
        "id": 49,
        "title": "The LEGO Movie - Videogame",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/267530/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-lego-movie-video-game"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/267530/The_LEGO_Movie__Videogame/"
    },
    {
        "id": 48,
        "title": "LEGO Marvel Super Heroes",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/249130/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-marvel-super-heroes"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/249130/LEGO_Marvel_Super_Heroes/"
    },
    {
        "id": 47,
        "title": "LEGO The Lord of the Rings",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/214510/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-lord-of-the-rings"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/214510/LEGO_The_Lord_of_the_Rings/"
    },
    {
        "id": 46,
        "title": "LEGO Batman 2 DC Super Heroes",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/213330/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-batman-2-dc-super-heroes"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/213330/LEGO_Batman_2_DC_Super_Heroes/"
    },
    {
        "id": 45,
        "title": "LEGO Pirates of the Caribbean: The Video Game",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/311770/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Steam",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=2350147277"
            },
            {
                "title": "Youtube",
                "url": "https://youtube.com/playlist?list=PLYpDU5ElRBfnddOzrQnIBPr45qyAsAttH&si=YvhX7srRyECIeeD2"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://www.gog.com/en/game/lego_pirates_of_the_caribbean_the_video_game"
    },
    {
        "id": 44,
        "title": "LEGO Star Wars III - The Clone Wars",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/32510/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [
            {
                "title": "Steam",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=2280643595"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/32510/LEGO_Star_Wars_III__The_Clone_Wars/"
    },
    {
        "id": 43,
        "title": "LEGO Harry Potter Collection",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2950340/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2950340/LEGO_Harry_Potter_Collection/"
    },
    {
        "id": 42,
        "title": "LEGO Batman",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/21000/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://steamcommunity.com/app/21000/discussions/0/3117032860248216877/\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-batman-the-videogame"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/21000/LEGO_Batman_The_Videogame/"
    },
    {
        "id": 41,
        "title": "LEGO Indiana Jones: The Original Adventures",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/32330/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Não possui",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-indiana-jones-the-original-adventures"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/32330/LEGO_Indiana_Jones_The_Original_Adventures/"
    },
    {
        "id": 40,
        "title": "LEGO Star Wars - The Complete Saga",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/32440/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Não possui",
        "guide": [
            {
                "title": "Guia Steam (Traduzido por mim)",
                "url": "https://finurabr.github.io/GUIA-LEGO-Star-Wars-The-Complete-Saga/"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/32440/LEGO_Star_Wars__The_Complete_Saga/"
    },
    {
        "id": 39,
        "title": "LEGO 2K Drive",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1451810/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-2k-drive"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1451810/LEGO_2K_Drive/"
    },
    {
        "id": 38,
        "title": "LEGO Bricktales",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1898290/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/Ww9lEIUTW8Y?si=YYnw14QWeZUQq025"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1898290/LEGO_Bricktales/"
    },
    {
        "id": 37,
        "title": "Lego Brawls",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1731460/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "The Gamer",
                "url": "https://www.thegamer.com/lego-brawls-beginner-tips/"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1731460/LEGO_Brawls/"
    },
    {
        "id": 36,
        "title": "LEGO Builder’s Journey",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1544360/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/P0geESHnvqk?si=cqow11qaIcopnZls"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1544360/LEGO_Builders_Journey/"
    },
    {
        "id": 35,
        "title": "LEGO Worlds",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/332310/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-worlds"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/332310/LEGO_Worlds/"
    },
    {
        "id": 34,
        "title": "Lego City Undercover",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578330/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-city-undercover"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/578330/LEGO_City_Undercover/"
    },
    {
        "id": 33,
        "title": "LEGO Juniors Create & Cruise",
        "image": "https://assets-prd.ignimgs.com/2023/02/01/legojuniors-1675238408104.jpg?crop=1%3A1%2Csmart&format=jpg&auto=webp&quality=80",
        "platform": ["android"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://www.google.com/search?q=lego+juniors+create+%26+cruise+apk&oq=Lego+Juniors+Create+%26+Cruise&gs_lcrp=EgRlZGdlKgcIARAAGIAEMgkIABBFGDkYgAQyBwgBEAAYgAQyBwgCEAAYgAQyBwgDEAAYgAQyCAgEEAAYFhgeMggIBRAAGBYYHjIICAYQABgWGB4yCAgHEAAYFhge0gEIMjA2NmowajSoAgCwAgE&sourceid=chrome&ie=UTF-8"
    },
    {
        "id": 32,
        "title": "The Beginner's Guide",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/303210/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://www.mediafire.com/download/a93sn4ffpa9fj48/Tradu%C3%A7%C3%A3o+-+The+Beginner%27s+Guide+-+pt-BR.rar\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/DatJlgN8ZqE?si=lyrIv0VjCmlX6E-c"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/303210/The_Beginners_Guide/"
    },
    {
        "id": 31,
        "title": "The Stanley Parable: Ultra Deluxe",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1703340/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-stanley-parable"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1703340/The_Stanley_Parable_Ultra_Deluxe/"
    },
    {
        "id": 30,
        "title": "The Walking Dead: Survival Instinct",
        "image": "https://cdn2.steamgriddb.com/thumb/add08f927c0dec3bdf1f6d3af8db187e.jpg",
        "platform": ["pc"],
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Feita por Fã (<a href=\"https://tribogamer.com/traducoes/194_traducao-do-the-walking-dead-survival-instinct-para-portugues-do-brasil.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-walking-dead-survival-instinct"
            }
        ],
        "review": "Não consegui terminar o jogo, pois ele começou a travar repetidamente em uma parte específica, o que me impediu de continuar.",
        "version": null,
        "storeUrl": "https://steamunlocked.org/the-walking-dead-survival-instinct-free-download/"
    },
    {
        "id": 29,
        "title": "The Walking Dead: The Telltale Definitive Series",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1449690/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-walking-dead-game"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1449690/The_Walking_Dead_The_Telltale_Definitive_Series/"
    },
    {
        "id": 28,
        "title": "The Witcher 3: Wild Hunt",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-witcher-3-wild-hunt"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/"
    },
    {
        "id": 27,
        "title": "The Witcher 2: Assassins of Kings Enhanced Edition",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/20920/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/witcher-2"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/20920/The_Witcher_2_Assassins_of_Kings_Enhanced_Edition/"
    },
    {
        "id": 26,
        "title": "Death's Door",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/894020/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://www.youtube.com/playlist?list=PLRYiNkjGrK9NIBzM-v2qP8e9Fq5pIAeJj"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/894020/Deaths_Door/"
    },
    {
        "id": 25,
        "title": "Tom Clancy’s The Division 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2221490/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-division-2"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2221490/Tom_Clancys_The_Division_2/"
    },
    {
        "id": 24,
        "title": "Tom Clancy’s The Division",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/365590/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/the-division"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/365590/Tom_Clancys_The_Division/"
    },
    {
        "id": 23,
        "title": "Watch Dogs: Legion",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2239550/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/watch-dogs-legion"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2239550/Watch_Dogs_Legion/"
    },
    {
        "id": 22,
        "title": "Watch_Dogs 2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/447040/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/watch-dogs-2"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/447040/Watch_Dogs_2/"
    },
    {
        "id": 21,
        "title": "Watch_Dogs",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/243470/portrait.png?t=1739177057",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/watch-dogs"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/243470/Watch_Dogs/"
    },
    {
        "id": 20,
        "title": "Wolfenstein: Youngblood",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1056960/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/wolfenstein-youngblood"
            },
            {
                "title": "Youtube - All Collectibles",
                "url": "https://www.youtube.com/playlist?list=PLRYiNkjGrK9NpwSmplqWVpbMA0zU-M_oG"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1056960/Wolfenstein_Youngblood/"
    },
    {
        "id": 19,
        "title": "Wolfenstein II: The New Colossus",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/612880/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/wolfenstein-2-the-new-colossus"
            },
            {
                "title": "Youtube - All Collectibles",
                "url": "https://www.youtube.com/watch?v=5zckI-DjiQM"
            },
            {
                "title": "Youtube - DLCs",
                "url": "https://www.youtube.com/playlist?list=PL61FH1Fo4C7FMOlmprE1eATSRcXyH0MEs"
            },
            {
                "title": "Youtube - Filme dublado PT-BR (com as duas linhas, Fergus e Wyatt)",
                "url": "https://www.youtube.com/watch?v=WtxMM8RAjQ0"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/612880/Wolfenstein_II_The_New_Colossus/"
    },
    {
        "id": 18,
        "title": "Wolfenstein: The New Order",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/201810/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://www.centraldetraducoes.net.br/2014/07/traducao-do-wolfenstein-new-order-pc.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/wolfenstein-new-order"
            },
            {
                "title": "Youtube",
                "url": "https://www.youtube.com/watch?v=0e1xVoOuz2s"
            },
            {
                "title": "Youtube - All Weapon Upgrades",
                "url": "https://www.youtube.com/watch?v=nI2a6Okahuo"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/201810/Wolfenstein_The_New_Order/"
    },
    {
        "id": 17,
        "title": "Wolfenstein: The Old Blood",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/350080/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://tribogamer.com/traducoes/304_traducao-do-wolfenstein-the-old-blood-para-portugues-do-brasil.html\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://www.youtube.com/watch?v=XNxTpDNXjbQ"
            },
            {
                "title": "Youtube - Nightmare Mazes",
                "url": "https://steamcommunity.com/sharedfiles/filedetails/?id=509836028"
            },
            {
                "title": "Fandom",
                "url": "https://wolfenstein.fandom.com/wiki/Wolfenstein_Wiki"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/350080/Wolfenstein_The_Old_Blood/"
    },
    {
        "id": 16,
        "title": "Pool Cleaning Simulator",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2165620/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/5cQSshXDVVI?si=KhJb48PP31v0BsZn"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2165620/Pool_Cleaning_Simulator/"
    },
    {
        "id": 15,
        "title": "Strike Force 2 - Terrorist Hunt",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1375260/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Não possui",
        "guide": [
            {
                "title": "Youtube",
                "url": "https://youtu.be/WRuD6oYuGEw?si=gnuxFFLB6lXcAykM"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1375260/Strike_Force_2__Terrorist_Hunt_Enhanced_Edition/?curator_clanid=5467829"
    },
    {
        "id": 14,
        "title": "Boti: Byteland Overclocked",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2161050/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2161050/Boti_Byteland_Overclocked/"
    },
    {
        "id": 13,
        "title": "Confabulation: Homestead",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2355350/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://github.com/bbepis/XUnity.AutoTranslator\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2355350/Confabulation_Homestead/"
    },
    {
        "id": 12,
        "title": "接触: 第一章(The Encounter: Chapter One)",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2498580/library_600x900_2x.jpg?t=1694339151",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2498580/_The_Encounter_Chapter_One/"
    },
    {
        "id": 11,
        "title": "Horizon Chase 2",
        "image": "https://cdn2.steamgriddb.com/thumb/add500717355718ecf5a28ddfb85d1a1.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://rawg.io/games/horizon-chase-2"
    },
    {
        "id": 10,
        "title": "Horizon Chase Turbo",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/389140/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Knoef Trophy Guides",
                "url": "https://knoef.info/trophy-guides/ps4-guides/horizon-chase-turbo-trophy-guide/"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/389140/Horizon_Chase_Turbo/"
    },
    {
        "id": 9,
        "title": "The Knight Witch",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1872680/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Knoef Trophy Guides",
                "url": "https://knoef.info/trophy-guides/ps5/the-knight-witch-trophy-guide/"
            }
        ],
        "review": "",
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1872680/The_Knight_Witch/"
    },
    {
        "id": 8,
        "title": "DREDGE",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1562430/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/dredge"
            },
            {
                "title": "Map Genie",
                "url": "https://mapgenie.io/dredge"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1562430/DREDGE/"
    },
    {
        "id": 7,
        "title": "Killer Frequency",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1903620/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "Gamer Journalist",
                "url": "https://gamerjournalist.com/how-to-save-everyone-in-killer-frequency-full-walkthrough/"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1903620/Killer_Frequency/"
    },
    {
        "id": 6,
        "title": "Trepang2",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1164940/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://www.nexusmods.com/trepang2/mods/60\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1164940/Trepang2/"
    },
    {
        "id": 5,
        "title": "ULTRAKILL",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1229490/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://github.com/ClearwaterUK/UltrakULL\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "Fandom",
                "url": "https://ultrakill.fandom.com/wiki/"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1229490/ULTRAKILL/"
    },
    {
        "id": 4,
        "title": "Yakuza Kiwami",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/834530/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://brazilalliance.com.br\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "GameFAQs",
                "url": "https://gamefaqs.gamespot.com/ps4/181171-yakuza-kiwami/faqs/75194/introduction"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/834530/Yakuza_Kiwami"
    },
    {
        "id": 3,
        "title": "Yakuza 0",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/638970/library_600x900_2x.jpg?t=1741340656",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://brazilalliance.com.br\" target=\"_blank\" rel=\"noopener noreferrer\">baixar</a>)",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/yakuza-0"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/638970/Yakuza_0"
    },
    {
        "id": 2,
        "title": "Yakuza: Like a Dragon",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1235140/library_600x900_2x.jpg?t=1741337797",
        "platform": ["pc"],
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/yakuza-like-a-dragon"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/1235140/Yakuza_Like_a_Dragon"
    },
    {
        "id": 1,
        "title": "Lego Batman 3: Beyond Gotham",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/313690/library_600x900_2x.jpg",
        "platform": ["pc"],
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Oficial",
        "guide": [
            {
                "title": "IGN",
                "url": "https://www.ign.com/wikis/lego-batman-3-beyond-gotham"
            }
        ],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/313690/LEGO_Batman_3_Beyond_Gotham/"
    }
];