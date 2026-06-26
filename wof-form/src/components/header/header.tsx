import style from "./header.module.css"
import logo from "../../public/assets/logo.png"

export default function Header() {
    return (
        <header className={style.header}>
            <div className={style.logo}>
                <img src={logo} alt="Logo_wof" />
            </div>
            <h1 className={style.title}>
                Mega plano de férias <br />
                WOF Project
            </h1>
            <span>
                Transforme as tuas ideias em projectos reais. Da concepção até à apresentação do projecto!
            </span>
            <span>
                Preencha o formulário e garnta sua vaga
            </span>
        </header>
    )
}