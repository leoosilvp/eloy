import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardExperiences = ({ profileId }) => {
  const { data: me } = useProfile(); // usuário logado
  const [experiencias, setExperiencias] = useState([]);

  useEffect(() => {
    if (!me) return;

    const fetchExperiences = async () => {
      try {
        const id = profileId || me.id;

        // Buscar experiências do usuário no Supabase
        const { data: user, error } = await supabase
          .from("profiles")
          .select("id, experiencias")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar experiências:", error);
          return;
        }

        if (Array.isArray(user.experiencias)) {
          setExperiencias(user.experiencias);
        } else {
          setExperiencias([]);
        }
      } catch (err) {
        console.error("Erro ao carregar experiências:", err);
      }
    };

    fetchExperiences();
  }, [me, profileId]);

  const hasContent = (obj) => {
    if (!obj) return false;

    return Object.values(obj).some((value) => {
      if (typeof value === "string" && value.trim() !== "") return true;
      if (typeof value === "number") return true;
      return false;
    });
  };

  if (!experiencias || experiencias.length === 0) return null; // Não mostra o componente se não houver experiências

  const adm = !profileId || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Experiências" btnPlus to="experiences" adm={adm} />

      <section className="ctn-experiences">
        {experiencias.map((item, index) =>
          hasContent(item) ? (
            <div key={index}>
              <article className="experience">
                <h1>{item.cargo}</h1>
                <h2>
                  {item.empresa} • {item.tipo}
                </h2>
                <h3>
                  {item.inicio} - {item.fim}
                </h3>
                <h4>{item.local}</h4>
                <p>{item.descricao}</p>
              </article>
              {index < experiencias.length - 1 && <hr />}
            </div>
          ) : null
        )}
      </section>
    </section>
  );
};

export default CardExperiences;
