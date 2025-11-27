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

import { supabase } from '../hook/supabaseClient';

const User = () => {
  const { username } = useParams(); // pegando user_name da URL
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);

      try {
        // Pega sessão do usuário logado
        const { data: sessionData } = await supabase.auth.getSession();
        const loggedUserId = sessionData.session?.user?.id;

        // Busca dados do usuário pelo user_name
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_name", username) // busca pelo user_name
          .single();

        if (error || !data) {
          navigate("/error");
          return;
        }

        // Se for o mesmo usuário logado, redireciona para /profile
        if (loggedUserId === data.id) {
          navigate("/profile");
          return;
        }

        setUserData(data);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [username, navigate]);

  if (loading) return <p>Carregando...</p>;
  if (!userData) return null;

  return (
    <section className="content">
      <section className="ctn-content-profile">
        <article className='card-content-profile'>
          <BannerProfile user={userData} />
          <ContentProfile user={userData} />
        </article>

        <CardInterests user={userData}/>
        <CardAbout user={userData}/>
        <CardFeedProfile user={userData}/>
        <CardExperiences user={userData}/>
        <CardAcademic user={userData}/>
        <CardProjects user={userData}/>
        <CardMyCourses user={userData}/>
        <CardLanguages user={userData}/>
        <CardSkills user={userData}/>
      </section>

      <aside className="right">
        <CardNewslatter/>
        <CardAds />
      </aside>
    </section>
  );
};

export default User;
