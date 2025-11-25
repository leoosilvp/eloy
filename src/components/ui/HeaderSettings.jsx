import { useNavigate } from "react-router-dom"

const HeaderSettings = () => {

  const navigate = useNavigate();

  return (
    <section className="header-settings">
        <h1>Configurações</h1>
        <section className="btns-header-settings">
            <button onClick={() => navigate(-1)}>Cancelar</button>
            <button className="active">Salvar</button>
        </section>
    </section>
  )
}

export default HeaderSettings
