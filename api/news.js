export default async function handler(req, res) {
    const API_KEY = process.env.VITE_NEWS_API_KEY;

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=mercado&language=pt&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
        );

        const data = await response.json();

        return res.status(200).json(data);
    } catch {
        return res.status(500).json({ error: "Erro ao carregar notícias." });
    }
}
