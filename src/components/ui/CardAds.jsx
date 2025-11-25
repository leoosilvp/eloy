import { Link } from "react-router-dom"

const CardAds = () => {
  return (
    <article className="card-ads">
      <img src="https://media.licdn.com/dms/image/v2/D4D22AQHlvxwMBQdDpQ/feedshare-shrink_2048_1536/B4DZoJvcwgIkAw-/0/1761100029850?e=1764201600&v=beta&t=I0krHRzMTWIUy2LNF-Da32dT1uuIpYBgACgONUWW0VU" />
      <section className="content-ad">
        <h1>Graham Ai v1.3</h1>
        <h2>Nova versão do Graham AI ja disponivel. De Graça! Clique em Saiba mais e descubra o poder de estar no controle.</h2>
        <Link to='https://graham-ai-page.vercel.app/' target="_blank">Saiba mais</Link>
      </section>
    </article>
  )
}

export default CardAds
