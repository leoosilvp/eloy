import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import { supabase } from "../../hook/supabaseClient";
import useProfile from "../../hook/useProfile";

const CardLanguages = () => {
  const { username } = useParams(); // pega da URL /user/:username
  const location = useLocation();
  const { data: me } = useProfile(); // usuário logado

  const [idiomas, setIdiomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const loadLanguages = async () => {
      setLoading(true);

      try {
        // Caso seja /profile, pega do usuário logado
        if (location.pathname === "/profile") {
          setIdiomas(me?.idiomas || []);
          setProfileId(me?.id || null);
          return;
        }

        // Caso seja /user/:username, busca pelo user_name no Supabase
        if (username) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, idiomas")
            .ilike("user_name", username)
            .single();

          if (error || !data) {
            setIdiomas([]);
            setProfileId(null);
            return;
          }

          setIdiomas(data.idiomas || []);
          setProfileId(data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar idiomas do perfil:", err);
        setIdiomas([]);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, [username, location.pathname, me]);

  if (loading || !idiomas || idiomas.length === 0) return null;

  const adm = location.pathname === "/profile" || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Idiomas" btnPlus to="languages" adm={adm} />

      <section className="ctn-languages">
        {idiomas.map((item, index) =>
          item?.idioma ? (
            <div key={index} className="languages">
              <article className="language">
                <h1>{item.idioma}</h1>
                <h2>{item.nivel}</h2>
              </article>
              {index < idiomas.length - 1 && <hr />}
            </div>
          ) : null
        )}
      </section>
    </section>
  );
};

export default CardLanguages;
