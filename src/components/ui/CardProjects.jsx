import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";

const CardProjects = ({local}) => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem(local);
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const userData = data.find(u => u.id === usuarioLogado.id);

                    if (Array.isArray(userData?.projetos)) {
                        setProjects(userData.projetos);
                    }
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    });

    return (
        <section className="ctn-card">
            <HeaderCard title='Projetos' btnPlus to='projects' adm={local === "eloy_user"} />

            <section className="ctn-projects">

                {projects.map((item, index) =>
                    item?.titulo && (
                        <div key={index} className="projects">
                            <article className="project">
                                <h1>{item.titulo}</h1>
                                {item.link && (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                        {item.link}
                                    </a>
                                )}
                                <p>{item.descricao}</p>
                            </article>

                            {index < projects.length - 1 && <hr />}
                        </div>
                    )
                )}

            </section>
        </section>
    );
};

export default CardProjects;
