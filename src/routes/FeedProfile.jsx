import { NavLink, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CardAds from '../components/ui/CardAds'
import CardInfoProfile from '../components/ui/CardInfoProfile'
import CardNewslatter from '../components/ui/CardNewslatter'
import CardProfile from '../components/ui/CardProfile'
import '../css/center.css'

const FeedProfile = () => {

  const { id } = useParams();

  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {

        const user = data.find(u => u.id === id);

        if (!user) return;

        setCurrentUser(user);

        if (user.posts) {
          const sorted = [...user.posts].sort(
            (a, b) => new Date(b.dataTime) - new Date(a.dataTime)
          );
          setUserPosts(sorted);
        }
      });

  }, [id]);

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

      return (
        <NavLink
          key={index}
          to={`/user/${mentionedId}`}
          className="mention-link"
        >
          @{mentionedId}
        </NavLink>
      );
    });
  };

  if (!currentUser) return null;

  const loggedUser = JSON.parse(localStorage.getItem("eloy_user"));

  const localType =
    loggedUser && loggedUser.id === id
      ? "eloy_user"
      : "current_profile_id";

  return (
    <section className="content">

      <aside className='left'>
        <CardProfile local={localType} />
        <CardInfoProfile local={localType} />
      </aside>

      <section className='feed-profile'>

        {userPosts.length === 0 && (
          <h2 className="no-posts">Nenhuma publicação encontrada.</h2>
        )}

        {userPosts.map(post => (
          <article key={post.id} className='post'>

            <NavLink className='header-post'>
              <div className="info-user-header-post">
                <img
                  src={currentUser.foto?.trim() || "/assets/img/img-profile-default.png"}
                  alt={currentUser.nome}
                />
                <div>
                  <div className="name-data-post">
                    <h1>{currentUser.nome}</h1>
                    <h3>•</h3>
                    <h3>{formatTime(post.dataTime)}</h3>
                  </div>
                  <h2>
                    {currentUser.titulo?.length > 65
                      ? currentUser.titulo.slice(0, 65) + "..."
                      : currentUser.titulo || ""}
                  </h2>
                </div>
              </div>

              <button><i className="fa-solid fa-ellipsis"></i></button>
            </NavLink>

            <section className="content-post">
              <p>{renderContentWithMentions(post.conteudo)}</p>
            </section>

            <section className="footer-post">
              <button>
                {post.likes?.length || 0}
                <i className="fa-regular fa-thumbs-up"></i>Curtir
              </button>
              <button>
                {post.comentarios?.length || 0}
                <i className="fa-regular fa-comment"></i>Comentar
              </button>
              <button>
                {post.compartilhamentos?.length || 0}
                <i className="fa-regular fa-share-from-square"></i>Compartilhar
              </button>
            </section>

          </article>
        ))}

      </section>

      <aside className='right'>
        <CardNewslatter />
        <CardAds />
      </aside>

    </section>
  );
};

export default FeedProfile;
