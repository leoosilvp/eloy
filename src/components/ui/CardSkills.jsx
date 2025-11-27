import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardSkills = ({ profileId }) => {
  const { data: me } = useProfile(); // usuário logado
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (!me) return;

    const fetchSkills = async () => {
      try {
        const id = profileId || me.id;

        // Buscar competências do perfil no Supabase
        const { data: user, error } = await supabase
          .from("profiles")
          .select("id, competencias")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar competências:", error);
          return;
        }

        if (Array.isArray(user.competencias)) {
          setSkills(user.competencias);
        } else {
          setSkills([]);
        }
      } catch (err) {
        console.error("Erro ao carregar competências:", err);
      }
    };

    fetchSkills();
  }, [me, profileId]);

  if (!skills || skills.length === 0) return null; // Não renderiza se não houver competências

  const adm = !profileId || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Competências" btnPlus to="skills" adm={adm} />

      <section className="ctn-skills">
        {skills.map((skill, index) =>
          skill && (
            <div key={index} className="skills">
              <article className="skill">
                <h1>{skill}</h1>
              </article>
              {index < skills.length - 1 && <hr />}
            </div>
          )
        )}
      </section>
    </section>
  );
};

export default CardSkills;
