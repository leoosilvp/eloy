import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const Interests = () => {

  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("eloy_user");
    if (!user) return;

    const usuarioLogado = JSON.parse(user);

    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const userData = data.find(u => u.id === usuarioLogado.id);

          if (userData?.areainteresses) {
            setInterests(userData.areainteresses);
          }
        }
      })
      .catch(err => console.error("Erro ao carregar JSON:", err));
  }, []);

  return (
    <section className="ctn-interests">
      <HeaderContentSettings title='Interesses' />
      <section className="content-change">

        <p>Adicione os tópicos que representam seus gostos e áreas de atuação. Isso ajuda a personalizar sua experiência e conectar você a conteúdos que realmente importam.</p>

        <article className="add-interests">
          <label>Adicionar Interesses</label>
          <input type="text" placeholder="ex: Desenvolvimento mobile" />
        </article>

        <section className="interests">
          {interests.length > 0 ? (
            interests.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))
          ) : (
            <p>Nenhum interesse adicionado.</p>
          )}
        </section>

      </section>
    </section>
  )
}

export default Interests;
