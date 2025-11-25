import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem("eloy_user");
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                const userData = data.find(u => u.email === usuarioLogado.email);
                if (userData && userData.projetos) {
                    setProjects(userData.projetos);
                }
            });
    }, []);

    return (
        <section className="ctn-change-projects">
            <HeaderContentSettings title='Projetos' />

            <section className="content-change">
                <h1>Adicionar projetos</h1>
                <p>Adicione aqui seus projetos, trabalhos e iniciativas que demonstram suas habilidades, experiências práticas e contribuições no desenvolvimento de soluções.</p>

                <article className="ctn-add-experiences">

                    <div>
                        <label>Titulo</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Link</label>
                        <input type="url" />
                    </div>

                    <div>
                        <label>Descricao</label>
                        <input type="text" />
                    </div>

                </article>

                {projects.length > 0 && <hr />}

                <section className="my-projects">

                    {projects.map((item, index) => (
                        <article key={index} className="project">
                            <h1>{item.titulo}</h1>
                            <a href={item.link} target="_blank">{item.link}</a>
                            <p>{item.descricao}</p>

                            {index !== projects.length - 1 && <hr />}
                        </article>
                    ))}

                </section>
            </section>
        </section>
    );
};

export default Projects;
