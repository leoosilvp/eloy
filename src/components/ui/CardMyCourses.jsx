import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardMyCourses = ({ profileId }) => {
  const { data: me } = useProfile(); // usuário logado
  const [certificacoes, setCertificacoes] = useState([]);

  useEffect(() => {
    if (!me) return;

    const fetchCourses = async () => {
      try {
        const id = profileId || me.id;

        // Buscar certificações do perfil no Supabase
        const { data: user, error } = await supabase
          .from("profiles")
          .select("id, certificacoes")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar certificações:", error);
          return;
        }

        if (Array.isArray(user.certificacoes)) {
          setCertificacoes(user.certificacoes);
        } else {
          setCertificacoes([]);
        }
      } catch (err) {
        console.error("Erro ao carregar certificações:", err);
      }
    };

    fetchCourses();
  }, [me, profileId]);

  if (!certificacoes || certificacoes.length === 0) return null; // Não mostra se não houver cursos

  const adm = !profileId || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Meus cursos" btnPlus to="courses" adm={adm} />

      <section className="ctn-my-courses">
        {certificacoes.map((item, index) =>
          item?.curso && (
            <div key={index} className="courses">
              <article className="course">
                <h1>{item.curso}</h1>
                <h2>{item.instituicao}</h2>
                <h3>{item.duracao}</h3>
              </article>

              {index < certificacoes.length - 1 && <hr />}
            </div>
          )
        )}
      </section>
    </section>
  );
};

export default CardMyCourses;
