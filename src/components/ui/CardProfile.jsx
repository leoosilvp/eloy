import { Link, useParams } from "react-router-dom";
import useProfile from "../../hook/useProfile";

const CardProfile = () => {
  const { id } = useParams();
  const { data: profile, isLoading } = useProfile();

  // Evita erro enquanto carrega
  if (isLoading || !profile) return null;

  const redirectLink =
    !id || profile.id === id
      ? "/profile"
      : `/user/${id}`;

  const tituloLimite = (text = "") =>
    text.length > 62 ? text.slice(0, 62) + "..." : text;

  const bannerSrc =
    profile.banner?.trim()
      ? profile.banner
      : "/assets/img/img-banner-default.png";

  const fotoSrc =
    profile.foto?.trim()
      ? profile.foto
      : "/assets/img/img-profile-default.png";

  return (
    <Link to={redirectLink} className="card-profile">
      <section className="banner-card-profile">
        <img
          src={bannerSrc}
          alt="Banner do usuário"
        />
      </section>

      <section className="user-card-profile">
        <img
          src={fotoSrc}
          alt="Foto do usuário"
        />

        <h1 className="name-card-profile">{profile.nome}</h1>
        <h2 className="title-card-profile">{tituloLimite(profile.titulo)}</h2>
        <h3 className="job-card-profile">{profile.cargo}</h3>
      </section>
    </Link>
  );
};

export default CardProfile;
