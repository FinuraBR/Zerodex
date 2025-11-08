// ===================================================================================
// === MEU ZERODEX - BANCO DE DADOS DE JOGOS (database.js) ===========================
// ===================================================================================

/*
    =============================================================================
    === GUIA E TEMPLATE PARA ADICIONAR UM NOVO JOGO ===============================
    =============================================================================

    INSTRUÇÕES: Para adicionar um novo jogo, copie o "Template Limpo" abaixo e cole-o
    NO TOPO da lista 'gamesData'. Preencha os campos de acordo com a explicação de cada
    propriedade abaixo.

    --- EXPLICAÇÃO DE CADA CAMPO ---

    id: (obrigatório)
        O número único do jogo. O jogo mais recente deve ter o maior número.
        Exemplo: Se o último jogo da lista é o ID 213, o novo jogo será o ID 214.

    title: (obrigatório)
        O nome exato do jogo.
        Exemplo: "The Legend of Zelda: Breath of the Wild"

    image: (obrigatório)
        O caminho para a imagem da capa. Pode ser um link da web (URL) ou um arquivo local.
        Exemplo (URL): "https://cdn.artstation.com/..."
        Exemplo (Local): "imagens/zelda_botw.jpg"

    platform: (obrigatório)
        A plataforma onde você jogou, usada para os filtros. USE LETRAS MINÚSCULAS.
        Exemplos: "pc", "switch", "playstation-5", "celular"

    storeUrl: (opcional)
        O link para a página do jogo na loja (Steam, PSN, eShop, etc.).
        Se não houver link, use o valor 'null'.
        Exemplo: "https://store.steampowered.com/app/..."

    status: (obrigatório)
        Uma classe interna que define a cor e o filtro do status. Escolha uma das opções:
        "completed-100", "completed", "playing", "retired", "archived", "abandoned"

    statusText: (obrigatório)
        O texto curto que aparece no "badge" do card na página de catálogo.
        Exemplos: "100%", "Finalizado", "Jogando", "Aposentado", "Arquivado", "Abandonado"

    statusOverlay: (obrigatório)
        O texto mais descritivo que aparece quando você passa o mouse sobre o card.
        Exemplos: "100% Concluído", "Finalizado", "Jogando Atualmente", "Aposentado", "Arquivado", "Abandonado"

    translation: (obrigatório)
        Informação sobre a tradução do jogo. Pode conter HTML para links.
        Exemplo (texto): "Oficial" ou "Não possui"
        Exemplo (HTML): "Feita por Fã (<a href='URL_DO_PATCH' target='_blank'>baixar</a>)"

    guide: (opcional)
        Uma lista de links de guias que você usou. Se não usou nenhum, deixe a lista vazia: []
        Exemplo: [ { title: "IGN", url: "https://ign.com/..." } ]

    review: (opcional)
        Seu comentário pessoal ou mini-review sobre o jogo.
        Se não tiver um comentário, use o valor 'null'.

    version: (opcional)
        Para indicar se é uma versão especial do jogo.
        Se for a versão padrão/completa, use 'null'.
        Exemplos: "Demo", "Acesso Antecipado", "Beta"


    =============================================================================
    --- Template Limpo para Copiar ---
    =============================================================================
    {
        id: , // Coloque o próximo ID aqui (verifique o último jogo da lista)
        title: "", // Nome do jogo
        image: "imagens/", // Caminho local (imagens/jogo.jpg) ou URL da web (https://...)
        platform: "", // Plataforma (pc, switch, etc. - em minúsculas)
        storeUrl: null, // Link para a loja (Steam, etc.) ou null se não houver
        status: "", // Classe do status (completed-100, completed, playing, retired, archived, abandoned)
        statusText: "", // Texto curto do status (100%, Finalizado, Jogando, etc.)
        statusOverlay: "", // Texto longo do status (100% Concluído, Finalizado, etc.)
        translation: "Oficial", // "Oficial", "Não possui", ou "Feita por Fã (<a href='...' target='_blank'>baixar</a>)"
        guide: [], // Lista de guias. Deixe como [] se não usou nenhum.
        review: null, // Seu comentário pessoal sobre o jogo, ou null
        version: null // Versão especial (Demo, Acesso Antecipado, Beta), ou null
    },

*/

// =============================================================================
// === BANCO DE DADOS DE JOGOS =================================================
// =============================================================================
// ADICIONE NOVOS JOGOS NO TOPO DESTA LISTA PARA MANTÊ-LOS EM ORDEM DE ID DECRESCENTE.

const gamesData = [
    {
        "id": 4, 
        "title": "Yakuza Kiwami", 
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/834530/library_600x900_2x.jpg", 
        "platform": "pc",
        "status": "completed", 
        "statusText": "Finalizado", 
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://brazilalliance.com.br\" target=\"_blank\">baixar</a>)",
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
        "platform": "pc",
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://brazilalliance.com.br\" target=\"_blank\">baixar</a>)",
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
        "platform": "pc",
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
        id: 1,
        title: "Lego Batman 3: Beyond Gotham",
        image: "imagens/Lego Batman 3 Beyond Gotham.jpg",
        platform: "pc",
        storeUrl: "https://store.steampowered.com/app/313690/LEGO_Batman_3_Beyond_Gotham/",
        status: "completed-100",
        statusText: "100%",
        statusOverlay: "100% Concluído",
        translation: "Oficial",
        guide: [
            { title: "IGN", url: "https://www.ign.com/wikis/lego-batman-3-beyond-gotham" }
        ],
        review: null,
        version: null
    }
];