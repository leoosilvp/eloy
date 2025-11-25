import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const Languages = () => {

    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        const storageUser = localStorage.getItem("eloy_user");
        if (!storageUser) return;

        const userLogged = JSON.parse(storageUser);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                const user = data.find(u => u.id === userLogged.id);
                if (user && user.idiomas) {
                    setLanguages(user.idiomas);
                }
            });
    }, []);

    return (
        <section className="ctn-change-languages">
            <HeaderContentSettings title='Idiomas' />
            <section className="content-change">
                
                <h1>Adicionar idioma</h1>
                <p>Adicione aqui os idiomas que você domina, indicando seu nível de proficiência e destacando suas habilidades linguísticas que podem contribuir para sua atuação pessoal e profissional.</p>

                <article className="ctn-add-experiences">
                    <div>
                        <label>idioma</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>nivel</label>
                        <input type="text" />
                    </div>
                </article>

                <section className="my-languages">

                    {Array.isArray(languages) && languages.length > 0 ? (
                        languages
                            .filter(lang =>
                                Object.values(lang).some(v => v && v.toString().trim() !== "")
                            )
                            .map((item, index, arr) => (
                                <article className="language" key={index}>
                                    <h1>{item.idioma}</h1>
                                    <h2>{item.nivel}</h2>

                                    {arr.length > 1 && index < arr.length - 1 && <hr />}
                                </article>
                            ))
                    ) : (
                        <p>Nenhum idioma adicionado ainda.</p>
                    )}

                </section>

            </section>
        </section>
    );
}

export default Languages;
