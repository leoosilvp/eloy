import HeaderContentSettings from "./HeaderContentSettings"
import { useTheme } from "../../hook/ThemeContext.jsx";

const Appearance = () => {

    const { theme, toggleTheme } = useTheme();
  return (
    <section className="ctn-change-appearance">
        <HeaderContentSettings title='Aparência' />
        <section className="content-change">
            <h1>Alterar Tema para Light/Dark mode</h1>
            <button className="change-theme" onClick={toggleTheme}><i className={theme === "dark" ? "fa-regular fa-sun" : "fa-regular fa-moon"}></i>{theme === "dark" ? "Light" : "Dark"}</button>
        </section>
    </section>
  )
}

export default Appearance
