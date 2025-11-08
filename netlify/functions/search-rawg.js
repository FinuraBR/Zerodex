// netlify/functions/search-rawg.js

// A função principal que será executada.
exports.handler = async function(event, context) {
    // Pega a chave da API das variáveis de ambiente configuradas na Netlify.
    const apiKey = process.env.RAWG_API_KEY;

    // Pega o termo de busca que o front-end enviou (ex: "cyberpunk 2077").
    const query = event.queryStringParameters.query || '';

    if (!query) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Termo de busca não fornecido.' }),
        };
    }

    const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}`;

    try {
        // Usa 'node-fetch' para fazer a requisição do lado do servidor.
        // Você precisará instalar isso: npm install node-fetch
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        const data = await response.json();

        // Retorna os dados para o front-end com sucesso.
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        // Retorna uma mensagem de erro se algo der errado.
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Falha ao buscar dados da API.' }),
        };
    }
};