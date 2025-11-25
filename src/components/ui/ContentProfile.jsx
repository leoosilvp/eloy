import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ContentProfile = ({ local }) => {
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem(local);
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const foundUser = data.find(u => u.id === usuarioLogado.id);

                    if (foundUser) {
                        setUserData({
                            ...foundUser,
                            seguidores: Array.isArray(foundUser.seguidores)
                                ? foundUser.seguidores.length
                                : 0,
                            seguindo: Array.isArray(foundUser.seguindo)
                                ? foundUser.seguindo.length
                                : 0
                        });
                    }
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    },);

    if (!userData) return null;

    const profileImg = userData.foto !== ""
        ? userData.foto
        : "/assets/img/img-profile-default.png";

    return (
        <section className="content-profile">
            <article className="img-profile">
                <img src={profileImg} alt={userData.nome} />
            </article>

            <section className="content-info-profile">
                <section className="left-content-profile">

                    <h1 className="user-name">{userData.nome}</h1>
                    <h1 className="title-profile">{userData.titulo}</h1>
                    <h1 className="location">{userData.estado} • {userData.pais}</h1>

                    <section className="following-followers">
                        <h1>{userData.seguidores} seguidores</h1>
                        <h1>•</h1>
                        <h1>{userData.seguindo} seguindo</h1>
                    </section>
                </section>

                <section className="right-content-profile">
                    <a href="https://www.fiap.com.br/" target="_blank" className="card-job">
                        <img
                            src="https://avatars.githubusercontent.com/u/79948663?s=200&v=4"
                            alt={userData.empresa}
                        />
                        <section className="position-company">
                            <h1>{userData.empresa}</h1>
                            <h2>{userData.cargo}</h2>
                        </section>
                    </a>
                </section>
            </section>

            <section className="btn-content-profile">
                {local === "current_profile_id" ? (
                    <>
                        <button className="active">Seguir</button>
                        <button>Recomendar profissional</button>
                        <button onClick={() => navigate('/chat')}>Enviar mensagem</button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/settings/introduction")}
                            className="active"
                        >
                            Editar perfil
                        </button>
                        
                        <button onClick={() => window.open("https://eloydashboard.vercel.app/", "_blank")}>Minhas estatísticas</button>

                        <button>Compartilhar perfil</button>

                    </>
                )}
            </section>

        </section>
    );
};

export default ContentProfile;
