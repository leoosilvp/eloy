import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import HeaderContentSettings from "./HeaderContentSettings";
import { supabase } from "../../hook/supabaseClient";

const About = () => {
  const {
    about, setAbout,
    setProfileId
  } = useOutletContext();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Erro ao pegar usuário:", error);
        return;
      }

      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("resumo")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erro ao carregar perfil:", profileError);
        return;
      }

      // Guarda o id para o botão global SALVAR usar
      setProfileId(user.id);

      // Preenche o estado global
      setAbout(profile?.resumo || "");
    };

    loadProfile();
  }, [setAbout, setProfileId]);

  return (
    <section className="ctn-change-about">
      <HeaderContentSettings title="Sobre" />

      <section className="content-change">
        <p>
          Escreva um breve resumo sobre você, destacando sua trajetória, habilidades
          e o que mais define sua identidade profissional.
        </p>

        <article className="change-about">
          <label>Sobre</label>

          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Escreva seu resumo aqui..."
          />
        </article>
      </section>
    </section>
  );
};

export default About;
