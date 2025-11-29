import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import HeaderContentSettings from "./HeaderContentSettings";
import { supabase } from "../../hook/supabaseClient";

const Introduction = () => {
  const {
    photo, setPhoto,
    name, setName,
    title, setTitle,
    state: uf, setState: setUf,
    country, setCountry,
    birthday, setBirthday,
    setProfileId
  } = useOutletContext();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfileId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("foto, nome, titulo, estado, pais, aniversario")
        .eq("id", user.id)
        .single();

      if (profile) {
        setPhoto(profile.foto || "");
        setName(profile.nome || "");
        setTitle(profile.titulo || "");
        setUf(profile.estado || "");
        setCountry(profile.pais || "");
        setBirthday(profile.aniversario || "");
      }
    };

    loadProfile();
  }, [
    setPhoto, setName, setTitle,
    setUf, setCountry, setBirthday,
    setProfileId
  ]);

  return (
    <section className="ctn-introduction">
      <HeaderContentSettings title="introdução" />

      <section className="content-change">

        {/* FOTO COM BOTÃO, MAS SEM UPLOAD */}
        <section className="change-img-profile">
          <img
            src={photo || "/assets/img/img-profile-default.png"}
            alt="Foto do usuário"
          />

          <div>
            <button>
              Trocar foto
            </button>

            <p>Função de troca de foto será adicionada futuramente.</p>
          </div>
        </section>

        <section className="ctn-change-settings">

          {/* NOME */}
          <article className="change-name">
            <label>Nome:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </article>

          {/* TÍTULO */}
          <article className="change-title">
            <label>Título:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={103}
            />
          </article>

          {/* ESTADO */}
          <article className="change-state">
            <label>Estado:</label>
            <input
              type="text"
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              maxLength={2}
            />
          </article>

          {/* PAÍS */}
          <article className="change-country">
            <label>País:</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </article>

          {/* ANIVERSÁRIO */}
          <article className="change-birthday">
            <label>Aniversário:</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </article>

        </section>
      </section>
    </section>
  );
};

export default Introduction;
