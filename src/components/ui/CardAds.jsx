import { Link } from "react-router-dom"

const CardAds = () => {
  return (
    <article className="card-ads">
      <img src="https://media.licdn.com/dms/image/v2/D4D22AQHlvxwMBQdDpQ/feedshare-shrink_800/B4DZoJvcwgIkAg-/0/1761100029749?e=1766016000&v=beta&t=u5j8S0P4Cs4RGWhPK2DjfUNFSU1fzlJGFIEQ6JDPdMg" />
      <section className="content-ad">
        <h1>Graham Ai v1.3</h1>
        <h2>Nova versão do Graham AI ja disponivel. De Graça! Clique em Saiba mais e descubra o poder de estar no controle.</h2>
        <Link to='https://graham-ai-page.vercel.app/' target="_blank">Saiba mais</Link>
      </section>
    </article>
  )
}

export default CardAds
