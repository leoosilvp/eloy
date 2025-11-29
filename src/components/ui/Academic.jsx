import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import HeaderContentSettings from "./HeaderContentSettings"
import { supabase } from "../../hook/supabaseClient"

const Academic = () => {
  const { academics, setAcademics } = useOutletContext()
  const [newAcademic, setNewAcademic] = useState({
    instituicao: "",
    curso: "",
    ano: ""
  })

  // Carregar dados do Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) return console.error("Erro ao pegar usuário:", userError)
        if (!user) return

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("formacao")
          .eq("id", user.id)
          .single()

        if (profileError) return console.error("Erro ao carregar perfil:", profileError)

        setAcademics(profile?.formacao || [])
      } catch (err) {
        console.error("Erro ao buscar perfil:", err)
      }
    }

    fetchProfile()
  }, [setAcademics])

  // Adicionar nova formação
  const addAcademic = () => {
    if (
      !newAcademic.instituicao.trim() &&
      !newAcademic.curso.trim() &&
      !newAcademic.ano.trim()
    ) return

    setAcademics(prev => [...prev, newAcademic])
    setNewAcademic({ instituicao: "", curso: "", ano: "" })
  }

  const removeAcademic = index => {
    setAcademics(prev => prev.filter((_, i) => i !== index))
  }

  const validAcademics = academics.filter(ac =>
    Object.values(ac).some(value => value && value.toString().trim() !== "")
  )

  return (
    <section className="ctn-change-academic">
      <HeaderContentSettings title="Formação" />

      <section className="content-change">
        <h1>Adicionar formação</h1>
        <p>
          Adicione aqui suas formações acadêmicas, cursos e certificações que contribuíram 
          para o seu desenvolvimento profissional e pessoal.
        </p>

        <article className="ctn-add-experiences">
          <div>
            <label>Instituição</label>
            <input
              type="text"
              value={newAcademic.instituicao}
              onChange={e =>
                setNewAcademic(prev => ({ ...prev, instituicao: e.target.value }))
              }
            />
          </div>

          <div>
            <label>Curso</label>
            <input
              type="text"
              value={newAcademic.curso}
              onChange={e =>
                setNewAcademic(prev => ({ ...prev, curso: e.target.value }))
              }
            />
          </div>

          <div>
            <label>Ano</label>
            <input
              type="month"
              value={newAcademic.ano}
              onChange={e =>
                setNewAcademic(prev => ({ ...prev, ano: e.target.value }))
              }
            />
          </div>

          <button onClick={addAcademic}>Adicionar</button>
        </article>

        <hr />

        <section className="ctn-my-academics">
          {validAcademics.length === 0 ? (
            <p>Nenhuma formação adicionada ainda.</p>
          ) : (
            validAcademics.map((item, index) => (
              <article className="academic" key={index}>
                <h1>{item.instituicao}</h1>
                <h2>{item.curso}</h2>
                <h3>{item.ano}</h3>

                <button onClick={() => removeAcademic(index)}>Remover</button>

                {validAcademics.length > 1 && index < validAcademics.length - 1 && <hr />}
              </article>
            ))
          )}
        </section>
      </section>
    </section>
  )
}

export default Academic
