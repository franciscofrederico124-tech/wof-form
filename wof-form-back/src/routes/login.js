import dotenv from "dotenv";
dotenv.config();

export default function login(req, res) {
    const {
        access_key
    } = req.body;
    
    const access_key_local = process.env.ACCESS_KEY;
    
    try {
        if (!access_key) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "Insira a password! "
            })
        }
        if (access_key.trim() !== access_key_local.trim())
        {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "Acesso negado! "
            });
            
        }
        
        return res.redirect("/system/home");
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            status: "error",
            message: "Erro interno! "
        })
    }
}