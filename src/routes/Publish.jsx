import { useEffect, useState } from "react";
import CardAds from "../components/ui/CardAds";
import CardNewslatter from "../components/ui/CardNewslatter";
import useAuthRedirect from "../hook/useAuthRedirect";

const Publish = () => {

  useAuthRedirect();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const logged = localStorage.getItem("eloy_user");
    if (!logged) return;

    const loggedUser = JSON.parse(logged);

    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {
        const u = data.find(item => item.id === loggedUser.id);
        if (u) setUser(u);
      });
  }, []);


  const limitTitle = (text) => {
    if (!text) return "";
    return text.length > 65 ? text.slice(0, 65) + "..." : text;
  };

  if (!user) return null;

  return (
    <section className="content">
      <section className="publish">
        <article className="header-publish">
          <div className="user-header-publish">
            <img src={user.foto?.trim() || "assets/img/img-profile-default.png"} />

            <section className="info-user-header-publish">
              <h1>{user.nome}</h1>
              <h2>{limitTitle(user.titulo)}</h2>
            </section>
          </div>

          <button><i className="fa-solid fa-ellipsis"></i></button>
        </article>

        <section className="input-publish">
          <textarea placeholder="O que você está pensando?.."/>
        </section>

        <section className="btns-publish">
          <div className="btn-add-content-publish">
            <button><i className="fa-regular fa-folder"></i></button>
            <button><i className="fa-regular fa-image"></i></button>
            <button><i className="fa-regular fa-face-smile"></i></button>
            <button><i className="fa-solid fa-ellipsis"></i></button>
          </div>
          <button className="active">Publicar</button>
        </section>
      </section>

      <aside className="right">
        <CardNewslatter />
        <CardAds />
      </aside>
    </section>
  )
}

export default Publish;
