import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HeaderContentSettings from "./HeaderContentSettings";
import { supabase } from "../../hook/supabaseClient";

const Skills = () => {
    const { skills, setSkills, setProfileId } = useOutletContext();

    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) return console.error("Erro ao pegar usuário:", userError);
                if (!user) return;

                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("id, competencias")
                    .eq("id", user.id)
                    .single();

                if (profileError) return console.error("Erro ao carregar competências:", profileError);

                setProfileId(profile.id);

                setSkills(
                    Array.isArray(profile.competencias)
                        ? profile.competencias.filter(s => s && s.trim() !== "")
                        : []
                );

            } catch (err) {
                console.error("Erro ao carregar competências:", err);
            }
        };

        fetchProfile();
    }, [setSkills, setProfileId]);

    const addSkill = () => {
        if (!newSkill.trim()) return;

        setSkills(prev => [...prev, newSkill.trim()]);

        setNewSkill("");
    };

    const removeSkill = index => {
        setSkills(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <section className="ctn-change-skills">
            <HeaderContentSettings title='Competências' />

            <section className="content-change">
                <p>
                    Adicione aqui suas competências técnicas e comportamentais, destacando habilidades que demonstram sua capacidade de atuação, produtividade e evolução profissional.
                </p>

                <article className="add-interests">
                    <label>Adicionar Competência</label>

                    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                        <input
                            type="text"
                            placeholder="ex: comunicação"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                        />

                        <button onClick={addSkill}>Adicionar</button>
                    </div>
                </article>

                <hr />

                <section className="my-skills">
                    {skills.length === 0 ? (
                        <p>Nenhuma competência adicionada ainda.</p>
                    ) : (
                        skills.map((skill, index) => (
                            <article className="skill" key={index}>
                                <h1>{skill}</h1>

                                <button onClick={() => removeSkill(index)}>
                                    Remover
                                </button>

                                {skills.length > 1 && index < skills.length - 1 && <hr />}
                            </article>
                        ))
                    )}
                </section>
            </section>
        </section>
    );
};

export default Skills;
