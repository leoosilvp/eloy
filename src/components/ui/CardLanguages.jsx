import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";

const CardLanguages = ({local}) => {

    const [idiomas, setIdiomas] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem(local);
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const userData = data.find(u => u.id === usuarioLogado.id);

                    if (Array.isArray(userData?.idiomas)) {
                        setIdiomas(userData.idiomas);
                    }
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    });

    const hasContent = (obj) => {
        if (!obj) return false;

        return Object.values(obj).some(value => {
            if (typeof value === "string" && value.trim() !== "") return true;
            if (typeof value === "number") return true;
            return false;
        });
    };

    return (
        <section className="ctn-card">
            <HeaderCard title='Idiomas' btnPlus to='languages' adm={local === "eloy_user"} />
            <section className="ctn-languages">
                {idiomas.map((item, index) =>
                    hasContent(item) && (
                        <div key={index} className="languages">
                            <article className="language">
                                <h1>{item.idioma}</h1>
                                <h2>{item.nivel}</h2>
                            </article>

                            {index < idiomas.length - 1 && <hr />}
                        </div>
                    )
                )}
            </section>

        </section>
    );
};

export default CardLanguages;
