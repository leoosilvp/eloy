import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";
import { supabase } from "../../hook/supabaseClient";

const CardAcademic = () => {
  const { username } = useParams(); // Pega da URL /user/:username
  const location = useLocation();
  const { data: me } = useProfile(); // Usuário logado

  const [formacao, setFormacao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchFormacao = async () => {
      setLoading(true);

      try {
        // Caso seja /profile, mostra os dados do usuário logado
        if (location.pathname === "/profile") {
          setFormacao(me?.formacao || []);
          setProfileId(me?.id || null);
          return;
        }

        // Caso seja /user/:username, busca pelo user_name no Supabase
        if (username) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, formacao")
            .ilike("user_name", username)
            .single();

          if (error || !data) {
            setFormacao([]);
            setProfileId(null);
            return;
          }

          setFormacao(Array.isArray(data.formacao) ? data.formacao : []);
          setProfileId(data.id);
        }
      } catch (err) {
        console.error("Erro ao carregar formação acadêmica:", err);
        setFormacao([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFormacao();
  }, [username, location.pathname, me]);

  if (loading || !formacao || formacao.length === 0) return null;

  // Define se o perfil é do usuário logado
  const adm = location.pathname === "/profile" || profileId === me?.id;

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
