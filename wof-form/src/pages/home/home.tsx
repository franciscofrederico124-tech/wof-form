import Header from "../../components/header/header";
import CardForm from "../../components/card_form/card_form";
import style from "./home.module.css"

export default function Home()
{
    return (
        <main className={style.home}>
            <Header />
            <CardForm />
        </main>
    );
}