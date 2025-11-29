import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";
import { supabase } from "../../hook/supabaseClient";
import { useOutletContext } from "react-router-dom";

const Projects = () => {
  const {
    projects = [],
    setProjects = () => {},
    setProfileId = () => {} // necessário para o botão Save do Settings
  } = useOutletContext();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  // Carregar projetos do Supabase e preencher profileId
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr) return console.error("Erro ao pegar usuário:", userErr);
        if (!user) return;

        setProfileId(user.id); // 🔥 essencial para que o botão Save funcione

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("projetos")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Erro ao carregar projetos:", error);
          return;
        }

        setProjects(Array.isArray(profile?.projetos) ? profile.projetos : []);
      } catch (err) {
        console.error("Erro inesperado:", err);
      }
    };

    fetchProfile();
  }, [setProjects, setProfileId]);

  // Adicionar projeto localmente
  const addProject = () => {
    if (!title.trim() || !description.trim() || !link.trim()) return;

    const newProject = {
      titulo: title.trim(),
      link: link.trim(),
      descricao: description.trim()
    };

    setProjects(prev => (Array.isArray(prev) ? [...prev, newProject] : [newProject]));

    setTitle("");
    setLink("");
    setDescription("");
  };

  // Remover projeto localmente
  const removeProject = index => {
    setProjects(prev => (Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []));
  };

  return (
    <section className="ctn-change-projects">
      <HeaderContentSettings title="Projetos" />

      <section className="content-change">
        <h1>Adicionar projetos</h1>
        <p>
          Inclua seus projetos, trabalhos e iniciativas que demonstram suas habilidades e experiência prática.
        </p>

        <article className="ctn-add-experiences">
          <div>
            <label>Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ex: Sistema de Login com React"
            />
          </div>

          <div>
            <label>Link</label>
            <input
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label>Descrição</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Breve explicação do projeto"
            />
          </div>

          <button onClick={addProject} className="btn-add">Adicionar Projeto</button>
        </article>

        {Array.isArray(projects) && projects.length > 0 && <hr />}

        <section className="my-projects">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((item, index) => (
              <article key={index} className="project">
                <h1>{item.titulo}</h1>
                <a href={item.link} target="_blank" rel="noreferrer">{item.link}</a>
                <p>{item.descricao}</p>
                <button onClick={() => removeProject(index)} className="btn-remove">Remover</button>
                {index !== projects.length - 1 && <hr />}
              </article>
            ))
          ) : (
            <p>Nenhum projeto adicionado ainda.</p>
          )}
        </section>
      </section>
    </section>
  );
};

export default Projects;
