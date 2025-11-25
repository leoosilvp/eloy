import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CardInfoProfile = ({local}) => {

  const [seguidores, setSeguidores] = useState(0);
  const [seguindo, setSeguindo] = useState(0);
  const [estrelas, setEstrelas] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem(local);
    if (!user) return;

    const usuarioLogado = JSON.parse(user);

    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {

          const userData = data.find(u => u.id === usuarioLogado.id);

          if (userData) {
            setSeguidores(
              Array.isArray(userData.seguidores) ? userData.seguidores.length : 0
            );

            setSeguindo(
              Array.isArray(userData.seguindo) ? userData.seguindo.length : 0
            );

            setEstrelas(
              Array.isArray(userData.estrelas) ? userData.estrelas.length : 0
            );
          }
        }
      })
      .catch(err => console.error("Erro ao carregar dados:", err));
  });

  return (
    <article className="card-info-profile">
      <Link to='/profile'>Seguidores: <span>{seguidores}</span></Link>
      <Link to='/profile'>Seguindo: <span>{seguindo}</span></Link>
      <Link to='/profile'>Estrelas: <span>{estrelas}</span></Link>
    </article>
  );
};

export default CardInfoProfile;
