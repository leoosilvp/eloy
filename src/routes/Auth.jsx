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

    // 🔐 LOGIN COM SUPABASE
    async function handleLogin() {
        setErro("");

        if (!email.trim() || !senha.trim()) {
            return setErro("Preencha todos os campos.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        });

        if (error) {
            console.log(error);
            return setErro("Email ou senha incorretos.");
        }

        navigate("/feed");
    }

    // 🆕 CRIAR CONTA NO SUPABASE
    async function handleCreateAccount() {
        setErro("");

        if (!email || !senha || !nome || !userName || !genero || !nascimento) {
            return setErro("Preencha todos os campos.");
        }

        // Criar usuário no Auth
        const { data: authUser, error: authError } = await supabase.auth.signUp({
            email,
            password: senha
        });

        if (authError) {
            console.log(authError);
            return setErro(authError.message);
        }

        // Criar perfil na tabela profiles (ou users)
        const { error: dbError } = await supabase
            .from("profiles")
            .insert({
                id: authUser.user.id,
                nome,
                userName,
                genero,
                aniversario: nascimento,
                email
            });

        if (dbError) {
            console.log(dbError);
            return setErro("Erro ao criar perfil no banco.");
        }

        navigate("/feed");
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            modoCadastrar ? handleCreateAccount() : handleLogin();
        }
    }

    return (
        <section className='ctn-page-auth' onKeyDown={handleKeyPress}>
            <header className='header-page-auth'>
                <Link to='/welcome'>
                    <img src={theme === "light" ? logoDark : logo} />
                </Link>
            </header>

            <section className='content-auth'>
                <article className='ctn-auth'>

                    {modoCadastrar && (
                        <>
                            <section className='ctn-input-auth'>
                                <label>Nome Completo</label>
                                <section className='input-auth'>
                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </section>
                            </section>

                            <section className='ctn-input-auth'>
                                <label>Nome de Usuário</label>
                                <section className='input-auth'>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
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
                                    <input
                                        type="date"
                                        value={nascimento}
                                        onChange={(e) => setNascimento(e.target.value)}
                                    />
                                </section>
                            </section>
                        </>
                    )}

                    <section className='ctn-input-auth'>
                        <label>Email</label>
                        <section className='input-auth'>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className='btn-right-input'>
                                <i className='fa-regular fa-envelope'></i>
                            </button>
                        </section>
                    </section>

                    <section className='ctn-input-auth'>
                        <label>Senha <span>(6+ Caracteres)</span></label>
                        <section className='input-auth'>
                            <input
                                type={mostrarSenha ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                            <button
                                className='btn-right-input'
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                                <i className={mostrarSenha ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'}></i>
                            </button>
                        </section>
                    </section>

                    {erro && <p className="msg-erro">{erro}</p>}

                    <p>Ao continuar, você declara estar de acordo com o <a href='#'>Acordo do Usuário</a> e a <a href='#'>Política de Privacidade</a>.</p>

                    {modoCadastrar ? (
                        <button className='active' onClick={handleCreateAccount}>
                            Criar conta
                        </button>
                    ) : (
                        <button className='active' onClick={handleLogin}>
                            Aceitar e continuar
                        </button>
                    )}

                    <section className='line-auth'>
                        <div className='hr'></div>
                        <p>ou</p>
                        <div className='hr'></div>
                    </section>

                    {!modoCadastrar && (
                        <button><i className='fa-brands fa-google'></i>Continuar com Google</button>
                    )}

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
