import { useEffect, useState } from "react";

const CardNewslatter = () => {

    const [news, setNews] = useState([]);

    useEffect(() => {
        async function loadNews() {
            try {
                const response = await fetch("/api/news");
                const data = await response.json();


                if (data.articles) {
                    setNews(data.articles);
                }
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
            }
        }

        loadNews();
    }, []);

    const limitTitle = (title) => {
        if (!title) return "";
        return title.length > 25 ? title.slice(0, 25) + "..." : title;
    };

    return (
        <article className="newslatter">
            <section className="header-newslatter">
                <h1>eloy Notícias</h1>
                <button><i className="fa-solid fa-info"></i></button>
            </section>

            <section className="ctn-cards-news">

                {news.map((n, index) => (
                    <a
                        key={index}
                        href={n.url}
                        target="_blank"
                        className="card-news"
                    >
                        <h1>{limitTitle(n.title)}</h1>

                        <section className="sub-card-news">
                            <h2>Há {new Date(n.publishedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} • {n.source?.name}</h2>
                        </section>
                    </a>
                ))}

            </section>
        </article>
    );
}

export default CardNewslatter;
