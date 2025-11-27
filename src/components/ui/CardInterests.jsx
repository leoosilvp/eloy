import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import { supabase } from "../../hook/supabaseClient";
import useProfile from "../../hook/useProfile";

const CardInterests = () => {
  const { username } = useParams(); // pega da URL /user/:username
  const location = useLocation();
  const { data: me } = useProfile(); // usuário logado

  const [interesses, setInteresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const loadInterests = async () => {
      setLoading(true);

      try {
        // Caso seja /profile, pega do usuário logado
        if (location.pathname === "/profile") {
          setInteresses(me?.areainteresses || []);
          setProfileId(me?.id || null);
          return;
        }

        // Caso seja /user/:username, busca pelo user_name no Supabase
        if (username) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, areainteresses")
            .ilike("user_name", username)
            .single();

          if (error || !data) {
            setInteresses([]);
            setProfileId(null);
            return;
          }

          setInteresses(data.areainteresses || []);
          setProfileId(data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar interesses do perfil:", err);
        setInteresses([]);
      } finally {
        setLoading(false);
      }
    };

    loadInterests();
  }, [username, location.pathname, me]);

  if (loading || !interesses || interesses.length === 0) return null;

  const adm = location.pathname === "/profile" || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Interesses" to="interests" adm={adm} />
      <section className="my-interests">
        {interesses.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </section>
    </section>
  );
};

export default CardInterests;
