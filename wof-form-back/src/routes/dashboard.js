import db from "../config/db.js";

export default async function dashboard(req, res) {
    if (!req.session || !req.session.authorized) {
        return res.redirect("/system/access");
    }

    try {
        const result = await db.query("SELECT * FROM registrations ORDER BY created_at DESC");

        const students = result && result.rows ? result.rows : [];

        return res.status(200).render("dashboard", {
            students: students
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erro interno ao carregar o painel");
    }
}
    