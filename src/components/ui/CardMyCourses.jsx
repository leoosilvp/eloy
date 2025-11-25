import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";

const CardMyCourses = ({local}) => {

    const [certificacoes, setCertificacoes] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem(local);
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const userData = data.find(u => u.id === usuarioLogado.id);

                    if (Array.isArray(userData?.certificacoes)) {
                        setCertificacoes(userData.certificacoes);
                    }
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    });

    return (
        <section className="ctn-card">
            <HeaderCard title='Meus cursos' btnPlus to='courses' adm={local === "eloy_user"} />

            <section className="ctn-my-courses">

                {certificacoes.map((item, index) =>
                    item?.curso && (
                        <div key={index} className="courses">
                            <article className="course">
                                <h1>{item.curso}</h1>
                                <h2>{item.instituicao}</h2>
                                <h3>{item.duracao}</h3>
                            </article>

                            {index < certificacoes.length - 1 && <hr />}
                        </div>
                    )
                )}

            </section>
        </section>
    );
};

export default CardMyCourses;
