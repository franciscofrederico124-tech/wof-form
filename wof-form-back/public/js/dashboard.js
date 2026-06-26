document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("detailsModal");
    const closeModal = document.getElementById("closeModal");
    const cards = document.querySelectorAll(".student-card");
    const resetDbBtn = document.getElementById("resetDbBtn");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const rawData = card.getAttribute("data-student");
            if (!rawData) return;

            const student = JSON.parse(rawData);

            document.getElementById("modal-id").value = student.id || "";
            document.getElementById("modal-firstname").value = student.first_name || "";
            document.getElementById("modal-lastname").value = student.last_name || "";
            document.getElementById("modal-gender").value = student.gender || "";
            document.getElementById("modal-email").value = student.email || "Sem email";
            document.getElementById("modal-tel").value = student.tel || "";
            document.getElementById("modal-school").value = student.degree_school || "";
            document.getElementById("modal-level").value = student.level || "";
            // document.getElementById("modal-edits").value = student.edit_count !== undefined ? student.edit_count : "0";

            if (student.birth_date) {
                const birth = new Date(student.birth_date);
                document.getElementById("modal-birthdate").value = birth.toLocaleDateString("pt");
            } else {
                document.getElementById("modal-birthdate").value = "";
            }

            if (student.created_at) {
                const date = new Date(student.created_at);
                document.getElementById("modal-date").value = date.toLocaleString("pt");
            } else {
                document.getElementById("modal-date").value = "";
            }

            modal.classList.add("active");
        });
    });

    closeModal.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    document.querySelectorAll(".copy-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const inputId = btn.getAttribute("data-target");
            const inputElement = document.getElementById(inputId);

            if (!inputElement || !inputElement.value) return;

            try {
                await navigator.clipboard.writeText(inputElement.value);

                const originalIcon = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-lg"></i>';
                btn.classList.add("copied");

                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                    btn.classList.remove("copied");
                }, 1500);
            } catch (err) {
                console.error("Falha ao copiar dados", err);
            }
        });
    });

    if (resetDbBtn) {
        resetDbBtn.addEventListener("click", async () => {
            const confirmReset = confirm("Tem a certeza de que deseja apagar permanentemente todas as inscrições do sistema?");
            if (!confirmReset) return;

            try {
                const res = await fetch("/system/reset_db", {
                    method: "GET",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });

                const json = await res.json();

                if (json.success) {
                    window.location.reload();
                } else {
                    alert(json.message || "Erro ao limpar o banco de dados.");
                }
            } catch (err) {
                console.error(err);
                alert("Erro de rede ao tentar limpar o banco de dados.");
            }
        });
    }
});
