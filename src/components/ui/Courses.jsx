import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import HeaderContentSettings from "./HeaderContentSettings"
import { supabase } from "../../hook/supabaseClient"

const Courses = () => {
    const { courses, setCourses, setProfileId } = useOutletContext()

    const [newCourse, setNewCourse] = useState({
        curso: "",
        instituicao: "",
        duracao: ""
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                if (userError) return console.error("Erro ao pegar usuário:", userError)
                if (!user) return

                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("id, certificacoes")
                    .eq("id", user.id)
                    .single()

                if (profileError) return console.error("Erro ao carregar cursos:", profileError)

                setProfileId(profile.id)
                setCourses(profile.certificacoes || [])
            } catch (err) {
                console.error("Erro ao buscar cursos:", err)
            }
        }

        fetchProfile()
    }, [setCourses, setProfileId])

    const addCourse = () => {
        if (
            !newCourse.curso.trim() &&
            !newCourse.instituicao.trim() &&
            !newCourse.duracao.trim()
        ) return

        setCourses(prev => [...prev, newCourse])

        setNewCourse({
            curso: "",
            instituicao: "",
            duracao: ""
        })
    }

    const removeCourse = index => {
        setCourses(prev => prev.filter((_, i) => i !== index))
    }

    const validCourses = Array.isArray(courses)
        ? courses.filter(course =>
            Object.values(course).some(v => v && v.toString().trim() !== "")
        )
        : []

    return (
        <section className="ctn-change-courses">
            <HeaderContentSettings title="Meus Cursos" />

            <section className="content-change">
                <h1>Adicionar cursos</h1>
                <p>
                    Adicione aqui seus cursos, especializações e treinamentos que contribuíram para ampliar seus
                    conhecimentos e aprimorar suas competências profissionais.
                </p>

                <article className="ctn-add-experiences">
                    <div>
                        <label>Curso</label>
                        <input
                            type="text"
                            value={newCourse.curso}
                            onChange={e => setNewCourse(prev => ({ ...prev, curso: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label>Instituição</label>
                        <input
                            type="text"
                            value={newCourse.instituicao}
                            onChange={e => setNewCourse(prev => ({ ...prev, instituicao: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label>Duração</label>
                        <input
                            type="text"
                            value={newCourse.duracao}
                            onChange={e => setNewCourse(prev => ({ ...prev, duracao: e.target.value }))}
                        />
                    </div>

                    <button onClick={addCourse}>Adicionar</button>
                </article>

                <hr />

                <section className="my-courses">
                    {validCourses.length === 0 ? (
                        <p>Nenhum curso adicionado ainda.</p>
                    ) : (
                        validCourses.map((item, index) => (
                            <article className="course" key={index}>
                                <h1>{item.curso}</h1>
                                <h2>{item.instituicao}</h2>
                                <h3>{item.duracao}</h3>

                                <button onClick={() => removeCourse(index)}>Remover</button>

                                {validCourses.length > 1 && index < validCourses.length - 1 && <hr />}
                            </article>
                        ))
                    )}
                </section>
            </section>
        </section>
    )
}

export default Courses
