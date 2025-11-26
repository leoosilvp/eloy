import { useNavigate } from "react-router-dom";
import useProfile from "../../hook/useProfile";

const ContentProfile = ({ local }) => {
  const navigate = useNavigate();
  const { data: profile } = useProfile(); // 🔥 Correto para React Query

  if (!profile) return null; // Suspense vai evitar isso quase sempre

  const seguidores = profile.seguidores?.length || 0;
  const seguindo = profile.seguindo?.length || 0;

  return (
    <section className="content-profile">
      <article className="img-profile">
        <img
          src={profile.foto || "/assets/img/img-profile-default.png"}
          alt={profile.nome}
        />
      </article>

      <section className="content-info-profile">
        <section className="left-content-profile">
          <h1 className="user-name">{profile.nome}</h1>
          <h1 className="title-profile">{profile.titulo}</h1>
          <h1 className="location">
            {profile.estado} • {profile.pais}
          </h1>

          <section className="following-followers">
            <h1>{seguidores} seguidores</h1>
            <h1>•</h1>
            <h1>{seguindo} seguindo</h1>
          </section>
        </section>

        <section className="right-content-profile">
          <a
            href="https://www.fiap.com.br/"
            target="_blank"
            className="card-job"
          >
            <img
              src="https://avatars.githubusercontent.com/u/79948663?s=200&v=4"
              alt={profile.empresa}
            />
            <section className="position-company">
              <h1>{profile.empresa}</h1>
              <h2>{profile.cargo}</h2>
            </section>
          </a>
        </section>
      </section>

      <section className="btn-content-profile">
        {local === "current_profile_id" ? (
          <>
            <button className="active">Seguir</button>
            <button>Recomendar profissional</button>
            <button onClick={() => navigate("/chat")}>Enviar mensagem</button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/settings/introduction")}
              className="active"
            >
              Editar perfil
            </button>
            <button
              onClick={() =>
                window.open("https://eloydashboard.vercel.app/", "_blank")
              }
            >
              Minhas estatísticas
            </button>
            <button>Compartilhar perfil</button>
          </>
        )}
      </section>
    </section>
  );
};

export default ContentProfile;
