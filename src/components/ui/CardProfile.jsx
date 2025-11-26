import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../hook/supabaseClient";

const CardProfile = () => {

    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [sessionUser, setSessionUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {

            // pegar sessão
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setSessionUser(user);

            // buscar no supabase (tabela profiles)
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Erro ao buscar usuário:", error);
                return;
            }

            setUserData(data);
        };

        loadUser();
    }, []);

    if (!userData) return null;

    // Redirecionamento correto
    const redirectLink =
        !id || (sessionUser && sessionUser.id === id)
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
