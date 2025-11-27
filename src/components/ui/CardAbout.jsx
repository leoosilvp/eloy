import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import { supabase } from "../../hook/supabaseClient";
import useProfile from "../../hook/useProfile";

const CardAbout = () => {
  const { username } = useParams(); // pega da URL /user/:username
  const location = useLocation();
  const { data: me } = useProfile(); // usuário logado

  const [sobre, setSobre] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const loadAbout = async () => {
      setLoading(true);

      try {
        // Caso seja /profile, mostra o resumo do usuário logado
        if (location.pathname === "/profile") {
          setSobre(me?.resumo || "");
          setProfileId(me?.id || null);
          return;
        }

        // Caso seja /user/:username, busca pelo user_name
        if (username) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, resumo")
            .ilike("user_name", username)
            .single();

          if (error || !data) {
            setSobre("");
            setProfileId(null);
            return;
          }

          setSobre(data.resumo || "");
          setProfileId(data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar resumo do perfil:", err);
        setSobre("");
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
  }, [username, location.pathname, me]);

  if (loading || !sobre) return null;

  // Define se o perfil é do usuário logado
  const adm = location.pathname === "/profile" || profileId === me?.id;

  return (
    <section className="ctn-about">
      <HeaderCard title="Sobre" to="about" adm={adm} />
      <article className="about">
        <p>{sobre}</p>
      </article>
    </section>
  );
};

export default CardAbout;
