import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const Skills = () => {

    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const storageUser = localStorage.getItem("eloy_user");
        if (!storageUser) return;

        const userLogged = JSON.parse(storageUser);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                const user = data.find(u => u.id === userLogged.id);
                if (user && Array.isArray(user.competencias)) {
                    setSkills(
                        user.competencias.filter(s => s && s.trim() !== "")
                    );
                }
            });
    }, []);

    return (
        <section className="ctn-change-skills">
            <HeaderContentSettings title='Competências' />

            <section className="content-change">
                <p>
                    Adicione aqui suas competências técnicas e comportamentais, destacando habilidades que demonstram sua capacidade de atuação, produtividade e evolução profissional.
                </p>

                <article className="add-interests">
                    <label>Adicionar Competência</label>
                    <input type="text" placeholder="ex: comunicação" />
                </article>

                <hr />

                <section className="my-skills">

                    {skills.length === 0 ? (
                        <p>Nenhuma competência adicionada ainda.</p>
                    ) : (
                        skills.map((skill, index) => (
                            <article className="skill" key={index}>
                                <h1>{skill}</h1>

                                {skills.length > 1 && index < skills.length - 1 && <hr />}
                            </article>
                        ))
                    )}

                </section>
            </section>
        </section>
    );
}

export default Skills;
