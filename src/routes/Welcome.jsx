import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import '../css/welcome.css'
import logo from '../assets/img/logo.png'
import logoDark from '../assets/img/logo-dark.png'
import img from '../assets/img/img-welcome.png'
import { useTheme } from "../hook/ThemeContext.jsx";

const Welcome = () => {

    const navigate = useNavigate();

    const { theme} = useTheme();
 
    return (
        <section className="ctn-page-welcome">
            <header className='header-page-welcome'>
                <img src={theme === "light" ? logoDark : logo} />
                <section className='btns-header-welcome'>
                    <button onClick={() => navigate("/auth")}>Criar conta</button>
                    <button onClick={() => navigate("/auth")} className='active'>Entrar</button>
                </section>
            </header>
            <section className='content-welcome'>
                <section className='content-left-welcome'>
                    <h1>Bem-vindo à sua comunidade profissional</h1>
                    <button onClick={() => navigate("/auth")}><i className='fa-brands fa-google'></i>Continuar com Google</button>
                    <button onClick={() => navigate("/auth")}>Entrar com email</button>
                    <p>Ao continuar para Login ou Criar Conta, você declara estar de acordo com o <Link to='/auth'>Acordo do Usuário</Link> e a <Link to='/auth'>Política de Privacidade</Link> do eloy.</p>
                    <h2 className='btn-page-new-account'>Novo no eloy? <Link to='/auth'>Crie agora</Link></h2>
                </section>
                <section className='img-right-welcome'>
                    <img src={img} />
                </section>
            </section>
        </section>
    )
}

export default Welcome
