document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("detailsModal");
    const closeModal = document.getElementById("closeModal");
    const resetDbBtn = document.getElementById("resetDbBtn");

    const rawStudentsGrid = document.getElementById("raw-students-data");
    const cards = rawStudentsGrid.querySelectorAll(".student-card");
    const coursesContainer = document.getElementById("courses-container");
    const statsContainer = document.getElementById("stats-container");

    // Caso a BD esteja limpa ou vazia
    if (cards.length === 0) {
        rawStudentsGrid.style.display = "block";
        return;
    }

    const totalStudents = cards.length;
    const coursesGroup = {};

    // Agrupar elementos capturados por curso
    cards.forEach(card => {
        const rawData = card.getAttribute("data-student");
        if (!rawData) return;

        const student = JSON.parse(rawData);
        const courseName = student.degree_school || "Sem Curso Definido";

        if (!coursesGroup[courseName]) {
            coursesGroup[courseName] = [];
        }
        coursesGroup[courseName].push(card);
    });

    // 1. Injetar Blocos de Estatísticas Gerais
    let statsHTML = `
        <div class="stat-box total-geral">
            <h3>Total Geral</h3>
            <span class="stat-number">${totalStudents}</span>
        </div>
    `;

    Object.keys(coursesGroup).forEach(course => {
        statsHTML += `
            <div class="stat-box">
                <h3>${course}</h3>
                <span class="stat-number">${coursesGroup[course].length}</span>
            </div>
        `;
    });
    statsContainer.innerHTML = statsHTML;

    // 2. Construir Secções e Grids independentes por Curso
    Object.keys(coursesGroup).forEach(courseName => {
        const courseSection = document.createElement("section");
        courseSection.className = "course-section";

        const courseTitle = document.createElement("h2");
        courseTitle.className = "course-section-title";
        courseTitle.innerHTML = `<i class="bi bi-book-half"></i> ${courseName} <small>(${coursesGroup[courseName].length} inscritos)</small>`;

        const courseGrid = document.createElement("div");
        courseGrid.className = "students-grid";

        coursesGroup[courseName].forEach(card => {
            // Clonar o nó para poder atribuir eventos isolados sem mutar a stack invisível do HBS
            const clonedCard = card.cloneNode(true);
            clonedCard.addEventListener("click", () => openStudentModal(clonedCard));
            courseGrid.appendChild(clonedCard);
        });

        courseSection.appendChild(courseTitle);
        courseSection.appendChild(courseGrid);
        coursesContainer.appendChild(courseSection);
    });

    // Função de Preenchimento e Abertura do Modal
    function openStudentModal(card) {
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
    }

    // Fechar Modal
    closeModal.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });

    // Delegar evento de Cópia global no body para cobrir os itens injetados dinamicamente
    document.body.addEventListener("click", async (e) => {
        const btn = e.target.closest(".copy-btn");
        if (!btn) return;

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

    // Ação do Botão de Limpeza do Banco de Dados
    if (resetDbBtn) {
        resetDbBtn.addEventListener("click", async () => {
            const confirmReset = confirm("Tem a certeza de que deseja apagar permanentemente todas as inscrições do sistema?");
            if (!confirmReset) return;

            try {
                const res = await fetch("/system/reset_db", {
                    method: "GET",
                    headers: { "X-Requested-With": "XMLHttpRequest" }
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