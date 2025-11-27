import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import { supabase } from "../../hook/supabaseClient";
import useProfile from "../../hook/useProfile";

const CardMyCourses = () => {
  const { username } = useParams(); // pega da URL /user/:username
  const location = useLocation();
  const { data: me } = useProfile(); // usuário logado

  const [certificacoes, setCertificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);

      try {
        // Se for /profile, pega do usuário logado
        if (location.pathname === "/profile") {
          setCertificacoes(me?.certificacoes || []);
          setProfileId(me?.id || null);
          return;
        }

        // Se for /user/:username, busca pelo user_name no Supabase
        if (username) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, certificacoes")
            .ilike("user_name", username)
            .single();

          if (error || !data) {
            setCertificacoes([]);
            setProfileId(null);
            return;
          }

          setCertificacoes(data.certificacoes || []);
          setProfileId(data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar cursos do perfil:", err);
        setCertificacoes([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [username, location.pathname, me]);

  if (loading || !certificacoes || certificacoes.length === 0) return null;

  const adm = location.pathname === "/profile" || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Meus cursos" btnPlus to="courses" adm={adm} />

      <section className="ctn-my-courses">
        {certificacoes.map((item, index) =>
          item?.curso ? (
            <div key={index} className="courses">
              <article className="course">
                <h1>{item.curso}</h1>
                <h2>{item.instituicao}</h2>
                <h3>{item.duracao}</h3>
              </article>
              {index < certificacoes.length - 1 && <hr />}
            </div>
          ) : null
        )}
      </section>
    </section>
  );
};

export default CardMyCourses;
