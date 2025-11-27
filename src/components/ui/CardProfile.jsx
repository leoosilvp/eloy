import { Link } from "react-router-dom";
import useProfile from "../../hook/useProfile";

const CardProfile = ({ profile: propProfile }) => {
  const { data: profile, isLoading } = useProfile();

  const user = propProfile || profile;

  if (isLoading || !user) return null;

  const redirectLink = "/profile";

  const tituloLimite = (text = "") =>
    text.length > 62 ? text.slice(0, 62) + "..." : text;

  const bannerSrc = user.banner?.trim()
    ? user.banner
    : "/assets/img/img-banner-default.png";

  const fotoSrc = user.foto?.trim()
    ? user.foto
    : "/assets/img/img-profile-default.png";

  return (
    <Link to={redirectLink} className="card-profile">
      <section className="banner-card-profile">
        <img src={bannerSrc} alt="Banner do usuário" />
      </section>

      <section className="user-card-profile">
        <img src={fotoSrc} alt="Foto do usuário" />
        <h1 className="name-card-profile">{user.nome}</h1>
        <h2 className="title-card-profile">{tituloLimite(user.titulo || "")}</h2>
        <h3 className="job-card-profile">{user.cargo}</h3>
      </section>
    </Link>
  );
};

export default CardProfile;
