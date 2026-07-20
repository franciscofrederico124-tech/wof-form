import db from "../config/db.js"

export default async function remove(req, res)
{
    if (!req.session || !req.session.authorized)
    {
        return res.status(401).json({
            success: false,
            message: "Não autorizado"
        });
    }

    const { id } = req.body;
    console.log("id: ", id);

    if (!id)
    {
        return res.status(400).json({
            success: false,
            message: "ID não fornecido"
        });
    }

    try
    {
        const result = await db.query(
            "DELETE FROM registrations WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0)
        {
            return res.status(404).json({
                success: false,
                message: "Registro não encontrado"
            });
        }

        return res.json({
            success: true,
        });
    }
    catch (error)
    {
        console.error("Erro ao eliminar registro:", error);
        return res.status(500).json({
            success: false,
            message: "Erro no servidor"
        });
    }
}