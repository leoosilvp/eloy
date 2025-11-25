import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import '../css/auth.css'
import logo from '../assets/img/logo.png'
import logoDark from '../assets/img/logo-dark.png'
import { useTheme } from "../hook/ThemeContext.jsx";

const Auth = () => {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigate = useNavigate();

    const { theme} = useTheme();

    async function handleLogin() {

        setErro("");

        if (!email.trim() || !senha.trim()) {
            return setErro("Preencha todos os campos.");
        }

        try {
            const response = await fetch("/db/users.json");
            const usersDB = await response.json();

            const userFound = usersDB.find(u =>
                u.email.toLowerCase() === email.toLowerCase() &&
                u.senha === senha
            );

            if (!userFound) {
                return setErro("Email ou senha incorretos.");
            }

            const userFiltered = {
                id: userFound.id,
                nome: userFound.nome,
                email: userFound.email
            };

            localStorage.setItem("eloy_user", JSON.stringify(userFiltered));



            navigate("/feed");


        } catch (error) {
            console.error(error);
            setErro("Erro ao conectar com o servidor.");
        }
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            handleLogin();
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

                    <section className='ctn-input-auth'>
                        <label>Email</label>
                        <section className='input-auth'>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className='btn-right-input'><i className='fa-regular fa-envelope'></i></button>
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

                    <p>Ao continuar para Login ou Criar Conta, você declara estar de acordo com o <a href='#'>Acordo do Usuário</a> e a <a href='#'>Política de Privacidade</a> do eloy.</p>

                    <button className='active' onClick={handleLogin}>Aceitar e continuar</button>

                    <section className='line-auth'>
                        <div className='hr'></div>
                        <p>ou</p>
                        <div className='hr'></div>
                    </section>

                    <button><i className='fa-brands fa-google'></i>Continuar com Google</button>

                    <h2>Novo no eloy? <a href="#">Criar conta</a></h2>
                </article>
            </section>

        </section>
    )
}

export default Auth
