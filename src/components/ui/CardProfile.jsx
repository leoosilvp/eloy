import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CardProfile = ({local}) => {

    const { id } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem(local);
        if (!user) return;

        const usuarioLogado = JSON.parse(user);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const userInfo = data.find(u => u.id === usuarioLogado.id);
                    if (userInfo) setUserData(userInfo);
                }
            })
            .catch(err => console.error("Erro ao carregar JSON:", err));
    }, [local]);

    if (!userData) return null;

    const loggedUser = JSON.parse(localStorage.getItem("eloy_user"));
    
    const redirectLink =
        !id || (loggedUser && loggedUser.id === id)
            ? "/profile"
            : `/user/${id}`;

    const tituloLimite = (text) => {
        if (!text) return "";
        return text.length > 62 ? text.substring(0, 62) + "..." : text;
    };

    const bannerSrc = userData.banner && userData.banner.trim() !== ""
        ? userData.banner
        : "/assets/img/img-banner-default.png";

    const fotoSrc = userData.foto && userData.foto.trim() !== ""
        ? userData.foto
        : "/assets/img/img-profile-default.png";

    return (
        <Link to={redirectLink} className="card-profile">
            <section className="banner-card-profile">
                <img src={bannerSrc} alt="Banner do usuário" />
            </section>

            <section className="user-card-profile">
                <img src={fotoSrc} alt="Foto do usuário" />

                <h1 className="name-card-profile">{userData.nome}</h1>
                <h2 className="title-card-profile">
                    {tituloLimite(userData.titulo)}
                </h2>
                <h3 className="job-card-profile">{userData.cargo}</h3>
            </section>
        </Link>
    );
};

export default CardProfile;
