import { useState } from "react";
import register from "../../services/register";
import style from "./card_form.module.css";
import { pdf } from "@react-pdf/renderer";
import { FichaInscricaoPdf, DadosInscricao } from "../../services/generateficha";

export default function CardForm() {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState(false);

    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [dadosSalvos, setDadosSalvos] = useState<DadosInscricao | null>(null);

    // Função responsável apenas por forçar o download do arquivo
    function dispararDownload(blob: Blob, primeiroNome: string, ultimoNome: string) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const nomeArquivo = `${primeiroNome.toLowerCase()}-${ultimoNome.toLowerCase()}`;
        link.download = `ficha-inscricao-${nomeArquivo}.pdf`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // Função chamada quando o utilizador clica manualmente no botão da tela de sucesso
    function handleDownloadPdf() {
        if (!pdfBlob || !dadosSalvos) return;
        dispararDownload(pdfBlob, dadosSalvos.first_name, dadosSalvos.last_name);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        setFeedback("");
        setLoading(true);

        const formElements = e.target.elements;

        const data: DadosInscricao = {
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

        if (res.ok) {
            setFeedback("Inscrição enviada com sucesso!");
            setDadosSalvos(data);

            try {
                const doc = <FichaInscricaoPdf dados={data} />;
                const blob = await pdf(doc).toBlob();
                setPdfBlob(blob);

                // Ativa a tela de sucesso e dispara o download automático após 1.5 segundos
                setTimeout(() => {
                    setOk(true);
                    dispararDownload(blob, data.first_name, data.last_name);
                }, 1500);

            } catch (pdfError) {
                console.error("Erro ao gerar o PDF:", pdfError);
                // Mesmo com erro no PDF, avança para o ecrã de sucesso
                setTimeout(() => {
                    setOk(true);
                }, 1500);
            }
        } else {
            setFeedback(res.message || "Erro ao enviar formulário");
        }
        setLoading(false);
    }

    return (
        <form autoComplete="off" className={style.card_form} onSubmit={handleSubmit}>
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
                                <option value="slide"> Desenvolvimento de Slides </option>
                                <option value="web">Desenvolvimento Web Front-End</option>
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
                                <option value="junior">Iniciante</option>
                                <option value="pleno">Intermediário</option>
                                <option value="senior">Avançado</option>
                            </select>
                        </div>
                    </section>

                    {feedback && <div className={style.feedback}>{feedback}</div>}

                    <button type="submit" disabled={loading} className={style.submit_btn}>
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

                    <button
                        type="button"
                        className={style.submit_btn}
                        onClick={handleDownloadPdf}
                        disabled={!pdfBlob}
                    >
                        {!pdfBlob ? "A carregar PDF..." : "Descarregar ficha de inscrição ( PDF )"}
                    </button>
                </div>
            )}
        </form>
    );
}