import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import CardAds from "../components/ui/CardAds";
import CardNewslatter from "../components/ui/CardNewslatter";
import useAuthRedirect from "../hook/useAuthRedirect";
import { supabase } from "../hook/supabaseClient";
import useProfile from "../hook/useProfile";

const Publish = () => {
  useAuthRedirect();

  const { data: user, isLoading } = useProfile();

  const [content, setContent] = useState("");

  const limitTitle = (text) => {
    if (!text) return "";
    return text.length > 65 ? text.substring(0, 65) + "..." : text;
  };

  const publishMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      alert("Publicado com sucesso!");
    },
    onError: () => {
      alert("Erro ao publicar");
    },
  });

  if (isLoading || !user) return null;

  return (
    <section className="content">
      <section className="publish">
        <article className="header-publish">
          <div className="user-header-publish">
            <img
              src={user.foto?.trim() || "/assets/img/img-profile-default.png"}
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

          <button
            className="active"
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
          >
            {publishMutation.isPending ? "Publicando..." : "Publicar"}
          </button>
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
