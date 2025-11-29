import '../css/setting.css'
import '../css/content-settings.css'
import AsideSettings from '../components/ui/AsideSettings'
import HeaderSettings from '../components/ui/HeaderSettings'
import { Outlet } from 'react-router-dom'
import useAuthRedirect from '../hook/useAuthRedirect'
import { useState } from 'react'
import { supabase } from '../hook/supabaseClient'

const Settings = () => {
  useAuthRedirect()

  // 🔥 STATES DOS CARDS
  const [interests, setInterests] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [academics, setAcademics] = useState([])
  const [courses, setCourses] = useState([])
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [languages, setLanguages] = useState([])
  const [experiences, setExperiences] = useState([])

  // 🔥 STATES DA INTRODUCTION
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [birthday, setBirthday] = useState("")

  const [about, setAbout] = useState("")
  const [profileId, setProfileId] = useState(null)

  const saveChanges = async () => {
    if (!profileId) return

    const { error } = await supabase
      .from("profiles")
      .update({
        nome: name || null,
        titulo: title || null,
        estado: state || null,
        pais: country || null,
        aniversario: birthday || null, // ✅ corrige erro de date

        areainteresses: interests || [],
        resumo: about || null,
        formacao: academics || [],
        certificacoes: courses || [],
        competencias: skills || [],
        projetos: projects || [],
        idiomas: languages || [],
        experiencias: experiences || []
      })
      .eq("id", profileId)

    if (error) {
      console.error("Erro ao salvar:", error)
      return
    }

    // redireciona para perfil
    window.location.href = "/profile"
  }

  const cancelChanges = () => {
    window.location.href = "/profile"
  }

  return (
    <section className='content'>
      <article className='settings'>
        <HeaderSettings 
          saveHandler={saveChanges} 
          cancelHandler={cancelChanges} 
        />

        <section className='ctn-content-settings'>
          <aside>
            <AsideSettings />
          </aside>

          <section className='content-settings'>
            <Outlet context={{
              // 🔥 CARDS
              interests, setInterests,
              inputValue, setInputValue,
              academics, setAcademics,
              courses, setCourses,
              skills, setSkills,
              projects, setProjects,
              languages, setLanguages,
              experiences, setExperiences,

              // 🔥 INTRODUCTION
              name, setName,
              title, setTitle,
              state, setState,
              country, setCountry,
              birthday, setBirthday,

              // 🔥 INFO GERAL
              about, setAbout,
              profileId, setProfileId
            }} />
          </section>
        </section>
      </article>
    </section>
  )
}

export default Settings


// Quando salvo algum coisa em algum card ele apaga tudo dos outros card