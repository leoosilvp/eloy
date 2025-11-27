import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardFeedProfile = ({ profileId }) => {
  const { data: me } = useProfile(); // Usuário logado
  const [userData, setUserData] = useState(null);
  const [lastPost, setLastPost] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (!me) return;
    setCurrentUserId(me.id);

    const fetchData = async () => {
      try {
        const id = profileId || me.id;

        // Busca o perfil
        const { data: user, error: userError } = await supabase
          .from("profiles")
          .select("id, nome, foto, titulo")
          .eq("id", id)
          .single();

        if (userError || !user) {
          console.error("Erro ao buscar perfil:", userError);
          return;
        }
        setUserData(user);

        // Busca o último post do perfil com likes, comentários e compartilhamentos
        const { data: posts, error: postsError } = await supabase
          .from("posts")
          .select("id, user_id, created_at, content, likes, comentarios, compartilhamentos")
          .eq("user_id", id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (postsError) {
          console.error("Erro ao buscar posts:", postsError);
          return;
        }

        setLastPost(posts && posts.length > 0 ? posts[0] : null);
      } catch (err) {
        console.error("Erro ao carregar feed:", err);
      }
    };

    fetchData();
  }, [me, profileId]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const postDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - postDate;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 1) return "agora";
    if (diffMin < 60) return `${diffMin} min`;
    if (diffHrs < 24) return `${diffHrs} h`;
    return `${diffDays} dias`;
  };

  // Função para curtir o post
  const handleLike = async (postId, likesArray) => {
    if (!currentUserId) return;

    const hasLiked = likesArray?.includes(currentUserId);
    const newLikes = hasLiked
      ? likesArray.filter((id) => id !== currentUserId)
      : [...(likesArray || []), currentUserId];

    const { error } = await supabase
      .from("posts")
      .update({ likes: newLikes })
      .eq("id", postId);

    if (error) {
      console.error("Erro ao curtir:", error);
      return;
    }

    // Atualiza o post localmente
    setLastPost((prev) => ({ ...prev, likes: newLikes }));
  };

  if (!userData) return null;

  const adm = !profileId || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Publicações"/>

      <section className="ctn-feed-profile">
        <p className="title-card-feed-profile">Última publicação</p>

        {!lastPost ? (
          <p className="no-posts">Nenhuma publicação ainda.</p>
        ) : (
          <article className="post">
            <NavLink className="header-post">
              <div className="info-user-header-post">
                <img
                  src={userData.foto?.trim() || "/assets/img/img-profile-default.png"}
                  alt={userData.nome}
                />
                <div>
                  <div className="name-data-post">
                    <h1>{userData.nome}</h1>
                    <h3>•</h3>
                    <h3>{formatTime(lastPost.created_at)}</h3>
                  </div>
                  <h2>
                    {userData.titulo?.length > 65
                      ? userData.titulo.slice(0, 65) + "..."
                      : userData.titulo || ""}
                  </h2>
                </div>
              </div>
              <button>
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </NavLink>

            <section className="content-post">
              <p>{lastPost.content}</p>
            </section>

            <section className="footer-post">
              <button onClick={() => handleLike(lastPost.id, lastPost.likes)}>
                <i
                  className={
                    lastPost.likes?.includes(currentUserId)
                      ? "fa-solid fa-thumbs-up"
                      : "fa-regular fa-thumbs-up"
                  }
                ></i>{" "}
                {lastPost.likes?.length || 0} Curtir
              </button>

              <button>
                <i className="fa-regular fa-comment"></i>{" "}
                {lastPost.comentarios?.length || 0} Comentar
              </button>

              <button>
                <i className="fa-regular fa-share-from-square"></i>{" "}
                {lastPost.compartilhamentos?.length || 0} Compartilhar
              </button>
            </section>
          </article>
        )}
      </section>

      <NavLink
        to={`/user/${userData.id}/feed-profile`}
        className="btn-to-feed-profile"
      >
        {adm ? "Acessar minhas publicações" : "Visualizar publicações"}
      </NavLink>
    </section>
  );
};

export default CardFeedProfile;
