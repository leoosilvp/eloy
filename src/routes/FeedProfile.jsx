import { NavLink, useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CardAds from '../components/ui/CardAds'
import CardInfoProfile from '../components/ui/CardInfoProfile'
import CardNewslatter from '../components/ui/CardNewslatter'
import CardProfile from '../components/ui/CardProfile'
import '../css/center.css'
import { supabase } from '../hook/supabaseClient'
import useProfile from '../hook/useProfile'

const FeedProfile = () => {
  const { username } = useParams()
  const location = useLocation()
  const { data: me, isLoading: loadingMe } = useProfile()

  const [currentUser, setCurrentUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (loadingMe) return
      setLoading(true)

      try {
        let user = null

        // 1️⃣ Obter o perfil do usuário
        if (location.pathname.startsWith('/profile')) {
          if (!me) return
          user = me
        } else if (username) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, nome, foto, banner, titulo, cargo, user_name')
            .ilike('user_name', username)
            .single()

          if (error) throw error
          user = data
        }

        if (!user) {
          setCurrentUser(null)
          setUserPosts([])
          return
        }

        setCurrentUser(user)

        // 2️⃣ Buscar posts do usuário na tabela posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (postsError) throw postsError
        setUserPosts(postsData || [])
      } catch (err) {
        console.error('Erro ao carregar feed:', err)
        setCurrentUser(null)
        setUserPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [username, loadingMe, location.pathname, me])

  if (loading) return <p>Carregando feed...</p>
  if (!currentUser) return <p>Usuário não encontrado.</p>

  const formatTime = (dateString) => {
    const postDate = new Date(dateString)
    const now = new Date()
    const diffMs = now - postDate
    const diffMin = Math.floor(diffMs / 60000)
    const diffHrs = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHrs / 24)
    if (diffMin < 1) return 'agora'
    if (diffMin < 60) return `${diffMin} min`
    if (diffHrs < 24) return `${diffHrs} h`
    return `${diffDays} dias`
  }

  const renderContentWithMentions = (text) => {
    if (!text) return ''
    const mentionRegex = /@([a-zA-Z0-9_.]+)/g
    const parts = text.split(mentionRegex)
    return parts.map((part, index) => {
      if (index % 2 === 0) return part
      return (
        <NavLink key={index} to={`/user/${part}`} className="mention-link">
          @{part}
        </NavLink>
      )
    })
  }

  return (
    <section className="content">
      <aside className="left">
        <CardProfile profile={currentUser} />
        <CardInfoProfile profile={currentUser} />
      </aside>

      <section className="feed-profile">
        {userPosts.length === 0 && <h2 className="no-posts">Nenhuma publicação encontrada.</h2>}

        {userPosts.map((post) => (
          <article key={post.id} className="post">
            <NavLink className="header-post">
              <div className="info-user-header-post">
                <img
                  src={currentUser.foto?.trim() || '/assets/img/img-profile-default.png'}
                  alt={currentUser.nome}
                />
                <div>
                  <div className="name-data-post">
                    <h1>{currentUser.nome}</h1>
                    <h3>•</h3>
                    <h3>{formatTime(post.created_at)}</h3>
                  </div>
                  <h2>{currentUser.titulo?.length > 65 ? currentUser.titulo.slice(0, 65) + '...' : currentUser.titulo || ''}</h2>
                </div>
              </div>
              <button>
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </NavLink>

            <section className="content-post">
              <p>{renderContentWithMentions(post.content)}</p>
              {post.imagem && <img src={post.imagem} alt="Post" />}
            </section>

            <section className="footer-post">
              <button>{post.likes?.length || 0} <i className="fa-regular fa-thumbs-up"></i>Curtir</button>
              <button>{post.comentarios?.length || 0} <i className="fa-regular fa-comment"></i>Comentar</button>
              <button>Compartilhar</button>
            </section>
          </article>
        ))}
      </section>

      <aside className="right">
        <CardNewslatter />
        <CardAds />
      </aside>
    </section>
  )
}

export default FeedProfile
