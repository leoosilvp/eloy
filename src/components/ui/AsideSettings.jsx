import { NavLink } from "react-router-dom"

const AsideSettings = () => {
  return (
    <aside className="aside-settings">
        <h1>Perfil</h1>
        <NavLink to='introduction' className={({ isActive }) => isActive ? "active" : ""}>Introdução</NavLink>
        <NavLink to='interests' className={({ isActive }) => isActive ? "active" : ""}>Interesses</NavLink>
        <NavLink to='about' className={({ isActive }) => isActive ? "active" : ""}>Sobre</NavLink>
        <NavLink to='Experiences' className={({ isActive }) => isActive ? "active" : ""}>Experiencias</NavLink>
        <NavLink to='academic' className={({ isActive }) => isActive ? "active" : ""}>Formação</NavLink>
        <NavLink to='projects' className={({ isActive }) => isActive ? "active" : ""}>Projetos</NavLink>
        <NavLink to='courses' className={({ isActive }) => isActive ? "active" : ""}>Meus Cursos</NavLink>
        <NavLink to='languages' className={({ isActive }) => isActive ? "active" : ""}>Idiomas</NavLink>
        <NavLink to='skills' className={({ isActive }) => isActive ? "active" : ""}>Competências</NavLink>
        <h1>Geral</h1>
        <NavLink to='appearance' className={({ isActive }) => isActive ? "active" : ""}>Aparência</NavLink>
        <NavLink to='accessibility' className={({ isActive }) => isActive ? "active" : ""}>Acessibilidade</NavLink>
        <NavLink to='terms and Privacy' className={({ isActive }) => isActive ? "active" : ""}>Termos e Privacidade</NavLink>
        <NavLink to='support' className={({ isActive }) => isActive ? "active" : ""}>Suporte</NavLink>
    </aside>
  )
}

export default AsideSettings
