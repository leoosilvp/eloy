import CardAds from "../components/ui/CardAds"
import CardNewslatter from "../components/ui/CardNewslatter"
import useAuthRedirect from "../hook/useAuthRedirect";

const Chat = () => {

  useAuthRedirect();

  return (
    <section className="content">
      <section className="ctn-content-chat">
        <section className="ctn-header-chat">
          <h1>Mensagens</h1>
        </section>
        <section className="content-chat">
          <aside className="ctn-aside-chat">
            <article className="profile-user-chat active">
              <section className="img-profile-chat">
                <img src="https://avatars.githubusercontent.com/u/182553526?v=4" />
              </section>
              <section className="ctn-info-profile-chat">
                <section className="info-profile-chat">
                  <h1>Leonardo Silva</h1>
                  <section className="preview-message-chat">
                    <i className="fa-solid fa-check-double"></i>
                    <p>•</p>
                    <h2>Oi 😁, tudo ótimo! e c...</h2>
                  </section>
                </section>
                <button><i className="fa-solid fa-ellipsis"></i></button>
              </section>
            </article>

            <article className="profile-user-chat">
              <section className="img-profile-chat">
                <img src="https://avatars.githubusercontent.com/u/225023097?v=4" />
              </section>
              <section className="ctn-info-profile-chat">
                <section className="info-profile-chat">
                  <h1>Samuel Monteiro</h1>
                  <section className="preview-message-chat">
                    <i className="fa-solid fa-check-double"></i>
                    <p>•</p>
                    <h2>perguntei p eloy e ele...</h2>
                  </section>
                </section>
                <button><i className="fa-solid fa-ellipsis"></i></button>
              </section>
            </article>

            <article className="profile-user-chat">
              <section className="img-profile-chat">
                <img src="https://avatars.githubusercontent.com/u/198768909?v=4" />
              </section>
              <section className="ctn-info-profile-chat">
                <section className="info-profile-chat">
                  <h1>Lucas Toledo</h1>
                  <section className="preview-message-chat">
                    <i className="fa-solid fa-check-double"></i>
                    <p>•</p>
                    <h2>acabei de te enviar...</h2>
                  </section>
                </section>
                <button><i className="fa-solid fa-ellipsis"></i></button>
              </section>
            </article>

          </aside>
          <section className="content-active-chat">
            <section className="header-active-chat">
              <section className="img-profile-chat">
                <img src="https://avatars.githubusercontent.com/u/182553526?v=4" />
              </section>
              <section>
                <h1>Leonardo Siva</h1>
                <h2>Engenheiro de Software</h2>
              </section>
            </section>
            <section className="content-message">
              <article className="message-user">
                <p>Oi Leonardo, tudo bem? pode me ajudar em uma tarefa?</p>
              </article>
              <article className="message-received">
                <p>Oi 😁, tudo ótimo! e com você? Posso sim. O que você precisa?</p>
              </article>
            </section>
            <section className="ctn-send-message">
              <section className="input-message-chat">
                <textarea autoFocus placeholder="Mensagem" />
                <button><i className="fa-solid fa-paper-plane"></i></button>
              </section>
            </section>
          </section>
        </section>
      </section>
      <aside className="right">
        <CardNewslatter />
        <CardAds />
      </aside>
    </section>
  )
}

export default Chat
