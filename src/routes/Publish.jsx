import { useEffect, useState } from "react";
import CardAds from "../components/ui/CardAds";
import CardNewslatter from "../components/ui/CardNewslatter";
import useAuthRedirect from "../hook/useAuthRedirect";
import { supabase } from "../hook/supabaseClient";

const Publish = () => {
  useAuthRedirect();

  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");

  // Carregar dados do usuário logado
  useEffect(() => {
    const loadUser = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      setUser(profile);
    };

    loadUser();
  }, []);

  const limitTitle = (text) => {
    if (!text) return "";
    return text.length > 65 ? text.slice(0, 65) + "..." : text;
  };

  // Criar uma publicação
  const publishPost = async () => {
    if (!content.trim()) return;

    const { error } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        content: content.trim()
      });

    if (error) {
      console.error("Erro ao publicar:", error);
      alert("Erro ao publicar");
      return;
    }

    setContent(""); 
    alert("Publicado com sucesso!");
  };

  if (!user) return null;

  return (
    <section className="content">
      <section className="publish">
        <article className="header-publish">
          <div className="user-header-publish">
            <img
              src={user.foto?.trim() || "assets/img/img-profile-default.png"}
              alt="Foto do usuário"
            />

            <section className="info-user-header-publish">
              <h1>{user.nome}</h1>
              <h2>{limitTitle(user.titulo)}</h2>
            </section>
          </div>

          <button><i className="fa-solid fa-ellipsis"></i></button>
        </article>

        <section className="input-publish">
          <textarea
            placeholder="O que você está pensando?.."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </section>

        <section className="btns-publish">
          <div className="btn-add-content-publish">
            <button><i className="fa-regular fa-folder"></i></button>
            <button><i className="fa-regular fa-image"></i></button>
            <button><i className="fa-regular fa-face-smile"></i></button>
            <button><i className="fa-solid fa-ellipsis"></i></button>
          </div>
          <button className="active" onClick={publishPost}>Publicar</button>
        </section>
      </section>

      <aside className="right">
        <CardNewslatter />
        <CardAds />
      </aside>
    </section>
  );
};

export default Publish;
