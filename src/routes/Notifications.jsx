import { useEffect, useState } from "react";
import CardAds from "../components/ui/CardAds";
import CardInfoProfile from "../components/ui/CardInfoProfile";
import CardNewslatter from "../components/ui/CardNewslatter";
import CardProfile from "../components/ui/CardProfile";
import icon from "../assets/svg/icon-dark.svg";
import useAuthRedirect from "../hook/useAuthRedirect";
import { supabase } from "../hook/supabaseClient";

const Notifications = () => {
  useAuthRedirect();

  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (!sessionUser) return;

      setUserId(sessionUser.id);
    };

    loadUser();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const min = Math.floor(diff / 60000);
    const hrs = Math.floor(min / 60);
    const days = Math.floor(hrs / 24);

    if (min < 1) return "agora";
    if (min < 60) return `${min} min`;
    if (hrs < 24) return `${hrs} h`;
    return `${days} dias`;
  };

  useEffect(() => {
    if (!userId) return;

    const loadNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setNotifications(data || []);
    };

    loadNotifications();
  }, [userId]);

  return (
    <section className="content">
      <aside className="left">
        <CardProfile />
        <CardInfoProfile />
      </aside>

      <section className="feed-notification">
        {notifications.length === 0 && (
          <p className="no-posts">Nenhuma notificação encontrada.</p>
        )}

        {notifications.map((n) => (
          <article key={n.id} className="notification">
            <section className="img-user-notification">
              <img src={n.icon || icon} alt="Ícone" />
            </section>

            <section className="content-notification">
              <h1>{n.title || "Notificação"}</h1>
              <p>{n.message}</p>
            </section>

            <section className="info-notification">
              <p>{formatTime(n.created_at)}</p>
              <button>
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </section>
          </article>
        ))}
      </section>

      <aside className="right">
        <CardNewslatter />
        <CardAds />
      </aside>
    </section>
  );
};

export default Notifications;
