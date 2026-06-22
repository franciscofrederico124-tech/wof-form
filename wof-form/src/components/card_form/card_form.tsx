import style from "./card_form.module.css"

export default function CardForm() {
    return (
        <form autoComplete="off" className={style.card_form}>
            <h2>Formulário de inscrição</h2>
            
            <span className={style.theme}>
                Dados pessoais <i className="bi bi-person"></i>
            </span>
            
            <section className={style.inputs}>
                <div className={style.input}>
                    <label><i className="bi bi-person"></i></label>
                    <input type="text" placeholder="Primeiro nome" required />
                </div>
                
                <div className={style.input}>
                    <label><i className="bi bi-person"></i></label>
                    <input type="text" placeholder="Último nome" required />
                </div>

                <div className={style.input}>
                    <label><i className="bi bi-gender-ambiguous"></i></label>
                    <select defaultValue="" required>
                        <option value="" disabled hidden>Sexo</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                
                <div className={style.input}>
                    <label><i className="bi bi-calendar-date"></i></label>
                    <input type="date" required />
                </div>
                
                <div className={style.input}>
                    <label><i className="bi bi-envelope"></i></label>
                    <input type="email" placeholder="E-mail (Opcional)" />
                </div>
                
                <div className={style.input}>
                    <label><i className="bi bi-telephone"></i></label>
                    <input type="tel" placeholder="Telemóvel ( Whatsapp )" required />
                </div>
                
                <span className={style.theme}>
                    Dados académicos <i className="bi bi-book"></i>
                </span>
                
                <div className={style.input}>
                    <label><i className="bi bi-graph-up-arrow"></i></label>
                    <select defaultValue="" required>
                        <option value="" disabled hidden>Seu nível académico</option>
                        <option value="primeiro_ciclo">Primeiro ciclo</option>
                        <option value="ensino_medio">Ensino médio</option>
                        <option value="universitario">Universitário</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                <div className={style.input}>
                    <label><i className="bi bi-code-slash"></i></label>
                    <select defaultValue="" required>
                        <option value="" disabled hidden>Nível na programação</option>
                        <option value="junior">Júnior</option>
                        <option value="pleno">Pleno</option>
                        <option value="senior">Sênior</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                <span className={style.theme}>
                    Dados do curso <i className="bi bi-mortarboard"></i>
                </span>

                <div className={style.input}>
                    <label><i className="bi bi-journal-text"></i></label>
                    <select defaultValue="" required>
                        <option value="" disabled hidden>Qual curso vai fazer?</option>
                        <option value="slides_apresentacoes">Criação de slides e apresentações</option>
                        <option value="front_end">Desenvolvimento web front-end</option>
                        <option value="iot">Desenvolvimento de sistemas de IoT</option>
                    </select>
                </div>

                <div className={style.input}>
                    <label><i className="bi bi-clock"></i></label>
                    <select defaultValue="" required>
                        <option value="" disabled hidden>Horário preferencial</option>
                        <option value="manha">Manhã</option>
                        <option value="tarde">Tarde</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                <div className={style.input}>
                    <label><i className="bi bi-laptop"></i></label>
                    <select defaultValue="" required>
                        <option value="" disabled hidden>Tem algum dispositivo eletrónico?</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </div>

                <div className={style.input}>
                    <label><i className="bi bi-question-circle"></i></label>
                    <select defaultValue="" required>
                        <option value="" disabled hidden>Como ficou sabendo do curso?</option>
                        <option value="redes_sociais">Redes sociais</option>
                        <option value="anuncio">Anúncio</option>
                        <option value="amigo">Um amigo</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
            </section>

            <label className={style.checkbox_container}>
                <input type="checkbox" required />
                <span>Aceito os termos e condições da inscrição</span>
            </label>

            <button type="submit" className={style.submit_btn}>
                Concluir Inscrição
            </button>
        </form>
    )
}
