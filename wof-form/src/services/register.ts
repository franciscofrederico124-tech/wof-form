import url from "../hooks/url";

type RegisterData = {
    first_name: string;
    last_name: string;
    gender: string;
    data: string;
    email?: string;
    tel: string;
    course: string;
    academic_level: string;
    level: string;
};

function sanitize(data: RegisterData): RegisterData {
    return {
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        gender: data.gender?.trim(),
        data: data.data,
        email: data.email?.trim().toLowerCase(),
        tel: data.tel?.trim(),
        course: data.course?.trim(),
        academic_level: data.academic_level?.trim(),
        level: data.level?.trim()
    };
}

function validate(data: RegisterData): string | null {
    if (!data.first_name || data.first_name.length < 3) {
        return "Nome inválido (mínimo 3 caracteres)";
    }

    if (!data.last_name || data.last_name.length < 3) {
        return "Apelido inválido";
    }

    if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return "Email inválido";
        }
    }

    const phoneRegex = /^[0-9+]{9,15}$/;
    if (!data.tel || !phoneRegex.test(data.tel)) {
        return "Telefone inválido";
    }

    if (!data.data) {
        return "Data de nascimento obrigatória";
    }

    if (!data.course) return "Selecione um curso válido";
    if (!data.academic_level) return "Selecione um nível académico válido";

    return null;
}

export default async function register(data: RegisterData) {
    try {
        const cleanData = sanitize(data);
        const error = validate(cleanData);

        if (error) {
            return {
                ok: false,
                message: error
            };
        }

        const res = await fetch(
            `${url.apiBase}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(cleanData)
            }
        );

        const json = await res.json();
        return json;

    } catch (err) {
        return {
            ok: false,
            message: "Erro de rede"
        };
    }
}