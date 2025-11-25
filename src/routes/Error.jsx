import erro from '../assets/img/erro.png'

const Error = () => {
  return (
    <div className="page-not-found">
      <img src={erro} />
      <h1>Esta página não existe</h1>
      <h2>Verifique sua URL ou volte para a página de início do eloy</h2>
    </div>
  )
}

export default Error
