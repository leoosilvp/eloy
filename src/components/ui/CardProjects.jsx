import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import { supabase } from "../../hook/supabaseClient";
import useProfile from "../../hook/useProfile";

const CardProjects = () => {
  const { username } = useParams(); // pega da URL /user/:username
  const location = useLocation();
  const { data: me } = useProfile(); // usuário logado

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);

      try {
        // Se for /profile, pega os projetos do usuário logado
        if (location.pathname === "/profile") {
          setProjects(me?.projetos || []);
          setProfileId(me?.id || null);
          return;
        }

        // Se for /user/:username, busca pelo user_name no Supabase
        if (username) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, projetos")
            .ilike("user_name", username)
            .single();

          if (error || !data) {
            setProjects([]);
            setProfileId(null);
            return;
          }

          setProjects(data.projetos || []);
          setProfileId(data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar projetos do perfil:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [username, location.pathname, me]);

  if (loading || !projects || projects.length === 0) return null;

  const adm = location.pathname === "/profile" || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Projetos" btnPlus to="projects" adm={adm} />

      <section className="ctn-projects">
        {projects.map((item, index) =>
          item?.titulo ? (
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
          ) : null
        )}
      </section>
    </section>
  );
};

export default CardProjects;
