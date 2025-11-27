import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardLanguages = ({ profileId }) => {
  const { data: me } = useProfile(); // usuário logado
  const [idiomas, setIdiomas] = useState([]);

  useEffect(() => {
    if (!me) return;

    const fetchLanguages = async () => {
      try {
        const id = profileId || me.id;

        // Buscar idiomas do perfil no Supabase
        const { data: user, error } = await supabase
          .from("profiles")
          .select("id, idiomas")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar idiomas:", error);
          return;
        }

        if (Array.isArray(user.idiomas)) {
          setIdiomas(user.idiomas);
        } else {
          setIdiomas([]);
        }
      } catch (err) {
        console.error("Erro ao carregar idiomas:", err);
      }
    };

    fetchLanguages();
  }, [me, profileId]);

  if (!idiomas || idiomas.length === 0) return null; // Não mostra se não houver idiomas

  const adm = !profileId || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Idiomas" btnPlus to="languages" adm={adm} />

      <section className="ctn-languages">
        {idiomas.map((item, index) =>
          item?.idioma && (
            <div key={index} className="languages">
              <article className="language">
                <h1>{item.idioma}</h1>
                <h2>{item.nivel}</h2>
              </article>

              {index < idiomas.length - 1 && <hr />}
            </div>
          )
        )}
      </section>
    </section>
  );
};

export default CardLanguages;
