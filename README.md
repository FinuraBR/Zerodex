# Zerodex

Bem-vindo ao Zerodex, um catálogo pessoal de jogos projetado para registrar e exibir todas as minhas jornadas no universo dos games. Inspirado em plataformas como o Backloggd, este projeto é uma fusão de duas paixões: programação e videogames.

**[➡️ Acesse a versão ao vivo aqui!](https://finurabr.github.io/Zerodex/)**

![Prévia do Zerodex em tema escuro e claro](https://github.com/user-attachments/assets/7b1a97ca-aa30-4205-9d79-c8f3b0a7b497)

## 🎮 Sobre o Projeto

O Zerodex é um site estático, construído com HTML, CSS e JavaScript puros, que serve como uma vitrine interativa para os jogos que joguei. Ele organiza os títulos em categorias, permite a filtragem e a busca em um catálogo completo e apresenta estatísticas visuais sobre os jogos finalizados. O coração do projeto é um único arquivo `database.js`, que funciona como um banco de dados local, tornando a manutenção e a atualização do conteúdo simples e direta.

## ✨ Funcionalidades Principais

-   **Catálogo de Jogos Dinâmico**: Todos os jogos são carregados a partir de um arquivo central `database.js`, atuando como a única fonte de verdade.
-   **Página Inicial Organizada**: Apresenta os jogos em "estantes" separadas por status (Jogando, Finalizado, 100%, Arquivado, etc.).
-   **Filtragem e Ordenação Avançadas**: Na página "Meus Jogos", é possível filtrar por plataforma e ordenar por data de adição ou título (A-Z, Z-A).
-   **Busca Instantânea**: Pesquise em todo o catálogo por nome do jogo com resultados em tempo real.
-   **Tema Claro e Escuro**: Um botão de alternância de tema persistente para se adequar à sua preferência.
-   **Design Responsivo**: A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.
-   **Performance Otimizada**: Implementa lazy loading para as imagens dos jogos, garantindo um carregamento inicial rápido.
-   **Estatísticas Visuais**: A página "Sobre" gera gráficos e dados dinâmicos sobre os jogos catalogados.
-   **Página de Apoio para Adicionar Jogos**: Uma ferramenta interna (`adicionar.html`) para facilitar a criação do objeto de dados de um novo jogo, incluindo busca em API externa para preenchimento automático.

## 🛠️ Tecnologias Utilizadas

-   **HTML5**: Para a estrutura semântica do conteúdo.
-   **CSS3**: Para estilização, utilizando variáveis para o sistema de temas e um layout responsivo com Grid e Flexbox.
-   **JavaScript (Vanilla)**: Para toda a lógica de interatividade, renderização de componentes, filtros e manipulação do DOM.
-   **Chart.js**: Biblioteca utilizada para criar os gráficos de estatísticas na página "Sobre".
-   **Cloudflare Workers**: Utilizado como um proxy para a API de busca de jogos, protegendo a chave da API e gerenciando as requisições.

## ⚙️ Como Funciona

O projeto opera de forma totalmente client-side. Ao carregar, o `script.js` lê o array `gamesData` do arquivo `database.js` e usa esses dados para renderizar dinamicamente os cards dos jogos nas páginas.

-   **`database.js`**: Contém o array principal `gamesData`, onde cada objeto representa um jogo com todas as suas informações (título, plataforma, status, imagem, etc.).
-   **`script.js`**: Contém a lógica principal para renderizar os jogos, aplicar filtros, controlar a troca de tema e gerenciar a interatividade geral do site.
-   **`adicionar.html` e `adicionar.js`**: Formam uma ferramenta de desenvolvimento local. Esta página não faz parte da navegação principal e serve para gerar o código de um novo objeto de jogo, que deve ser copiado e colado manualmente no arquivo `database.js`.

### Como Adicionar um Novo Jogo

Para manter a simplicidade, não há um backend ou banco de dados real. A adição de um novo jogo é um processo manual, facilitado pela página `adicionar.html`.

1.  **Abra o arquivo `adicionar.html`** no seu navegador.
2.  **Busque pelo nome do jogo**: A ferramenta usará uma API externa para buscar dados básicos, como título, imagem e data de lançamento, preenchendo o formulário.
3.  **Complete as informações**: Preencha os campos restantes, como seu status no jogo, plataforma, guias utilizados e comentários.
4.  **Gere o Código**: Clique no botão "Salvar no Zerodex". A página irá gerar o objeto JavaScript formatado.
5.  **Atualize o Banco de Dados**: Copie o código gerado e cole-o no **topo** do array `gamesData` dentro do arquivo `js/database.js`.

## 🚀 Como Executar Localmente

Como este é um projeto estático, não há necessidade de um servidor complexo ou compilação.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/FinuraBR/Zerodex.git
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd Zerodex
    ```
3.  **Abra o arquivo `index.html`** no seu navegador de preferência.

E pronto! O site estará funcionando localmente.
