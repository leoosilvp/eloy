import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import CardAds from "../components/ui/CardAds";
import CardInfoProfile from "../components/ui/CardInfoProfile";
import CardNewslatter from "../components/ui/CardNewslatter";
import CardProfile from "../components/ui/CardProfile";

import calculateUserRanking from "../hook/calculateUserRanking";
import useProfile from "../hook/useProfile";
import useAuthRedirect from "../hook/useAuthRedirect";

const Ranking = () => {

    useAuthRedirect();

    const { data: me } = useProfile();
    const [top10, setTop10] = useState([]);

    const limitarTitulo = (titulo) => {
        if (!titulo) return "Sem título definido";
        return titulo.length > 55 ? titulo.slice(0, 55) + "..." : titulo;
    };

    useEffect(() => {
        if (!me) return;

        async function loadRanking() {
            const ranking = await calculateUserRanking();

            if (!ranking) return;

            const minhaPosicao = ranking.find((u) => u.id === me.id);

            if (minhaPosicao) {
                Object.assign(me, minhaPosicao);
            }

            setTop10(ranking.slice(0, 10));
        }

        loadRanking();
    }, [me]);

    if (!me) return null;

    return (
        <section className="content">
            <aside className="left">
                <CardProfile />
                <CardInfoProfile />
            </aside>

            <section className="ranking">
                <div className="header-ranking">
                    <h1>Sua posição no ranking</h1>
                </div>

                <section className="my-position">
                    {me.posicao && (
                        <NavLink to="/profile" className="card-position me">
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
                        <NavLink
                            key={user.id}
                            to={`/user/${user.user_name}`} // redireciona pelo user_name
                            className="card-position"
                        >
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
