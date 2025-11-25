import '../css/center.css'
import '../css/aside-right.css'
import CardAds from "../components/ui/CardAds"
import CardNewslatter from "../components/ui/CardNewslatter"
import BannerProfile from "../components/ui/BannerProfile"
import ContentProfile from '../components/ui/ContentProfile'
import CardAbout from '../components/ui/CardAbout'
import CardMyCourses from '../components/ui/CardMyCourses'
import CardAcademic from '../components/ui/CardAcademic'
import CardLanguages from '../components/ui/CardLanguages'
import CardExperiences from '../components/ui/CardExperiences'
import CardInterests from '../components/ui/CardInterests'
import CardSkills from '../components/ui/CardSkills'
import CardProjects from '../components/ui/CardProjects'
import useAuthRedirect from '../hook/useAuthRedirect'
import CardFeedProfile from '../components/ui/CardFeedProfile'

const Profile = () => {

  useAuthRedirect();

  return (
    <section className="content">
      <section className="ctn-content-profile">
        <article className='card-content-profile'>
          <BannerProfile local='eloy_user' />
          <ContentProfile local='eloy_user' />
        </article>
        <CardInterests local='eloy_user' />
        <CardAbout local='eloy_user' />
        <CardFeedProfile local='eloy_user' />
        <CardExperiences local='eloy_user' />
        <CardAcademic local='eloy_user' />
        <CardProjects local='eloy_user' />
        <CardMyCourses local='eloy_user' />
        <CardLanguages local='eloy_user' />
        <CardSkills local='eloy_user' />
      </section>
      <aside className="right">
        <CardNewslatter />
        <CardAds />
      </aside>
    </section>
  )
}

export default Profile
