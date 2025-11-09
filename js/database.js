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
        "id": 69,
        "title": "DON'T SCREAM",
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2497900/library_600x900_2x.jpg",
        "platform": "pc",
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
        "platform": "nintendo-switch",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2651280/6fa28738ef8cde05390d3f0a9b942185b5763cbd/library_600x900_2x.jpg",
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://steamcommunity.com/app/268050/discussions/0/492379159715516576/\" target=\"_blank\">baixar</a>)",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
        "status": "completed",
        "statusText": "Finalizado",
        "statusOverlay": "Finalizado",
        "translation": "Feita por Fã (<a href=\"https://steamcommunity.com/app/21000/discussions/0/3117032860248216877/\" target=\"_blank\">baixar</a>)",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1451810/f9cca9fc3e0515582021d1a403f3efe442df5079/library_600x900_2x.jpg",
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "pc",
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
        "platform": "android",
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
        "platform": "pc",
        "status": "completed-100",
        "statusText": "100%",
        "statusOverlay": "100% Concluído",
        "translation": "Feita por Fã (<a href=\"https://www.mediafire.com/download/a93sn4ffpa9fj48/Tradu%C3%A7%C3%A3o+-+The+Beginner%27s+Guide+-+pt-BR.rar\" target=\"_blank\">baixar</a>)",
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
        "platform": "pc",
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
        "platform": "pc",
        "status": "abandoned",
        "statusText": "Abandonado",
        "statusOverlay": "Abandonado",
        "translation": "Feita por Fã (<a href=\"https://tribogamer.com/traducoes/194_traducao-do-the-walking-dead-survival-instinct-para-portugues-do-brasil.html\" target=\"_blank\">baixar</a>)",
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
        "platform": "pc",
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
        "image": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/fe26986a2bd1601004ef0e4e1dfadd02948e3897/library_600x900_2x.jpg",
        "platform": "pc",
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
        "platform": "pc",
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
