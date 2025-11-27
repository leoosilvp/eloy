import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardExperiences = () => {
  const { username } = useParams(); // pega da URL /user/:username
  const location = useLocation();
  const { data: me } = useProfile(); // usuário logado

  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);

      try {
        // Se for /profile, mostra os dados do usuário logado
        if (location.pathname === "/profile") {
          setExperiencias(me?.experiencias || []);
          setProfileId(me?.id || null);
          return;
        }

        // Se for /user/:username, busca pelo user_name no Supabase
        if (username) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, experiencias")
            .ilike("user_name", username)
            .single();

          if (error || !data) {
            setExperiencias([]);
            setProfileId(null);
            return;
          }

          setExperiencias(Array.isArray(data.experiencias) ? data.experiencias : []);
          setProfileId(data.id);
        }
      } catch (err) {
        console.error("Erro ao carregar experiências:", err);
        setExperiencias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [username, location.pathname, me]);

  if (loading || !experiencias || experiencias.length === 0) return null;

  const adm = location.pathname === "/profile" || profileId === me?.id;

  const hasContent = (obj) => {
    if (!obj) return false;
    return Object.values(obj).some((value) => {
      if (typeof value === "string" && value.trim() !== "") return true;
      if (typeof value === "number") return true;
      return false;
    });
  };

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
