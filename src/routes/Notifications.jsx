import CardAds from "../components/ui/CardAds"
import CardInfoProfile from "../components/ui/CardInfoProfile"
import CardNewslatter from "../components/ui/CardNewslatter"
import CardProfile from "../components/ui/CardProfile"
import icon from '../assets/svg/icon-dark.svg'
import useAuthRedirect from "../hook/useAuthRedirect"

const Notifications = () => {

  useAuthRedirect();

  return (
    <section className="content"> 
      <aside className="left">
        <CardProfile local='eloy_user'/>
        <CardInfoProfile local='eloy_user'/>
      </aside>
      <section className="feed-notification"> 
        <article className="notification">
          <section className="img-user-notification">
            <img src={icon}/>
          </section>
          <section className="content-notification">
            <h1>eloy</h1>
            <p>Seja bem vindo ao eloy! Estamos muito felizes em ter você aqui. Explore, descubra e aproveite ao máximo tudo o que preparamos para você!</p>
          </section>
          <section className="info-notification">
            <p>1 min</p>
            <button><i className="fa-solid fa-ellipsis"></i></button>
          </section>
        </article>
      </section>
      <aside className="right">
        <CardNewslatter />
        <CardAds />
      </aside>
    </section>
  )
}

export default Notifications
