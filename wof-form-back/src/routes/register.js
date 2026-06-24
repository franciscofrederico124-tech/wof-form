import db from "../config/db.js";

export default async function register(req, res) {

    try {

        if (!req.session) {
            return res.status(401).json({
                ok: false,
                message: "Sessão inválida"
            });
        }

        let {
            first_name,
            last_name,
            gender,
            data,
            email,
            tel,
            degree_school,
            level
        } = req.body;

        first_name = first_name?.trim();
        last_name = last_name?.trim();
        gender = gender?.trim();
        email = email?.trim()?.toLowerCase();
        tel = tel?.replace(/[^\d+]/g, "");
        degree_school = degree_school?.trim();
        level = level?.trim();

        if (!first_name || first_name.length < 3) {
            return res.status(400).json({ ok: false, message: "Nome inválido" });
        }

        if (!last_name || last_name.length < 3) {
            return res.status(400).json({ ok: false, message: "Apelido inválido" });
        }

        if (!gender) {
            return res.status(400).json({ ok: false, message: "Sexo obrigatório" });
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ ok: false, message: "Email inválido" });
            }
        }

        const phoneRegex = /^[0-9+]{9,15}$/;

        if (!tel || !phoneRegex.test(tel)) {
            return res.status(400).json({ ok: false, message: "Telefone inválido" });
        }

        if (!data) {
            return res.status(400).json({ ok: false, message: "Data obrigatória" });
        }

        const birth = new Date(data);
        const now = new Date();

        let age = now.getFullYear() - birth.getFullYear();

        const monthDiff = now.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
            age--;
        }

        if (age < 10) {
            return res.status(400).json({ ok: false, message: "Idade mínima 10 anos" });
        }

        if (!degree_school || !level) {
            return res.status(400).json({ ok: false, message: "Dados académicos inválidos" });
        }

        const exists = await db.query(
            `
            SELECT id
            FROM registrations
            WHERE tel = $1
            OR (
                LOWER(first_name) = LOWER($2)
                AND LOWER(last_name) = LOWER($3)
            )
            LIMIT 1
            `,
            [tel, first_name, last_name]
        );

        if (exists.rows.length) {
            return res.status(409).json({
                ok: false,
                message: "Já existe registo com este nome ou número"
            });
        }

        const inserted = await db.query(
            `
            INSERT INTO registrations
            (
                first_name,
                last_name,
                gender,
                birth_date,
                email,
                tel,
                degree_school,
                level
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING id, first_name, last_name, tel
            `,
            [
                first_name,
                last_name,
                gender,
                data,
                email || null,
                tel,
                degree_school,
                level
            ]
        );

        req.session.user = {
            id: inserted.rows[0].id,
            first_name,
            last_name,
            tel
        };
    
        return res.json({
            ok: true,
            message: "Inscrição realizada com sucesso",
            user: inserted.rows[0]
        });

    } catch (err) {

        return res.status(500).json({
            ok: false,
            message: "Erro interno do servidor"
        });
    }
}