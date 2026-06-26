import { useState } from "react";
import register from "../../services/register";
import style from "./card_form.module.css";

export default function CardForm() {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState(false);

    async function handleSubmit(e: any) {
        e.preventDefault();

        setFeedback("");
        setLoading(true);

        const formElements = e.target.elements;

        const data = {
            first_name: formElements.first_name.value,
            last_name: formElements.last_name.value,
            gender: formElements.gender.value,
            data: formElements.data.value,
            email: formElements.email.value || undefined,
            tel: formElements.tel.value,
            course: formElements.course.value,
            academic_level: formElements.academic_level.value,
            level: formElements.level.value
        };

        const res = await register(data);

        setLoading(false);

        if (res.ok) {
            setFeedback("Inscrição enviada com sucesso!");
            setTimeout(() => {
                setOk(true);
            }, 1500);
        } else {
            setFeedback(res.message || "Erro ao enviar formulário");
        }
    }

    return (
        <form
            autoComplete="off"
            className={style.card_form}
            onSubmit={handleSubmit}
        >
            {!ok ? (
                <>
                    <h2>Formulário de inscrição</h2>

                    <span className={style.theme}>
                        Dados pessoais <i className="bi bi-person"></i>
                    </span>

                    <section className={style.inputs}>
                        <div className={style.input}>
                            <label><i className="bi bi-person"></i></label>
                            <input name="first_name" type="text" required placeholder="Primeiro nome" />
                        </div>

                        <div className={style.input}>
                            <label><i className="bi bi-person-badge"></i></label>
                            <input name="last_name" type="text" required placeholder="Último nome" />
                        </div>

                        <div className={style.input}>
                            <label><i className="bi bi-gender-ambiguous"></i></label>
                            <select name="gender" defaultValue="" required>
                                <option value="" disabled>Género</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                            </select>
                        </div>

                        <div className={style.input}>
                            <label><i className="bi bi-calendar-date"></i></label>
                            <input name="data" type="date" required />
                        </div>

                        <div className={style.input}>
                            <label><i className="bi bi-envelope"></i></label>
                            <input name="email" type="email" placeholder="Email (opcional)" />
                        </div>

                        <div className={style.input}>
                            <label><i className="bi bi-telephone"></i></label>
                            <input name="tel" type="tel" required placeholder="Telemóvel (WhatsApp)" />
                        </div>

                        <span className={style.theme}>
                            Dados académicos <i className="bi bi-book"></i>
                        </span>

                        <div className={style.input}>
                            <label><i className="bi bi-mortarboard"></i></label>
                            <select name="course" defaultValue="" required>
                                <option value="" disabled>Curso pretendido</option>
                                <option value="slide">Criação de Slides, Oratória e Retórica</option>
                                <option value="web">Desenvolvimento Web</option>
                                <option value="iot">Desenvolvimento de sistemas IOT</option>
                            </select>
                        </div>

                        <div className={style.input}>
                            <label><i className="bi bi-mortarboard"></i></label>
                            <select name="academic_level" defaultValue="" required>
                                <option value="" disabled>Nível académico</option>
                                <option value="medio">Médio</option>
                                <option value="universitario">Universitário</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>

                        <div className={style.input}>
                            <label><i className="bi bi-code-slash"></i></label>
                            <select name="level" defaultValue="" required>
                                <option value="" disabled>Nível de experiência</option>
                                <option value="junior">Júnior</option>
                                <option value="pleno">Pleno</option>
                                <option value="senior">Sénior</option>
                            </select>
                        </div>
                    </section>

                    {feedback && (
                        <div className={style.feedback}>
                            {feedback}
                        </div>
                    )}

                    <button disabled={loading} className={style.submit_btn}>
                        {loading ? "Enviando..." : "Concluir inscrição"}
                    </button>
                </>
            ) : (
                <div className={style.success}>
                    <h2>
                        Inscrição enviada <i className="bi bi-check-circle"></i>
                    </h2>
                    <span className={style.theme}>
                        Tão logo, receberá um convite para se juntar à comunidade oficial
                    </span>
                </div>
            )}
        </form>
    );
}
