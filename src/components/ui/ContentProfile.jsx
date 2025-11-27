import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "../../hook/supabaseClient";

const ContentProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const loggedUser = sessionData.session?.user;
        setCurrentUserId(loggedUser?.id);

        let profileData = null;

        // /profile → perfil do usuário logado
        if (location.pathname === "/profile") {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", loggedUser?.id)
            .single();
          if (error || !data) throw error;
          profileData = data;
        } else if (username) {
          // /user/:username → busca pelo user_name
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .ilike("user_name", username)
            .single();
          if (error || !data) {
            navigate("/error");
            return;
          }
          profileData = data;

          // verifica se logado segue este perfil
          setIsFollowing(profileData.seguidores?.includes(loggedUser?.id) || false);
        }

        setProfile({
          ...profileData,
          seguidores: profileData.seguidores || [],
          seguindo: profileData.seguindo || [],
          estrelas: profileData.estrelas || [],
          seguidoresCount: (profileData.seguidores || []).length,
          seguindoCount: (profileData.seguindo || []).length,
        });

        setIsStarred(profileData.estrelas?.includes(loggedUser?.id) || false);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, location.pathname, navigate]);

  const handleFollow = async () => {
    if (!currentUserId || !profile?.id) return;

    try {
      let updatedFollowers = [...(profile.seguidores || [])];
      let updatedFollowing = [];

      // pega os dados do usuário logado
      const { data: currentUserData, error } = await supabase
        .from("profiles")
        .select("seguindo")
        .eq("id", currentUserId)
        .single();

      if (error) throw error;
      updatedFollowing = [...(currentUserData.seguindo || [])];

      if (isFollowing) {
        // Deixar de seguir
        updatedFollowers = updatedFollowers.filter((id) => id !== currentUserId);
        updatedFollowing = updatedFollowing.filter((id) => id !== profile.id);
        setIsFollowing(false);
      } else {
        // Seguir
        updatedFollowers.push(currentUserId);
        updatedFollowing.push(profile.id);
        setIsFollowing(true);
      }

      // Atualiza perfil do usuário seguido
      await supabase
        .from("profiles")
        .update({ seguidores: updatedFollowers })
        .eq("id", profile.id);

      // Atualiza perfil do usuário logado
      await supabase
        .from("profiles")
        .update({ seguindo: updatedFollowing })
        .eq("id", currentUserId);

      setProfile((prev) => ({
        ...prev,
        seguidores: updatedFollowers,
        seguidoresCount: updatedFollowers.length,
      }));
    } catch (err) {
      console.error("Erro ao seguir/deixar de seguir:", err);
    }
  };

  const handleStar = async () => {
    if (!currentUserId || !profile?.id) return;

    try {
      const updatedStars = isStarred
        ? profile.estrelas.filter((id) => id !== currentUserId)
        : [...profile.estrelas, currentUserId];

      await supabase
        .from("profiles")
        .update({ estrelas: updatedStars })
        .eq("id", profile.id);

      setIsStarred(!isStarred);
      setProfile((prev) => ({
        ...prev,
        estrelas: updatedStars,
      }));
    } catch (err) {
      console.error("Erro ao atualizar estrela:", err);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!profile) return null;

  const seguidores = profile.seguidoresCount || 0;
  const seguindo = profile.seguindoCount || 0;
  const isCurrentUser = location.pathname === "/profile";

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
        {isCurrentUser ? (
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
            <button
              onClick={() => {
                const link = `${window.location.origin}/api/share/${profile.user_name}`;
                navigator.share
                  ? navigator.share({
                    title: `${profile.nome}`,
                    text: "Veja meu perfil completo no Eloy.",
                    url: link
                  })
                  : window.open(link, "_blank");
              }}
            >
              Compartilhar
            </button>
          </>
        ) : (
          <>
            <button className={isFollowing ? "active" : ""} onClick={handleFollow}>
              {isFollowing ? "Seguindo" : "Seguir"}
            </button>
            <button className={isStarred ? "active" : ""} onClick={handleStar}>
              {isStarred ? "Estrelado" : "Estrelar"}
            </button>
            <button onClick={() => navigate("/chat")}>Enviar mensagem</button>
          </>
        )}
      </section>
    </section>
  );
};

export default ContentProfile;
