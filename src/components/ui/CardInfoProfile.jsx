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

      // Buscar perfil do usuário logado
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("seguidores, seguindo, estrelas")
        .eq("id", user.id)
        .single();

      if (error || !profileData) {
        console.error("Erro ao carregar perfil:", error);
        return;
      }

      setSeguidores((profileData.seguidores || []).length);
      setSeguindo((profileData.seguindo || []).length);
      setEstrelas((profileData.estrelas || []).length);
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
