import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const Experiences = () => {

    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        const storageUser = localStorage.getItem("eloy_user");
        if (!storageUser) return;

        const userLogged = JSON.parse(storageUser);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                const user = data.find(u => u.id === userLogged.id);
                if (user && user.experiencias) {
                    setExperiences(user.experiencias);
                }
            });
    }, []);

    return (
        <section className="ctn-change-experiences">
            <HeaderContentSettings title='Experiências' />
            <section className="content-change">
                <p>Adicione aqui suas experiências profissionais, destacando cargos, responsabilidades e conquistas relevantes da sua trajetória.</p>

                <h1>Adicionar experiência</h1>

                <article className="ctn-add-experiences">

                    <div>
                        <label>Empresa</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Tipo</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Cargo</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Início</label>
                        <input type="month" />
                    </div>

                    <div>
                        <label>Fim</label>
                        <input type="month" />
                    </div>

                    <div>
                        <label>Local</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>Descrição</label>
                        <textarea />
                    </div>

                </article>

                <hr />

                <section className="ctn-my-experiences">

                    {Array.isArray(experiences) && experiences.length > 0 ? (
                        experiences
                            .filter(exp => Object.values(exp).some(v => v && v.toString().trim() !== ""))
                            .map((item, index, arr) => (
                                <article className="experience" key={index}>
                                    <h1>{item.cargo}</h1>
                                    <h2>{item.empresa} • {item.tipo}</h2>
                                    <h3>{item.inicio} - {item.fim}</h3>
                                    <h4>{item.local}</h4>
                                    <p>{item.descricao}</p>

                                    {arr.length > 1 && index < arr.length - 1 && <hr />}
                                </article>
                            ))
                    ) : (
                        <p>Nenhuma experiência adicionada ainda.</p>
                    )}

                </section>
            </section>
        </section>
    );
}

export default Experiences;
