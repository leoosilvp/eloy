import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import HeaderCard from './HeaderCard'

const CardFeedProfile = ({ local }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [lastPost, setLastPost] = useState(null);

    useEffect(() => {
        const userLogged = JSON.parse(localStorage.getItem(local));
        if (!userLogged) return;

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                const user = data.find(u => u.id === userLogged.id);
                if (!user) return;

                setCurrentUser(user);

                if (user.posts && user.posts.length > 0) {
                    const sorted = [...user.posts].sort(
                        (a, b) => new Date(b.dataTime) - new Date(a.dataTime)
                    );
                    setLastPost(sorted[0]);
                }
            });
    });

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
                    to={mentionedId === currentUser?.id ? "/profile" : `/user/${mentionedId}`}
                    className="mention-link"
                >
                    @{mentionedId}
                </NavLink>
            );
        });
    };

    return (
        <section className='ctn-card'>
            <HeaderCard
                title='Publicações'
                btnPlus
                to='experiences'
                adm={local === "eloy_user"}
            />

            <section className='ctn-feed-profile'>
                <p className='title-card-feed-profile'>Última publicação</p>

                {!lastPost ? (
                    <p className="no-posts">Nenhuma publicação ainda.</p>
                ) : (
                    <article className='post'>
                        <NavLink className='header-post'>
                            <div className="info-user-header-post">
                                <img
                                    src={currentUser?.foto?.trim() || "assets/img/img-profile-default.png"}
                                    alt={currentUser?.nome}
                                />
                                <div>
                                    <div className="name-data-post">
                                        <h1>{currentUser?.nome}</h1>
                                        <h3>•</h3>
                                        <h3>{formatTime(lastPost.dataTime)}</h3>
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
                            <p>{renderContentWithMentions(lastPost.conteudo)}</p>
                        </section>

                        <section className="footer-post">
                            <button><i className="fa-regular fa-thumbs-up"></i>Curtir</button>
                            <button><i className="fa-regular fa-comment"></i>Comentar</button>
                            <button><i className="fa-regular fa-share-from-square"></i>Compartilhar</button>
                        </section>
                    </article>
                )}
            </section>

            {local === "eloy_user" ? (
                <NavLink to={`/user/${currentUser?.id}/feed profile`} className='btn-to-feed-profile'>
                    Acessar minhas publicações
                </NavLink>
            ) : (
                <NavLink
                    to={`/user/${JSON.parse(localStorage.getItem("current_profile_id"))?.id}/feed profile`}
                    className='btn-to-feed-profile'
                >
                    Visualizar publicações
                </NavLink>
            )}


        </section>
    );
};

export default CardFeedProfile;
