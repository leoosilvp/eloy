import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import BannerProfile from '../components/ui/BannerProfile';
import ContentProfile from '../components/ui/ContentProfile';
import CardInterests from '../components/ui/CardInterests';
import CardAbout from '../components/ui/CardAbout';
import CardExperiences from '../components/ui/CardExperiences';
import CardAcademic from '../components/ui/CardAcademic';
import CardProjects from '../components/ui/CardProjects';
import CardMyCourses from '../components/ui/CardMyCourses';
import CardLanguages from '../components/ui/CardLanguages';
import CardSkills from '../components/ui/CardSkills';
import CardNewslatter from '../components/ui/CardNewslatter';
import CardAds from '../components/ui/CardAds';
import CardFeedProfile from '../components/ui/CardFeedProfile';

const User = () => {

  const { id } = useParams(); 
  const navigate = useNavigate();

  const [validUser, setValidUser] = useState(false);

  useEffect(() => {

    const loggedUser = localStorage.getItem("eloy_user");
    if (loggedUser) {
      const loggedData = JSON.parse(loggedUser);

      if (String(loggedData.id) === String(id)) {
        navigate("/profile");
        return;
      }
    }

    fetch("/db/users.json")
      .then(res => res.json())
      .then(data => {
        const userExists =
          Array.isArray(data) &&
          data.some(u => String(u.id) === String(id));

        if (userExists) {
          localStorage.setItem("current_profile_id", JSON.stringify({ id: String(id) }));
          setValidUser(true);
        } else {
          navigate("/error");
        }
      })
      .catch(err => {
        console.error("Erro ao carregar JSON:", err);
        navigate("/error");
      });

  }, [id, navigate]);

  if (!validUser) return null;

  return (
    <section className="content">
      <section className="ctn-content-profile">

        <article className='card-content-profile'>
          <BannerProfile local='current_profile_id' />
          <ContentProfile local='current_profile_id' />
        </article>
        <CardInterests local='current_profile_id'/>
        <CardAbout local='current_profile_id'/>
        <CardFeedProfile local='current_profile_id' />
        <CardExperiences local='current_profile_id'/>
        <CardAcademic local='current_profile_id'/>
        <CardProjects local='current_profile_id'/>
        <CardMyCourses local='current_profile_id'/>
        <CardLanguages local='current_profile_id'/>
        <CardSkills local='current_profile_id'/>

      </section>

      <aside className="right">
        <CardNewslatter/>
        <CardAds />
      </aside>
    </section>
  );
};

export default User;
