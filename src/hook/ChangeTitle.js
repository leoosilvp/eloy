import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PageTitle = () => {
  const location = useLocation()

  useEffect(() => {
    switch (location.pathname) {
      case '/':
      case '/feed':
        document.title = 'Feed | eloy'
        break
      case '/chat':
        document.title = 'Mensagens | eloy'
        break
      case '/publish':
        document.title = 'Nova publicação | eloy'
        break
      case '/notifications':
        document.title = 'Notificações | eloy'
        break
      case '/profile':
        document.title = 'Meu Perfil | eloy'
        break
      default:
        document.title = 'eloy'
    }
  }, [location.pathname])

  return null
}

export default PageTitle
