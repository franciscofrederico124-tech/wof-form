import db from "./db.js";
import init from "../routes/init.js";

export default async function reset(req, res) {
    if (!req.session || !req.session.authorized) {
        return res.status(401).json({
            success: false,
            message: "Acesso negado. Sessão inválida ou expirada."
        });
    }

    try {
        await db.query("DROP TABLE IF EXISTS registrations CASCADE");

        await init();

        return res.status(200).json({
            success: true,
            message: "Base de dados limpa e reconfigurada com sucesso!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao limpar a base de dados: " + error.message
        });
    }
}
