import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../hook/supabaseClient";

const CardInfoProfile = ({ local }) => {
  const [seguidores, setSeguidores] = useState(0);
  const [seguindo, setSeguindo] = useState(0);
  const [estrelas, setEstrelas] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      // Obter sessão atual
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) return;
      const userId = user.id;

      // Contar seguidores -> quem segue o usuário
      const { count: seguidoresCount } = await supabase
        .from("followers")
        .select("id", { count: "exact", head: true })
        .eq("following_id", userId);

      // Contar seguindo -> quem o usuário segue
      const { count: seguindoCount } = await supabase
        .from("followers")
        .select("id", { count: "exact", head: true })
        .eq("follower_id", userId);

      // Contar estrelas do usuário
      const { count: estrelasCount } = await supabase
        .from("stars")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      setSeguidores(seguidoresCount || 0);
      setSeguindo(seguindoCount || 0);
      setEstrelas(estrelasCount || 0);
    };

    loadData();
  }, [local]);

  return (
    <article className="card-info-profile">
      <Link to="/profile">
        Seguidores: <span>{seguidores}</span>
      </Link>

      <Link to="/profile">
        Seguindo: <span>{seguindo}</span>
      </Link>

      <Link to="/profile">
        Estrelas: <span>{estrelas}</span>
      </Link>
    </article>
  );
};

export default CardInfoProfile;
