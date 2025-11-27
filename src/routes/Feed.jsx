import { useEffect, useState } from "react";
import CardInfoProfile from "../components/ui/CardInfoProfile";
import CardProfile from "../components/ui/CardProfile";
import "../css/aside-left.css";
import "../css/center.css";
import "../css/aside-right.css";
import CardAds from "../components/ui/CardAds";
import CardNewslatter from "../components/ui/CardNewslatter";
import useAuthRedirect from "../hook/useAuthRedirect";
import { NavLink } from "react-router-dom";
import { supabase } from "../hook/supabaseClient";

const Feed = () => {
  useAuthRedirect();

  const [posts, setPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      setCurrentUserId(user?.id || null);
    };

    loadUser();
  }, []);

  const formatTime = (dateString) => {
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

  const renderContentWithMentions = (text) => {
    if (!text) return "";

    const mentionRegex = /@([a-zA-Z0-9_.]+)/g;
    const parts = text.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 2 === 0) return part;

      const mentionedId = part;
      const userFound = allUsers.find((u) => u.user_name === mentionedId);

      return userFound ? (
        <NavLink
          key={index}
          to={`/user/${userFound.user_name}`}
          className="mention-link"
        >
          @{mentionedId}
        </NavLink>
      ) : (
        "@" + mentionedId
      );
    });
  };

  useEffect(() => {
    const loadFeed = async () => {
      const { data: users } = await supabase.from("profiles").select("*");
      setAllUsers(users || []);

      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!postsData) {
        setPosts([]);
        return;
      }

      const merged = postsData.map((post) => {
        const user = users?.find((u) => u.id === post.user_id);

        return {
          ...post,
          autor: user?.nome || "Usuário",
          autorUserName: user?.user_name || "",
          foto: user?.foto,
          titulo: user?.titulo,
          likes: post.likes || [],
          comments: post.comments || [],
          shares: post.shares || [],
        };
      });

      setPosts(merged);
    };

    loadFeed();
  }, []);

  const handleLike = async (postId) => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return;

    const userId = user.id;

    const { data: postData, error: fetchError } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", postId)
      .single();

    if (fetchError || !postData) {
      console.error("Erro ao buscar post:", fetchError);
      return;
    }

    const currentLikes = postData.likes || [];
    const alreadyLiked = currentLikes.includes(userId);

    const newLikes = alreadyLiked
      ? currentLikes.filter((id) => id !== userId)
      : [...currentLikes, userId];

    const { error: updateError } = await supabase
      .from("posts")
      .update({ likes: newLikes })
      .eq("id", postId);

    if (updateError) {
      console.error("Erro ao salvar like:", updateError);
      return;
    }

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p))
    );
  };

  return (
    <section className="content">
      <aside className="left">
        <CardProfile />
        <CardInfoProfile />
      </aside>

      <section className="feed">
        {posts.length === 0 && (
          <p className="no-posts">Nenhuma publicação encontrada.</p>
        )}

        {posts.map((post) => (
          <article key={post.id} className="post">
            <NavLink
              className="header-post"
              to={
                post.autorUserName === allUsers.find(u => u.id === currentUserId)?.user_name
                  ? "/profile"
                  : `/user/${post.autorUserName}`
              }
            >
              <div className="info-user-header-post">
                <img
                  src={post.foto || "/assets/img/img-profile-default.png"}
                  alt="Foto do autor"
                />
                <div>
                  <div className="name-data-post">
                    <h1>{post.autor}</h1>
                    <h3>•</h3>
                    <h3>{formatTime(post.created_at)}</h3>
                  </div>

                  <h2>
                    {post.titulo?.length > 65
                      ? post.titulo.slice(0, 65) + "..."
                      : post.titulo}
                  </h2>
                </div>
              </div>

              <button>
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </NavLink>

            <section className="content-post">
              <p>{renderContentWithMentions(post.content)}</p>
            </section>

            <section className="footer-post">
              <button onClick={() => handleLike(post.id)}>
                {post.likes.length}
                <i
                  className={
                    post.likes.includes(currentUserId)
                      ? "fa-solid fa-thumbs-up"
                      : "fa-regular fa-thumbs-up"
                  }
                ></i>
                {post.likes.includes(currentUserId) ? "Curtido" : "Curtir"}
              </button>

              <button>
                {post.comments.length}
                <i className="fa-regular fa-comment"></i>
                Comentar
              </button>

              <button>
                {post.shares.length}
                <i className="fa-regular fa-share-from-square"></i>
                Compartilhar
              </button>
            </section>
          </article>
        ))}
      </section>

      <aside className="right">
        <CardNewslatter />
        <CardAds />
      </aside>
    </section>
  );
};

export default Feed;
