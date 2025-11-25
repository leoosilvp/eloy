import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const About = () => {

    const [about, setAbout] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("eloy_user");
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const userInfo = data.find(u => u.id === usuarioLogado.id);
                    if (userInfo && userInfo.resumo) {
                        setAbout(userInfo.resumo);
                    }
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    }, []);

    return (
        <section className="ctn-change-about">
            <HeaderContentSettings title='Sobre' />
            <section className="content-change">
                <p>Escreva um breve resumo sobre você, destacando sua trajetória, habilidades e o que mais define sua identidade profissional.</p>
                <article className="change-about">
                    <label>Sobre</label>
                    <textarea
                        value={about}
                        readOnly
                    />
                </article>
            </section>
        </section>
    );
}

export default About;
