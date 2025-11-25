import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import CardAds from "../components/ui/CardAds";
import CardInfoProfile from "../components/ui/CardInfoProfile";
import CardNewslatter from "../components/ui/CardNewslatter";
import CardProfile from "../components/ui/CardProfile";

import calculateUserRanking from "../hook/calculateUserRanking";

const Ranking = () => {

    const [me, setMe] = useState(null);
    const [top10, setTop10] = useState([]);

    const limitarTitulo = (titulo) => {
        if (!titulo) return "Sem título definido";
        return titulo.length > 55 ? titulo.slice(0, 55) + "..." : titulo;
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("eloy_user"));
        if (!storedUser) return;

        fetch("/db/users.json")
            .then(res => res.json())
            .then(listaUsuarios => {

                const ranking = calculateUserRanking(listaUsuarios);

                const eu = ranking.find(u => u.id === storedUser.id);
                setMe(eu || null);

                setTop10(ranking.slice(0, 10));
            });
    }, []);

    return (
        <section className="content">
            <aside className="left">
                <CardProfile local='eloy_user' />
                <CardInfoProfile local='eloy_user' />
            </aside>

            <section className="ranking">
                <div className="header-ranking">
                    <h1>Sua posição no ranking</h1>
                </div>

                <section className="my-position">
                    {me && (
                        <NavLink to='/profile' className="card-position me">
                            <div className="position">
                                <p>{me.posicao}º</p>

                                <section className="info-profile-position">
                                    <img src={me.foto || "/assets/img/img-profile-default.png"} />
                                    <div>
                                        <h1>{me.nome}</h1>
                                        <h2>{limitarTitulo(me.titulo)}</h2>
                                    </div>
                                </section>
                            </div>
                        </NavLink>
                    )}

                    <div className="text-line">
                        <hr />
                        <p>Top 10 mais influentes</p>
                        <hr />
                    </div>
                </section>

                <section className="positions">
                    {top10.map((user) => (
                        <NavLink key={user.id} to={`/user/${user.id}`} className="card-position">
                            <div className="position">
                                <p>{user.posicao}º</p>

                                <section className="info-profile-position">
                                    <img src={user.foto || "/assets/img/img-profile-default.png"} />
                                    <div>
                                        <h1>{user.nome}</h1>
                                        <h2>{limitarTitulo(user.titulo)}</h2>
                                    </div>
                                </section>
                            </div>
                        </NavLink>
                    ))}
                </section>
            </section>

            <aside className="right">
                <CardNewslatter />
                <CardAds />
            </aside>
        </section>
    );
};

export default Ranking;
