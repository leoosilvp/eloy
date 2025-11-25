import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";

const CardAcademic = ({local}) => {

    const [formacao, setFormacao] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem(local);
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const userData = data.find(u => u.id === usuarioLogado.id);

                    if (userData?.formacao) {
                        setFormacao(userData.formacao);
                    }
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    });

    return (
        <section className="ctn-card">
            <HeaderCard title='Formação Acadêmica' btnPlus to='academic' adm={local === "eloy_user"} />

            <section className="ctn-academics">
                {formacao.map((item, index) => (
                    <div key={index} className="academics">
                        <article className="academic">
                            <h1>{item.instituicao}</h1>
                            <h2>{item.curso}</h2>
                            <h3>{item.ano}</h3>
                        </article>

                        {index < formacao.length - 1 && <hr />}
                    </div>
                ))}
            </section>
        </section>
    );
};

export default CardAcademic;
