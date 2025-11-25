import '../css/setting.css'
import '../css/content-settings.css'
import AsideSettings from '../components/ui/AsideSettings'
import HeaderSettings from '../components/ui/HeaderSettings'
import { Outlet } from 'react-router-dom'
import useAuthRedirect from '../hook/useAuthRedirect'

const Settings = () => {

  useAuthRedirect();

  return (
    <section className='content'>
        <article className='settings'>
            <HeaderSettings />
            <section className='ctn-content-settings'>
                <aside>
                    <AsideSettings />
                </aside>
                <section className='content-settings'>
                   <Outlet />
                </section>
            </section>
        </article>
    </section>
  )
}

export default Settings
