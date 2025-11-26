import useProfile from "../../hook/useProfile";

const BannerProfile = () => {
  const { data: profile } = useProfile();

  const bannerSrc =
    profile?.banner?.trim() !== ""
      ? profile.banner
      : "/assets/img/img-banner-default.png";

  return (
    <section className="banner-profile">
      <img src={bannerSrc} alt="Banner do usuário" />
    </section>
  );
};

export default BannerProfile;
