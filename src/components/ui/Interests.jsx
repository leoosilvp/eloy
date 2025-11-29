import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import HeaderContentSettings from "./HeaderContentSettings";
import { supabase } from "../../hook/supabaseClient";

const Interests = () => {
  const {
    interests, setInterests,
    inputValue, setInputValue,
    setProfileId
  } = useOutletContext();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfileId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("areainteresses")
        .eq("id", user.id)
        .single();

      if (profile) {
        setInterests(profile.areainteresses || []);
      }
    };

    loadProfile();
  }, [setInterests, setProfileId]);

  const addInterest = () => {
    if (!inputValue.trim()) return;
    setInterests(prev => [...prev, inputValue.trim()]);
    setInputValue("");
  };

  const removeInterest = (index) => {
    setInterests(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="ctn-interests">
      <HeaderContentSettings title="Interesses" />

      <section className="content-change">
        <p>
          Adicione os tópicos que representam seus gostos e áreas de atuação.
        </p>

        {/* INPUT */}
        <article className="add-interests">
          <label>Adicionar Interesses</label>

          <input
            type="text"
            placeholder="ex: Desenvolvimento mobile"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addInterest()}
          />

          <button type="button" onClick={addInterest}>
            Adicionar
          </button>
        </article>

        {/* LISTA */}
        <section className="interests">
          {interests.length ? (
            interests.map((item, idx) => (
              <p key={idx}>
                {item}
                <span
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => removeInterest(idx)}
                >
                  {" "}x
                </span>
              </p>
            ))
          ) : (
            <p>Nenhum interesse adicionado.</p>
          )}
        </section>
      </section>
    </section>
  );
};

export default Interests;
