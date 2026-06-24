const form = document.getElementById("accessForm");
const btn = document.getElementById("btn");
const feedback = document.getElementById("feedback");
const key = document.getElementById("key");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const access_key = key.value;
    
    const data = {
        access_key: access_key
    }

    btn.disabled = true;
    btn.textContent = "Verificando...";
    feedback.textContent = "";

    try {

        const res = await fetch("/system/access", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (json.ok) {
            feedback.className = "feedback success";
            feedback.textContent = "Acesso autorizado";
        } else {
            feedback.className = "feedback error";
            feedback.textContent = json.message || "Acesso negado";
        }

    } catch (err) {
        feedback.className = "feedback error";
        feedback.textContent = "Erro de rede";
    }

    setTimeout(() => {
        btn.disabled = false;
    btn.textContent = "Entrar";
    }, 500)
});