import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardProjects = ({ profileId }) => {
  const { data: me } = useProfile(); // usuário logado
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!me) return;

    const fetchProjects = async () => {
      try {
        const id = profileId || me.id;

        // Buscar projetos do perfil no Supabase
        const { data: user, error } = await supabase
          .from("profiles")
          .select("id, projetos")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar projetos:", error);
          return;
        }

        if (Array.isArray(user.projetos)) {
          setProjects(user.projetos);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Erro ao carregar projetos:", err);
      }
    };

    fetchProjects();
  }, [me, profileId]);

  if (!projects || projects.length === 0) return null; // Não mostra se não houver projetos

  const adm = !profileId || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Projetos" btnPlus to="projects" adm={adm} />

      <section className="ctn-projects">
        {projects.map((item, index) =>
          item?.titulo && (
            <div key={index} className="projects">
              <article className="project">
                <h1>{item.titulo}</h1>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.link}
                  </a>
                )}
                <p>{item.descricao}</p>
              </article>
              {index < projects.length - 1 && <hr />}
            </div>
          )
        )}
      </section>
    </section>
  );
};

export default CardProjects;
