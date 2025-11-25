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

const Feed = () => {

  useAuthRedirect();

  const [posts, setPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

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

      const currentUser = JSON.parse(localStorage.getItem("eloy_user"));
      const isCurrentUser = currentUser?.id === mentionedId;

      return (
        <NavLink
          key={index}
          to={isCurrentUser ? "/profile" : `/user/${userFound.id}`}
          className="mention-link"
        >
          @{mentionedId}
        </NavLink>
      );
    });
  };

  useEffect(() => {
    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {

        setAllUsers(data);

        const allPosts = [];

        data.forEach(user => {
          if (user.posts && user.posts.length > 0) {

            user.posts.forEach(post => {

              const hasText = post.conteudo && String(post.conteudo).trim() !== "";
              const hasLikes = Array.isArray(post.likes) && post.likes.length > 0;
              const hasComments = Array.isArray(post.comentarios) && post.comentarios.length > 0;
              const hasShares = Array.isArray(post.compartilhamentos) && post.compartilhamentos.length > 0;

              const hasContent = hasText || hasLikes || hasComments || hasShares;

              if (hasContent) {
                allPosts.push({
                  ...post,
                  autor: user.nome,
                  foto: user.foto,
                  titulo: user.titulo,
                  autorId: user.id
                });
              }
            });

          }
        });

        allPosts.sort((a, b) => new Date(b.dataTime) - new Date(a.dataTime));

        setPosts(allPosts);
      })
      .catch(err => {
        console.error("Erro ao carregar posts:", err);
        setPosts([]);
      });
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("eloy_user"));
  const currentUserId = currentUser?.id;

  return (
    <section className="content">

      <aside className="left">
        <CardProfile local='eloy_user'/>
        <CardInfoProfile local='eloy_user'/>
      </aside>

      <section className="feed">

        {posts.length === 0 && (
          <p className="no-posts">Nenhuma publicação encontrada.</p>
        )}

        {posts.map(post => (
          <article key={`${post.autorId}_${post.id}`} className="post">

            <NavLink
              className="header-post"
              to={
                post.autorId === currentUserId
                  ? "/profile"
                  : `/user/${post.autorId}`
              }
            >
              <div className="info-user-header-post">
                <img src={post.foto || "assets/img/img-profile-default.png"} />
                <div>
                  <div className="name-data-post">
                    <h1>{post.autor}</h1>
                    <h3>•</h3>
                    <h3>{formatTime(post.dataTime)}</h3>
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
              <p>{renderContentWithMentions(post.conteudo)}</p>
            </section>

            <section className="footer-post">
              <button>{post.likes?.length || 0}<i className="fa-regular fa-thumbs-up"></i>Curtir</button>
              <button>{post.comentarios?.length || 0}<i className="fa-regular fa-comment"></i>Comentar</button>
              <button>{post.compartilhamentos?.length || 0}<i className="fa-regular fa-share-from-square"></i>Compartilhar</button>
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
