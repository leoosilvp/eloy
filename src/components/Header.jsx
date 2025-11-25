import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import logo from '../assets/svg/logo-light.svg'
import logoDark from '../assets/svg/logo-dark.svg'
import ModalProfile from './ui/ModalProfile'
import Search from './Search'
import '../css/header.css'
import Reputation from './ui/Reputation'
import { useTheme } from "../hook/ThemeContext.jsx";

const Header = () => {

    const [hidden, setHidden] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const lastScrollY = useRef(0)
    const ticking = useRef(false)
    const headerRef = useRef(null)
    const location = useLocation()

    const { theme} = useTheme();


    const [openProfileModal, setOpenProfileModal] = useState(false);

    const [openSearch, setOpenSearch] = useState(false);

    const hoverTimer = useRef(null);

    const handleNotificationClick = () => { };

    useEffect(() => {
        const notificationSeen = localStorage.getItem('notificationSeen') === 'true'
        if (!notificationSeen) {
            setShowNotification(true)
        }
    }, [])

    useEffect(() => {
        if (location.pathname === '/notifications') {
            setShowNotification(false)
            localStorage.setItem('notificationSeen', 'true')
        }
    }, [location.pathname])

    useEffect(() => {
        const el = headerRef.current
        if (!el) return
        const height = el.getBoundingClientRect().height
        document.body.style.paddingTop = `${height}px`

        return () => {
            document.body.style.paddingTop = ''
        }
    }, [])

    useEffect(() => {
        const update = () => {
            const currentY = window.scrollY || window.pageYOffset
            const delta = currentY - lastScrollY.current
            const threshold = 15

            if (Math.abs(delta) > threshold) {
                if (currentY > lastScrollY.current && currentY > 120) {
                    setHidden(true)
                } else if (currentY + 50 < lastScrollY.current) {
                    setHidden(false)
                } else if (currentY <= 120) {
                    setHidden(false)
                }
            }

            lastScrollY.current = currentY
            ticking.current = false
        }

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(update)
                ticking.current = true
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const closeModal = () => setOpenProfileModal(false);

        const handleClickOutside = (e) => {
            if (!document.querySelector(".modal-profile")?.contains(e.target)) {
                closeModal();
            }
        };

        window.addEventListener("scroll", closeModal);
        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", closeModal);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!openSearch) return;

        const close = () => setOpenSearch(false);

        const isInsideModal = (target) => {
            const modal = document.querySelector(".ctn-search");
            return modal && modal.contains(target);
        };

        const handleClickOutside = (e) => {
            if (!isInsideModal(e.target)) close();
        };

        const handleScroll = (e) => {
            if (!isInsideModal(e.target)) close();
        };

        const handleWheel = (e) => {
            if (!isInsideModal(e.target)) close();
        };

        const handleTouch = (e) => {
            if (!isInsideModal(e.target)) close();
        };

        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("touchmove", handleTouch, { passive: true });

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchmove", handleTouch);
        };
    }, [openSearch]);


    return (
        <header ref={headerRef} className={`main-header ${hidden ? 'hidden' : ''}`}>

            <section className="ctn-left-header">
                <NavLink to='/feed' className="logo">
                    <img src={theme === "light" ? logoDark : logo} alt="logo eloy" />
                </NavLink>

                <Reputation />
            </section>

            <button className='btn-to-search' onClick={() => setOpenSearch(true)}>
                <i className='fa-solid fa-search'></i>
                <h1>Aperte <span>Ctrl + p</span> para pesquisar</h1>
            </button>

            <nav>
                <ul>
                    <li>
                        <NavLink to="/feed" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fa-solid fa-home"></i> <p>Início</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/chat" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fa-solid fa-comments"></i> <p>Mensagens</p>
                            <div className='on-message'></div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/publish" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fa-solid fa-square-plus"></i> <p>Publicar</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/notifications"
                            className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={handleNotificationClick}
                        >
                            <i className="fa-solid fa-bell"></i> <p>Notificações</p>
                            {showNotification && <div className='on-notification'></div>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) => isActive ? "active" : ""}

                            onMouseEnter={() => {
                                hoverTimer.current = setTimeout(() => {
                                    setOpenProfileModal(true);
                                }, 650);
                            }}

                            onMouseLeave={() => {
                                clearTimeout(hoverTimer.current);
                            }}
                        >
                            <i className="fa-solid fa-circle-user"></i> <p>Eu</p>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {openSearch && <Search close={() => setOpenSearch(false)} />}
            <ModalProfile open={openProfileModal} setOpen={setOpenProfileModal} />
        </header>
    )
}

export default Header
