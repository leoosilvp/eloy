import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HeaderContentSettings from "./HeaderContentSettings";
import { supabase } from "../../hook/supabaseClient";

const Experiences = () => {

    const {
        experiences,
        setExperiences,
        setProfileId
    } = useOutletContext();

    const [empresa, setEmpresa] = useState("");
    const [tipo, setTipo] = useState("");
    const [cargo, setCargo] = useState("");
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [local, setLocal] = useState("");
    const [descricao, setDescricao] = useState("");

    // 🔥 NOVO — checkbox para trabalho atual
    const [isAtual, setIsAtual] = useState(false);

    // 🔥 CARREGAR EXPERIÊNCIAS DO SUPABASE
    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) return;

            setProfileId(user.id);

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("experiencias")
                .eq("id", user.id)
                .single();

            if (profileError) {
                console.error("Erro ao carregar experiências:", profileError);
                return;
            }

            setExperiences(
                Array.isArray(profile.experiencias)
                    ? profile.experiencias.filter(e =>
                        e && Object.values(e).some(v => v && v.toString().trim() !== "")
                    )
                    : []
            );
        };

        loadProfile();
    }, [setExperiences, setProfileId]);

    // 🔥 ADICIONAR EXPERIÊNCIA
    const addExperience = () => {
        if (!empresa.trim() || !cargo.trim()) return;

        const newExp = {
            empresa,
            tipo,
            cargo,
            inicio,
            fim: isAtual ? "atual" : fim,  // <<<< AQUI A MÁGICA
            local,
            descricao
        };

        setExperiences(prev => [...prev, newExp]);

        // reset
        setEmpresa("");
        setTipo("");
        setCargo("");
        setInicio("");
        setFim("");
        setLocal("");
        setDescricao("");
        setIsAtual(false);
    };

    // 🔥 REMOVER EXPERIÊNCIA
    const removeExperience = index => {
        setExperiences(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <section className="ctn-change-experiences">
            <HeaderContentSettings title='Experiências' />

            <section className="content-change">
                <p>Adicione aqui suas experiências profissionais, destacando cargos, responsabilidades e conquistas.</p>

                <h1>Adicionar experiência</h1>

                <article className="ctn-add-experiences">

                    <div>
                        <label>Empresa</label>
                        <input type="text" value={empresa} onChange={e => setEmpresa(e.target.value)} />
                    </div>

                    <div>
                        <label>Tipo</label>
                        <input type="text" value={tipo} onChange={e => setTipo(e.target.value)} />
                    </div>

                    <div>
                        <label>Cargo</label>
                        <input type="text" value={cargo} onChange={e => setCargo(e.target.value)} />
                    </div>

                    <div>
                        <label>Início</label>
                        <input type="month" value={inicio} onChange={e => setInicio(e.target.value)} />
                    </div>

                    {/* 🔥 SE NÃO ESTIVER ATUAL, EXIBE O INPUT DE FIM */}
                    {!isAtual && (
                        <div>
                            <label>Fim</label>
                            <input
                                type="month"
                                value={fim}
                                onChange={e => setFim(e.target.value)}
                            />
                        </div>
                    )}

                    {/* 🔥 CHECKBOX DE TRABALHO ATUAL */}
                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <input
                                type="checkbox"
                                checked={isAtual}
                                onChange={() => setIsAtual(prev => !prev)}
                            />
                            Atualmente trabalho aqui
                        </label>
                    </div>

                    <div>
                        <label>Local</label>
                        <input type="text" value={local} onChange={e => setLocal(e.target.value)} />
                    </div>

                    <div>
                        <label>Descrição</label>
                        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} />
                    </div>

                    <button className="btn-add" onClick={addExperience}>Adicionar</button>
                </article>

                <hr />

                <section className="ctn-my-experiences">
                    {Array.isArray(experiences) && experiences.length > 0 ? (
                        experiences.map((item, index, arr) => (
                            <article className="experience" key={index}>
                                <h1>{item.cargo}</h1>
                                <h2>{item.empresa} • {item.tipo}</h2>

                                <h3>
                                    {item.inicio} - {item.fim === "atual" ? "Atual" : item.fim}
                                </h3>

                                <h4>{item.local}</h4>
                                <p>{item.descricao}</p>

                                <button
                                    className="btn-remove"
                                    onClick={() => removeExperience(index)}
                                >
                                    Remover
                                </button>

                                {arr.length > 1 && index < arr.length - 1 && <hr />}
                            </article>
                        ))
                    ) : (
                        <p>Nenhuma experiência adicionada ainda.</p>
                    )}
                </section>
            </section>
        </section>
    );
};

export default Experiences;
