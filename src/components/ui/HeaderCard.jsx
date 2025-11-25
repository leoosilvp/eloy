import { useNavigate } from "react-router-dom"

const HeaderCard = ({ title, btnPlus, to, adm }) => {

    const navigate = useNavigate();

    return (
        <section className="header-card">
            <h1>{title}</h1>

            {adm === true && (
                <section className="btns-header-card">
                    {btnPlus === true && (
                        <button onClick={() => navigate(`/settings/${to}`)}>
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    )}
                    <button onClick={() => navigate(`/settings/${to}`)}>
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                </section>
            )}
        </section>
    )
}

export default HeaderCard
