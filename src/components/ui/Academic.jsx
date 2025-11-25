import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const Academic = ({local}) => {

    const [academics, setAcademics] = useState([]);

    useEffect(() => {
        const storageUser = localStorage.getItem(local);
        if (!storageUser) return;

        const userLogged = JSON.parse(storageUser);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                const user = data.find(u => u.id === userLogged.id);
                if (user && user.formacao) {
                    setAcademics(user.formacao);
                }
            });
    });

    const validAcademics = academics.filter(ac =>
        Object.values(ac).some(v => v && v.toString().trim() !== "")
    );

    return (
        <section className="ctn-change-academic">
            <HeaderContentSettings title='Formação' />

            <section className="content-change">

                <h1>Adicionar formação</h1>

                <p>Adicione aqui suas formações acadêmicas, cursos e certificações que contribuíram para o seu desenvolvimento profissional e pessoal.</p>

                <article className="ctn-add-experiences">
                    <div>
                        <label>Instituição</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Curso</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Ano</label>
                        <input type="month" />
                    </div>
                </article>

                <hr />

                <section className="ctn-my-academics">

                    {validAcademics.length === 0 ? (
                        <p>Nenhuma formação adicionada ainda.</p>
                    ) : (
                        validAcademics.map((item, index) => (
                            <article className="academic" key={index}>
                                <h1>{item.instituicao}</h1>
                                <h2>{item.curso}</h2>
                                <h3>{item.ano}</h3>

                                {validAcademics.length > 1 && index < validAcademics.length - 1 && <hr />}
                            </article>
                        ))
                    )}

                </section>
            </section>
        </section>
    );
}

export default Academic;
