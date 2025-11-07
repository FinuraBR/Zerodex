// js/database.js

/*
    =============================================================================
    === TEMPLATE COMPLETO PARA ADICIONAR UM NOVO JOGO ===========================
    =============================================================================

    INSTRUÇÕES:
    1. Copie todo o bloco de código abaixo (começando com a chave '{' e terminando com '},').
    2. Cole-o no final da lista 'gamesData', logo após o último jogo.
    3. Preencha as informações entre aspas ou altere os valores.

    {
        id: _ID_,                                    // O número único do jogo (o mais recente tem o maior número).
        title: "_NOME_DO_JOGO_",                     // O nome exato do jogo.
        image: "imagens/_NOME_DA_IMAGEM_.jpg",       // O caminho para a imagem da capa na pasta 'imagens'.
        platform: "_PLATAFORMA_",                    // A plataforma para o filtro (pc, celular, nintendo64, switch). Letras minúsculas.
        storeUrl: "_LINK_PARA_A_PAGINA_DO_JOGO_",    // Caso não link coloque "null".

        // --- Status do Jogo ---
        status: "_CLASSE_DO_STATUS_",                // A classe do CSS para a cor. Opções: completed-100, completed, playing, retired, archived, abandoned.
        statusText: "_TEXTO_DO_BADGE_",              // O texto que aparece no badge pequeno. Ex: "100%", "Finalizado", "Jogando", "Aposentado", "Arquivado", "Abandonado".
        statusOverlay: "_TEXTO_DO_OVERLAY_",         // O texto que aparece no overlay. Ex: "100% Concluído", "Finalizado", "Jogando Atualmente", "Aposentado", "Arquivado", "Abandonado".

        // --- Informações Adicionais ---
        translation: "_TRADUCAO_",                   // Pode ser texto simples como "Oficial", "Não possui", "Feito por fã (<a href='#' target='_blank'>baixar</a>)".
        guide: [                                     // Uma lista de guias. Pode ser vazia [].
            { title: "_NOME_DO_GUIA_1_", url: "_LINK_DO_GUIA_1_" },
            { title: "_NOME_DO_GUIA_2_", url: "_LINK_DO_GUIA_2_" }
        ],
        review: "_SEU_COMENTARIO_PESSOAL_",          // Seu comentário pessoal. Use null se não houver comentário.
        version: "_VERSAO_DO_JOGO_"                  // Indicador de versão. Use null se for a versão padrão, ou "Demo", "Acesso Antecipado".
    },

    Template:

    {
        id: ,
        title: "",
        image: "imagens/",
        platform: "",
        storeUrl: "",
        status: "",
        statusText: "",
        statusOverlay: "",
        translation: "",
        guide: [
            { title: "", url: "" }
        ],
        review: null,
        version: null
    },

*/

// =============================================================================
// === LISTA DE JOGOS ==========================================================
// =============================================================================

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