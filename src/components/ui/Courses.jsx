import { useEffect, useState } from "react";
import HeaderContentSettings from "./HeaderContentSettings";

const Courses = () => {

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const storageUser = localStorage.getItem("eloy_user");
        if (!storageUser) return;

        const userLogged = JSON.parse(storageUser);

        fetch("/db/users.json")
            .then(res => res.json())
            .then(data => {
                const user = data.find(u => u.id === userLogged.id);
                
                if (user && user.certificacoes) {
                    setCourses(user.certificacoes);
                }
            });
    }, []);

    return (
        <section className="ctn-change-courses">
            <HeaderContentSettings title='Meus Cursos' />
            <section className="content-change">

                <h1>Adicionar cursos</h1>
                <p>Adicione aqui seus cursos, especializações e treinamentos que contribuíram para ampliar seus conhecimentos e aprimorar suas competências profissionais.</p>

                <article className="ctn-add-experiences">

                    <div>
                        <label>curso</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>instituicao</label>
                        <input type="text" />
                    </div>

                    <div>
                        <label>duracao</label>
                        <input type="text" />
                    </div>

                </article>

                <section className="my-courses">

                    {Array.isArray(courses) && courses.length > 0 ? (
                        courses
                            .filter(course =>
                                Object.values(course).some(v => v && v.toString().trim() !== "")
                            )
                            .map((item, index, arr) => (
                                <article className="course" key={index}>
                                    <h1>{item.curso}</h1>
                                    <h2>{item.instituicao}</h2>
                                    <h3>{item.duracao}</h3>

                                    {arr.length > 1 && index < arr.length - 1 && <hr />}
                                </article>
                            ))
                    ) : (
                        <p>Nenhum curso adicionado ainda.</p>
                    )}

                </section>

            </section>
        </section>
    );
}

export default Courses;
