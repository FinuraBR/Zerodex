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
        "id": 26,
        "title": "Death's Door",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/894020/library_600x900_2x.jpg",
        "platform": "pc",
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
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2221490/8517c0415397d69e5c0e818eb1f2eb0ae83806b2/library_600x900_2x.jpg",
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/243470/hero_capsule.jpg?t=1739177057",
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://www.centraldetraducoes.net.br/2014/07/traducao-do-wolfenstein-new-order-pc.html\" target=\"_blank\">baixar</a>)",
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
        "platform": "pc",
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://tribogamer.com/traducoes/304_traducao-do-wolfenstein-the-old-blood-para-portugues-do-brasil.html\" target=\"_blank\">baixar</a>)",
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
        "platform": "pc",
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
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1375260/3cd0134dd37dce609d0087fa09a7785feedb3823/library_600x900_2x.jpg",
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://github.com/bbepis/XUnity.AutoTranslator\" target=\"_blank\">baixar</a>)",
        "guide": [],
        "review": null,
        "version": null,
        "storeUrl": "https://store.steampowered.com/app/2355350/Confabulation_Homestead/"
    },
    {
        "id": 12,
        "title": "接触: 第一章(The Encounter: Chapter One)",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2498580/library_600x900_2x.jpg?t=1694339151",
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
    "platform": "pc",
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
    "platform": "pc",
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
    "platform": "pc",
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
    "platform": "pc",
    "status": "completed",
    "statusText": "Finalizado",
    "statusOverlay": "Finalizado",
    "translation": "Feita por Fã (<a href=\"https://www.nexusmods.com/trepang2/mods/60\" target=\"_blank\">baixar</a>)",
    "guide": [],
    "review": null,
    "version": null,
    "storeUrl": "https://store.steampowered.com/app/1164940/Trepang2/"
    },
    {
    "id": 5,
    "title": "ULTRAKILL",
    "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1229490/library_600x900_2x.jpg",
    "platform": "pc",
    "status": "completed",
    "statusText": "Finalizado",
    "statusOverlay": "Finalizado",
    "translation": "Feita por Fã (<a href=\"https://github.com/ClearwaterUK/UltrakULL\" target=\"_blank\">baixar</a>)",
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
    "id": 1,
    "title": "Lego Batman 3: Beyond Gotham",
    "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/313690/library_600x900_2x.jpg",
    "platform": "pc",
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
