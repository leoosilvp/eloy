import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";

const CardAbout = ({ profileId }) => {
  const { data: me } = useProfile(); // usuário logado
  const [sobre, setSobre] = useState("");

  useEffect(() => {
    if (!me) return;

    // Se profileId não foi passado, assume que é o do usuário logado
    const isUser = !profileId || profileId === me.id;

    if (isUser && me.resumo) {
      setSobre(me.resumo);
    } else {
      setSobre("");
    }
  }, [me, profileId]);

  // Não renderiza nada se não houver resumo
  if (!sobre) return null;

  const adm = !profileId || profileId === me?.id;

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
