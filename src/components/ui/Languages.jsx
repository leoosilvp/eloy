import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HeaderContentSettings from "./HeaderContentSettings";
import { supabase } from "../../hook/supabaseClient";

const Languages = () => {

    const {
        languages,
        setLanguages,
        setProfileId
    } = useOutletContext();

    const [idioma, setIdioma] = useState("");
    const [nivel, setNivel] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) return;

            setProfileId(user.id);

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("idiomas")
                .eq("id", user.id)
                .single();

            if (profileError) {
                console.error("Erro ao carregar idiomas:", profileError);
                return;
            }

            setLanguages(
                Array.isArray(profile.idiomas)
                    ? profile.idiomas.filter(i => i && i.idioma?.trim())
                    : []
            );
        };

        loadProfile();
    }, [setLanguages, setProfileId]);



    const addLanguage = () => {
        if (!idioma.trim() || !nivel.trim()) return;

        const newLang = { idioma, nivel };

        setLanguages(prev => [...prev, newLang]);

        setIdioma("");
        setNivel("");
    };

    // ✅ REMOVER IDIOMA
    const removeLanguage = index => {
        setLanguages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <section className="ctn-change-languages">
            <HeaderContentSettings title='Idiomas' />

            <section className="content-change">
                <h1>Adicionar idioma</h1>
                <p>
                    Adicione aqui os idiomas que você domina, indicando seu nível de proficiência e destacando suas habilidades linguísticas que podem contribuir para sua atuação pessoal e profissional.
                </p>

                <article className="ctn-add-experiences">
                    <div>
                        <label>idioma</label>
                        <input
                            type="text"
                            value={idioma}
                            onChange={e => setIdioma(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>nivel</label>
                        <input
                            type="text"
                            value={nivel}
                            onChange={e => setNivel(e.target.value)}
                        />
                    </div>

                    <button className="btn-add" onClick={addLanguage}>Adicionar</button>
                </article>

                <section className="my-languages">

                    {Array.isArray(languages) && languages.length > 0 ? (
                        languages.map((item, index, arr) => (
                            <article className="language" key={index}>
                                <div>
                                    <h1>{item.idioma}</h1>
                                    <h2>{item.nivel}</h2>
                                </div>

                                {/* ✅ BOTÃO DE REMOVER */}
                                <button
                                    className="btn-remove"
                                    onClick={() => removeLanguage(index)}
                                >
                                    Remover
                                </button>

                                {arr.length > 1 && index < arr.length - 1 && <hr />}
                            </article>
                        ))
                    ) : (
                        <p>Nenhum idioma adicionado ainda.</p>
                    )}

                </section>

            </section>
        </section>
    );
};

export default Languages;
