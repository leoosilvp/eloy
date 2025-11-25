import { Link, NavLink } from "react-router-dom"
import '../css/footer.css'

const Footer = () => {
  return (
    <footer>
        <section className="links-footer">

            <ul>
                <li><NavLink to='/feed'>início</NavLink></li>
                <li><NavLink to='/chat'>Mensagens</NavLink></li>
                <li><NavLink to='/publish'>Publicar</NavLink></li>
                <li><NavLink to='/notifications'>Notificações</NavLink></li>
                <li><NavLink to='/profile'>Perfil</NavLink></li>
            </ul>

            <ul>
                <li><Link to='/developers'>Linkedin</Link></li>
                <li><Link to='/developers'>Instagram</Link></li>
                <li><Link to='/developers'>Twitter</Link></li>
                <li><Link to='/developers'>Telegram</Link></li>
                <li><Link to='/developers'>Github</Link></li>
            </ul>

            <ul>
                <li><Link to='/settings/accessibility'>Acessibilidade</Link></li>
                <li><Link>Minha carreira</Link></li>
                <li><Link>Sobre</Link></li>
                <li><Link to='/settings'>Configurações</Link></li>
                <li><Link  to='/settings/terms and Privacy'>Termos e Privacidade</Link></li>
            </ul>

            <ul>
                <li><Link>Planos</Link></li>
                <li><Link>eloy AI</Link></li>
                <li><Link>Contribuir</Link></li>
                <li><Link>Reportar</Link></li>
                <li><Link>Comunidade</Link></li>
            </ul>

            <ul>
                <li><Link>Suporte</Link></li>
                <li><Link to='https://graham-ai-kappa.vercel.app/'>Graham AI</Link></li>
            </ul>
        </section>
        <p>eloy Corporation &copy; 2025</p>
    </footer>
  )
}

export default Footer
