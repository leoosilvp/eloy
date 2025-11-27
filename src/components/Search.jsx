import "../css/search.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../hook/supabaseClient";
import useProfile from "../hook/useProfile";

const Search = () => {
  const { data: me } = useProfile(); // usuário logado
  const [users, setUsers] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();

  const normalize = (text) =>
    text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const limitText = (text, max = 68) =>
    text && text.length > max ? text.slice(0, max) + "..." : text;

  const openProfile = (id) => {
    navigate(`/user/${id}`);
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const box = document.querySelector(".search");
      if (box && !box.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!me) return;

    const fetchUsers = async () => {
      try {
        const { data: allUsers, error } = await supabase
          .from("profiles")
          .select("id, nome, foto, titulo, area, cargo, areainteresses");

        if (error) throw error;

        // Excluir o usuário logado
        const otherUsers = allUsers.filter(u => u.id !== me.id);
        setUsers(otherUsers);

        // Ranking baseado em interesses e área
        const ranked = otherUsers
          .map(u => {
            let score = 0;

            const normArea = u.area ? normalize(u.area) : null;
            const normCargo = u.cargo ? normalize(u.cargo) : null;
            const normTitle = u.titulo ? normalize(u.titulo) : null;
            const userArea = me.area ? normalize(me.area) : null;
            const userCargo = me.cargo ? normalize(me.cargo) : null;

            if (normArea && userArea && normArea === userArea) score += 12;
            if (normCargo && userCargo && normCargo === userCargo) score += 10;
            if (normTitle && userCargo && normTitle.includes(userCargo)) score += 6;
            if (normTitle && userArea && normTitle.includes(userArea)) score += 6;
            if (normArea && userArea && (normArea.includes(userArea) || userArea.includes(normArea))) score += 3;
            if (normCargo && userCargo && (normCargo.includes(userCargo) || userCargo.includes(normCargo))) score += 3;

            if (Array.isArray(u.areainteresses) && Array.isArray(me.areainteresses)) {
              const matches = u.areainteresses.filter(itemU =>
                me.areainteresses.some(itemL =>
                  normalize(itemU) === normalize(itemL) ||
                  normalize(itemU).includes(normalize(itemL)) ||
                  normalize(itemL).includes(normalize(itemU))
                )
              ).length;
              score += matches * 4;
            }

            // Sinônimos fracos
            const weakSynonyms = [
              ["tecnologia", "ti", "desenvolvimento", "programacao", "dev"],
              ["marketing", "publicidade", "branding"],
              ["engenharia", "projetos", "automacao"],
              ["gestao", "administracao", "lideranca"]
            ];

            for (const group of weakSynonyms) {
              const hasUser = group.includes(userArea) || group.includes(userCargo);
              const hasOther = group.includes(normArea) || group.includes(normCargo);
              if (hasUser && hasOther) score += 5;
            }

            return { ...u, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 20);

        setSuggested(ranked);

      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      }
    };

    fetchUsers();
  }, [me]);

  useEffect(() => {
    if (!me || search.trim() === "") {
      setFiltered([]);
      return;
    }

    const term = normalize(search);

    const result = users.filter(u =>
      normalize(u.nome).includes(term) ||
      (u.area && normalize(u.area).includes(term)) ||
      (Array.isArray(u.areainteresses) && u.areainteresses.some(i => normalize(i).includes(term)))
    );

    setFiltered(result);
  }, [search, users, me]);

  if (!open) return null;

  return (
    <article className="ctn-search">
      <section className="search">
        <article className='input-search'>
          <button><i className='fa-solid fa-search'></i></button>
          <input
            type="text"
            autoFocus
            placeholder="Pesquisar usuários..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </article>

        {search === "" && (
          <section className='users-search'>
            <h1>Com base nos seus interesses</h1>
            {suggested.map(user => (
              <article
                className='user'
                key={user.id}
                onClick={() => openProfile(user.id)}
              >
                <section className='info-user'>
                  <img src={user.foto || "assets/img/img-profile-default.png"} />
                  <div className="content-info-user">
                    <h2>{user.nome}</h2>
                    <h3>{limitText(user.titulo || user.area)}</h3>
                  </div>
                </section>
                <button><i className='fa-solid fa-user-plus'></i></button>
              </article>
            ))}
          </section>
        )}

        {search !== "" && (
          <section className='users-search'>
            <h1>Resultados</h1>
            {filtered.length === 0 && <p><i className='fa-regular fa-face-frown'></i> Nenhum usuário encontrado.</p>}
            {filtered.map(user => (
              <article
                className='user'
                key={user.id}
                onClick={() => openProfile(user.id)}
              >
                <section className='info-user'>
                  <img src={user.foto || "assets/img/img-profile-default.png"} />
                  <div className="content-info-user">
                    <h2>{user.nome}</h2>
                    <h3>{limitText(user.titulo || user.area)}</h3>
                  </div>
                </section>
                <button><i className='fa-solid fa-user-plus'></i></button>
              </article>
            ))}
          </section>
        )}
      </section>
    </article>
  );
};

export default Search;
