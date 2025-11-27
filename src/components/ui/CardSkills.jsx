import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import { supabase } from "../../hook/supabaseClient";
import useProfile from "../../hook/useProfile";

const CardSkills = () => {
  const { username } = useParams();
  const location = useLocation();
  const { data: me } = useProfile(); // usuário logado

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const loadSkills = async () => {
      setLoading(true);

      try {
        // /profile → pega do usuário logado
        if (location.pathname === "/profile") {
          setSkills(me?.competencias || []);
          setProfileId(me?.id || null);
          return;
        }

        // /user/:username → busca pelo user_name
        if (username) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, competencias")
            .ilike("user_name", username)
            .single();

          if (error || !data) {
            setSkills([]);
            setProfileId(null);
            return;
          }

          setSkills(data.competencias || []);
          setProfileId(data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar competências do perfil:", err);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [username, location.pathname, me]);

  if (loading || !skills || skills.length === 0) return null;

  const adm = location.pathname === "/profile" || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Competências" btnPlus to="skills" adm={adm} />
      <section className="ctn-skills">
        {skills.map((skill, index) =>
          skill ? (
            <div key={index} className="skills">
              <article className="skill">
                <h1>{skill}</h1>
              </article>
              {index < skills.length - 1 && <hr />}
            </div>
          ) : null
        )}
      </section>
    </section>
  );
};

export default CardSkills;
