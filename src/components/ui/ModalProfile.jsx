import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const ModalProfile = ({ open, setOpen }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem("eloy_user");
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const foundUser = data.find(u => u.id === usuarioLogado.id);
                    if (foundUser) setUserData(foundUser);
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    }, []);

    if (!open || !userData) return null;

    const fotoSrc =
        userData.foto && userData.foto.trim() !== ""
            ? userData.foto
            : "assets/img/img-profile-default.png";

    const bannerSrc =
        userData.banner && userData.banner.trim() !== ""
            ? userData.banner
            : "assets/img/img-banner-default.png";

    const tituloLimitado = userData.titulo
        ? userData.titulo.length > 60
            ? userData.titulo.substring(0, 60) + "..."
            : userData.titulo
        : "";

    return (
        <article
            className="modal-profile"
            onMouseLeave={() => {
                setTimeout(() => setOpen(false), 150);
            }}
        >
            <NavLink to="/profile" className="ctn-content-modal-profile">
                <img src={bannerSrc} alt="Banner do usuário" />

                <section className="content-modal-profile">
                    <div className="img-user-modal">
                        <img src={fotoSrc} alt={userData.nome} />
                    </div>

                    <h1>{userData.nome}</h1>
                    <h2>{tituloLimitado}</h2>
                    <p>{userData.cargo}</p>
                </section>
            </NavLink>

            <hr />

            <section className="btns-modal-profile">
                <NavLink to="/profile">Meu perfil</NavLink>
                <NavLink to="https://eloydashboard.vercel.app/" target="_blank">Minhas estatísticas</NavLink>
                <NavLink to="/settings/appearance">Configurações</NavLink>
                <NavLink className="log-out" to="/welcome"><i className="fa-solid fa-arrow-right-from-bracket"></i>Sair</NavLink>
            </section>

        </article>
    );
};

export default ModalProfile;
