import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardAcademic = ({ profileId }) => {
  const { data: me } = useProfile(); // usuário logado
  const [formacao, setFormacao] = useState([]);

  useEffect(() => {
    if (!me) return;

    const fetchFormacao = async () => {
      try {
        const id = profileId || me.id;

        // Buscar formação acadêmica do perfil no Supabase
        const { data: user, error } = await supabase
          .from("profiles")
          .select("id, formacao")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar formação acadêmica:", error);
          return;
        }

        if (Array.isArray(user.formacao)) {
          setFormacao(user.formacao);
        } else {
          setFormacao([]);
        }
      } catch (err) {
        console.error("Erro ao carregar formação acadêmica:", err);
      }
    };

    fetchFormacao();
  }, [me, profileId]);

  if (!formacao || formacao.length === 0) return null; // Não mostra se não houver dados

  const adm = !profileId || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Formação Acadêmica" btnPlus to="academic" adm={adm} />

      <section className="ctn-academics">
        {formacao.map((item, index) => (
          <div key={index} className="academics">
            <article className="academic">
              <h1>{item.instituicao}</h1>
              <h2>{item.curso}</h2>
              <h3>{item.ano}</h3>
            </article>
            {index < formacao.length - 1 && <hr />}
          </div>
        ))}
      </section>
    </section>
  );
};

export default CardAcademic;
