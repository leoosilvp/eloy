import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../hook/supabaseClient";

const CardInfoProfile = ({ local }) => {

  const [seguidores, setSeguidores] = useState(0);
  const [seguindo, setSeguindo] = useState(0);
  const [estrelas, setEstrelas] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userId = user.id;

      // Contar seguidores -> quem me segue
      const { count: totalSeguidores } = await supabase
        .from("followers")
        .select("id", { count: "exact", head: true })
        .eq("following_id", userId);

      // Contar seguindo -> quem eu sigo
      const { count: totalSeguindo } = await supabase
        .from("followers")
        .select("id", { count: "exact", head: true })
        .eq("follower_id", userId);

      // Contar estrelas do usuário
      const { count: totalEstrelas } = await supabase
        .from("stars")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      setSeguidores(totalSeguidores || 0);
      setSeguindo(totalSeguindo || 0);
      setEstrelas(totalEstrelas || 0);
    };

    loadData();
  }, [local]);

  return (
    <article className="card-info-profile">
      <Link to='/profile'>Seguidores: <span>{seguidores}</span></Link>
      <Link to='/profile'>Seguindo: <span>{seguindo}</span></Link>
      <Link to='/profile'>Estrelas: <span>{estrelas}</span></Link>
    </article>
  );
};

export default CardInfoProfile;
