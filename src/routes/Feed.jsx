import { useEffect, useState } from "react";
import CardInfoProfile from "../components/ui/CardInfoProfile";
import CardProfile from "../components/ui/CardProfile";
import '../css/aside-left.css';
import '../css/center.css';
import '../css/aside-right.css';
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
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
      const userFound = allUsers.find(u => u.id === mentionedId);

      if (!userFound) return "@" + mentionedId;

      return (
        <NavLink
          key={index}
          to={`/user/${userFound.id}`}
          className="mention-link"
        >
          @{mentionedId}
        </NavLink>
      );
    });
  };

  useEffect(() => {
    const loadFeed = async () => {

      // Buscar todos os perfis
      const { data: users } = await supabase
        .from("profiles")
        .select("*");

      setAllUsers(users || []);

      // Buscar posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!postsData) {
        setPosts([]);
        return;
      }

      // Misturar dados
      const merged = postsData.map(post => {
        const author = users.find(u => u.id === post.user_id);

        return {
          ...post,
          autor: author?.nome || "Usuário",
          foto: author?.foto,
          titulo: author?.titulo,
          autorId: author?.id
        };
      });

      setPosts(merged);
    };

    loadFeed();
  }, []);

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

        {posts.map(post => (
          <article key={post.id} className="post">

            <NavLink
              className="header-post"
              to={post.user_id === currentUserId ? "/profile" : `/user/${post.user_id}`}
            >
              <div className="info-user-header-post">
                <img src={post.foto || "assets/img/img-profile-default.png"} />
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
              <button><i className="fa-solid fa-ellipsis"></i></button>
            </NavLink>

            <section className="content-post">
              <p>{renderContentWithMentions(post.content)}</p>
            </section>

            <section className="footer-post">
              <button>{post.likes?.length || 0}<i className="fa-regular fa-thumbs-up"></i>Curtir</button>
              <button>{post.comments?.length || 0}<i className="fa-regular fa-comment"></i>Comentar</button>
              <button>{post.shares?.length || 0}<i className="fa-regular fa-share-from-square"></i>Compartilhar</button>
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
