const BannerProfile = ({ user }) => {
  // Pega o banner do usuário passado como prop
  const bannerSrc = user?.banner?.trim() || "/assets/img/img-banner-default.png";

  return (
    <section className="banner-profile">
      <img src={bannerSrc} alt={`Banner de ${user?.nome || "usuário"}`} />
    </section>
  );
};

export default BannerProfile;
