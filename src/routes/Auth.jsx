import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../css/auth.css';
import logo from '../assets/img/logo.png';
import logoDark from '../assets/img/logo-dark.png';
import { useTheme } from "../hook/ThemeContext.jsx";
import { supabase } from "../hook/supabaseClient.js";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [userName, setUserName] = useState("");
    const [genero, setGenero] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [erro, setErro] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [modoCadastrar, setModoCadastrar] = useState(false);

    const navigate = useNavigate();
    const { theme } = useTheme();

    async function handleLogin() {
        setErro("");
        if (!email.trim() || !senha.trim()) return setErro("Preencha todos os campos.");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha
        });

        if (error) return setErro(error.message || "Email ou senha incorretos.");

        const token = data.session?.access_token;
        if (token) localStorage.setItem("access_token", token);

        navigate("/feed");
        window.location.reload();
    }

    async function handleCreateAccount() {
        setErro("");
        if (!email || !senha || !nome || !userName || !genero || !nascimento) {
            return setErro("Preencha todos os campos.");
        }

        try {
            // Cria usuário no Supabase Auth
            const { data: signData, error: signError } = await supabase.auth.signUp({
                email,
                password: senha,
                options: { data: { full_name: nome } }
            });

            if (signError) {
                if (signError.message.includes("already registered")) {
                    return setErro("Email já cadastrado. Tente entrar ou recupere sua senha.");
                }
                return setErro(signError.message);
            }

            const userId = signData.user?.id;
            if (!userId) return setErro("Erro: user id não retornado.");

            // Upsert no perfil (evita duplicate key)
            const { error: dbError } = await supabase.from("profiles").upsert([{
                id: userId,
                user_name: userName,
                nome,
                genero,
                aniversario: nascimento,
                created_at: new Date().toISOString()
            }], { onConflict: "id" });

            if (dbError) return setErro("Erro ao salvar dados do perfil: " + dbError.message);

            // Login automático
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password: senha
            });

            if (loginError) return setErro(loginError.message);

            localStorage.setItem("access_token", loginData.session?.access_token);
            navigate("/feed");

        } catch (err) {
            console.error(err);
            setErro("Erro inesperado ao criar conta.");
        }
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") modoCadastrar ? handleCreateAccount() : handleLogin();
    }

    return (
        <section className='ctn-page-auth' onKeyDown={handleKeyPress}>
            <header className='header-page-auth'>
                <Link to='/welcome'>
                    <img src={theme === "light" ? logoDark : logo} alt="logo" />
                </Link>
            </header>

            <section className='content-auth'>
                <article className='ctn-auth'>
                    {modoCadastrar && (
                        <>
                            <section className='ctn-input-auth'>
                                <label>Nome Completo</label>
                                <section className='input-auth'>
                                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                                </section>
                            </section>

                            <section className='ctn-input-auth'>
                                <label>Nome de Usuário</label>
                                <section className='input-auth'>
                                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                                </section>
                            </section>

                            <section className='ctn-input-auth'>
                                <label>Gênero</label>
                                <section className='input-auth'>
                                    <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                                        <option value="">Selecione</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </section>
                            </section>

                            <section className='ctn-input-auth'>
                                <label>Data de Nascimento</label>
                                <section className='input-auth'>
                                    <input type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
                                </section>
                            </section>
                        </>
                    )}

                    <section className='ctn-input-auth'>
                        <label>Email</label>
                        <section className='input-auth'>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <button className='btn-right-input'><i className='fa-regular fa-envelope'></i></button>
                        </section>
                    </section>

                    <section className='ctn-input-auth'>
                        <label>Senha <span>(6+ Caracteres)</span></label>
                        <section className='input-auth'>
                            <input type={mostrarSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} />
                            <button className='btn-right-input' type="button" onClick={() => setMostrarSenha(!mostrarSenha)}>
                                <i className={mostrarSenha ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'}></i>
                            </button>
                        </section>
                    </section>

                    {erro && <p className="msg-erro">{erro}</p>}

                    <p>Ao continuar, você declara estar de acordo com o <a href='#'>Acordo do Usuário</a> e a <a href='#'>Política de Privacidade</a>.</p>

                    {modoCadastrar ? (
                        <button className='active' onClick={handleCreateAccount}>Criar conta</button>
                    ) : (
                        <button className='active' onClick={handleLogin}>Aceitar e continuar</button>
                    )}

                    <section className='line-auth'>
                        <div className='hr'></div>
                        <p>ou</p>
                        <div className='hr'></div>
                    </section>

                    {!modoCadastrar && <button><i className='fa-brands fa-google'></i>Continuar com Google</button>}

                    {modoCadastrar ? (
                        <h2>Já tem conta? <a onClick={() => setModoCadastrar(false)}>Entrar</a></h2>
                    ) : (
                        <h2>Novo no eloy? <a onClick={() => setModoCadastrar(true)}>Criar conta</a></h2>
                    )}
                </article>
            </section>
        </section>

    );
};

export default Auth;
