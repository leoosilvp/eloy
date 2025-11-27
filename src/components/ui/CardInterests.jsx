import { useEffect, useState } from "react";
import HeaderCard from "./HeaderCard";
import useProfile from "../../hook/useProfile";

const CardInterests = ({ profileId }) => {
  const { data: me } = useProfile();
  const [interesses, setInteresses] = useState([]);

  useEffect(() => {
    if (!me) return;

    const isUser = !profileId || profileId === me.id;

    if (isUser && Array.isArray(me.areainteresses)) {
      setInteresses(me.areainteresses);
    } else {
      setInteresses([]);
    }
  }, [me, profileId]);

  if (!interesses || interesses.length === 0) return null;

  const adm = !profileId || profileId === me?.id;

  return (
    <section className="ctn-card">
      <HeaderCard title="Interesses" to="interests" adm={adm} />
      <section className="my-interests">
        {interesses.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </section>
    </section>
  );
};

export default CardInterests;
