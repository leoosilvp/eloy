import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";

const CardAbout = ({local}) => {

    const [sobre, setSobre] = useState("");

    useEffect(() => {
        const userLocal = localStorage.getItem(local);

        if (!userLocal) return;

        const usuarioLogado = JSON.parse(userLocal);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {

                const usuario = data.find(u => u.id === usuarioLogado.id);

                if (usuario) {
                    setSobre(usuario.resumo);
                } else {
                    console.warn("Usuário não encontrado no JSON");
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    });

    return (
        <section className="ctn-about">
            <HeaderCard title='Sobre' to='about' adm={local === "eloy_user"} />

            <article className="about">
                <p>{sobre}</p>
            </article>
        </section>
    );
};

export default CardAbout;
