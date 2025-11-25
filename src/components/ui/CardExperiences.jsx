import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";

const CardExperiences = ({local}) => {

    const [experiencias, setExperiencias] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem(local);
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const userData = data.find(u => u.id === usuarioLogado.id);

                    if (Array.isArray(userData?.experiencias)) {
                        setExperiencias(userData.experiencias);
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
            <HeaderCard title='Experiencias' btnPlus to='experiences' adm={local === "eloy_user"} />

            <section className="ctn-experiences">
                {experiencias.map((item, index) => (
                    hasContent(item) && (
                        <div key={index}>
                            <article className="experience">
                                <h1>{item.cargo}</h1>
                                <h2>{item.empresa} • {item.tipo}</h2>
                                <h3>{item.inicio} - {item.fim}</h3>
                                <h4>{item.local}</h4>
                                <p>{item.descricao}</p>
                            </article>

                            {index < experiencias.length - 1 && <hr />}
                        </div>
                    )
                ))}
            </section>
        </section>
    );
};

export default CardExperiences;
