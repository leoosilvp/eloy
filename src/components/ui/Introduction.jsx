import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const Introduction = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("eloy_user");
    if (!user) return;

    const usuarioLogado = JSON.parse(user);

    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const info = data.find(u => u.id === usuarioLogado.id);
          if (info) setUserData(info);
        }
      })
      .catch(err => console.error("Erro ao carregar JSON:", err));
  }, []);

  if (!userData) return null;

  const fotoSrc =
    userData.foto && userData.foto.trim() !== ""
      ? userData.foto
      : "/assets/img/img-profile-default.png";

  return (
    <section className="ctn-introduction">
      <HeaderContentSettings title="introdução" />

      <section className="content-change">
        <section className="change-img-profile">
          <img src={fotoSrc} alt="Foto do usuário" />

          <div>
            <button>Trocar foto</button>
            <p>
              Arraste ou selecione uma imagem para definir sua foto de perfil.
              Para garantir a melhor qualidade visual, utilize uma imagem quadrada com resolução recomendada de 250×250 pixels.
              O tamanho máximo permitido para upload é de 20 MB e formatos comuns, como JPG e PNG, são aceitos.
            </p>
          </div>
        </section>

        <section className="ctn-change-settings">

          <article className="change-name">
            <label>Nome:</label>
            <input
              type="text"
              maxLength={50}
              value={userData.nome}
              readOnly
            />
          </article>

          <article className="change-title">
            <label>Título:</label>
            <input
              type="text"
              maxLength={103}
              value={userData.titulo}
              readOnly
            />
          </article>

          <article className="change-state">
            <label>Estado:</label>
            <input
              type="text"
              value={userData.estado}
              readOnly
            />
          </article>

          <article className="change-country">
            <label>País:</label>
            <input
              type="text"
              value={userData.pais}
              readOnly
            />
          </article>

          <article className="change-birthday">
            <label>Aniversário:</label>
            <input
              type="date"
              value={userData.aniversario}
              readOnly
            />
          </article>

        </section>
      </section>
    </section>
  );
};

export default Introduction;
