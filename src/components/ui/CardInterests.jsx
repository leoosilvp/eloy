import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";

const CardInterests = ({local}) => {

  const [interesses, setInteresses] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem(local);
    if (!user) return;

    const usuarioLogado = JSON.parse(user);

    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const userData = data.find(u => u.id === usuarioLogado.id);

          if (userData && userData.areainteresses) {
            setInteresses(userData.areainteresses);
          }
        }
      })
      .catch(err => console.error("Erro ao carregar interesses:", err));
  });

  return (
    <section className="ctn-card">
      <HeaderCard title='Interesses' to='interests' adm={local === "eloy_user"} />
      <section className="my-interests">

        {interesses.map((item, index) => (
          <p key={index}>{item}</p>
        ))}

      </section>
    </section>
  );
};

export default CardInterests;
