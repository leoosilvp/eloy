import { useEffect, useState } from "react";

const BannerProfile = ({ local }) => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem(local);
    if (!user) return;

    const usuarioLogado = JSON.parse(user);

    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const userData = data.find(u => u.id === usuarioLogado.id);

          const bannerImg =
            userData?.banner && userData.banner.trim() !== ""
              ? userData.banner
              : "/assets/img/img-banner-default.png";

          setBanner(bannerImg);
        }
      })
      .catch(err => console.error("Erro ao carregar JSON:", err));
  }, [local]);

  return (
    <section className="banner-profile">
      {banner && (
        <img src={banner} alt="Banner do usuário" />
      )}
    </section>
  );
};

export default BannerProfile;
