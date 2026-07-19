document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("detailsModal");
    const closeModal = document.getElementById("closeModal");
    const resetDbBtn = document.getElementById("resetDbBtn");

    const rawStudentsGrid = document.getElementById("raw-students-data");
    const cards = rawStudentsGrid.querySelectorAll(".student-card");
    const coursesContainer = document.getElementById("courses-container");
    const statsContainer = document.getElementById("stats-container");

    // Caminhos das imagens usadas na ficha em PDF (mesma convenção de /style/ e /js/)
    const LOGO_PATH = "../images/logo.png";
    const QR_PATH = "../images/qr.png";

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
            clonedCard.addEventListener("click", (e) => {
                // Não abrir o modal se o clique tiver sido no botão de gerar PDF
                if (e.target.closest(".generate-pdf-btn")) return;
                openStudentModal(clonedCard);
            });
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

    // ==========================================================
    // GERAÇÃO DA FICHA DE INSCRIÇÃO EM PDF (client-side, pdfmake)
    // ==========================================================

    // Converte uma imagem de uma URL para Base64 (necessário para o pdfmake)
    async function toDataURL(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Falha ao carregar imagem: ${url}`);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Formata a data de nascimento (aceita "YYYY-MM-DD" ou ISO completo)
    function formatarDataNascimento(birthDate) {
        if (!birthDate) return "Não informado";
        const data = new Date(birthDate);
        if (isNaN(data.getTime())) return "Não informado";
        return data.toLocaleDateString("pt-PT");
    }

    async function gerarFichaInscricaoPDF(student, btn) {
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> A gerar...';

        try {
            const [logoData, qrData] = await Promise.all([
                toDataURL(LOGO_PATH),
                toDataURL(QR_PATH)
            ]);

            // --- Preenchimento correto dos campos, com fallback seguro ---
            const firstName = student.first_name || "Não informado";
            const lastName = student.last_name || "Não informado";
            const gender = student.gender || "Não informado";
            const birthDate = formatarDataNascimento(student.birth_date);
            const tel = student.tel || "Não informado";
            const email = student.email || "Não Fornecido";
            const curso = student.degree_school || "Não informado";
            const nivel = student.level || "Não informado";
            const registoId = student.id || "N/A";

            const cellLabel = (text) => ({ text, style: "cellLabel" });
            const cellValue = (text) => ({ text: text || "-", style: "cellValue" });

            const docDefinition = {
                pageSize: "A4",
                pageMargins: [35, 40, 35, 30],
                defaultStyle: { fontSize: 10, color: "#334155" },
                styles: {
                    logoTitle: { fontSize: 22, bold: true, color: "#0f172a" },
                    logoSubtitle: { fontSize: 8, color: "#64748b" },
                    docTitle: { fontSize: 18, bold: true, color: "#1e3a8a", alignment: "right" },
                    docSubtitle: { fontSize: 9, bold: true, color: "#d97706", alignment: "right" },
                    alertTitle: { fontSize: 10, bold: true, color: "#1e3a8a", margin: [0, 0, 0, 3] },
                    alertText: { fontSize: 9.5, color: "#334155", lineHeight: 1.3 },
                    sectionTitle: { fontSize: 10.5, bold: true, color: "#1e3a8a", margin: [0, 14, 0, 10] },
                    cellLabel: { fontSize: 7.5, bold: true, color: "#64748b" },
                    cellValue: { fontSize: 10, bold: true, color: "#0f172a", margin: [0, 3, 0, 0] },
                    paymentLabel: { fontSize: 8.5, bold: true, color: "#9a3412" },
                    paymentValue: { fontSize: 20, bold: true, color: "#ea580c", margin: [0, 2, 0, 0] },
                    bankSectionTitle: { fontSize: 8.5, bold: true, color: "#ea580c" },
                    bankLabel: { fontSize: 9.5, bold: true, color: "#64748b" },
                    bankValue: { fontSize: 9.5, bold: true, color: "#334155" },
                    bankValueHighlight: { fontSize: 11, bold: true, color: "#0f172a" },
                    bankValuePhone: { fontSize: 9.5, bold: true, color: "#1e3a8a" },
                    instructionText: { fontSize: 9.5, color: "#334155", margin: [0, 0, 0, 8], lineHeight: 1.3 },
                    footer: { fontSize: 8, color: "#94a3b8", alignment: "right" },
                    idBadge: { fontSize: 7, color: "#94a3b8", alignment: "right" }
                },
                content: [
                    // Cabeçalho
                    {
                        columns: [
                            {
                                width: "auto",
                                columns: [
                                    { image: logoData, width: 50, height: 50 },
                                    {
                                        width: "auto",
                                        margin: [8, 0, 0, 0],
                                        stack: [
                                            { text: "WOF-HUB", style: "logoTitle" },
                                            { text: "PLANO DE FÉRIAS", style: "logoSubtitle" }
                                        ]
                                    }
                                ]
                            },
                            {
                                width: "*",
                                stack: [
                                    { text: "Ficha de Inscrição", style: "docTitle" },
                                    { text: "CONFIRMAÇÃO PENDENTE", style: "docSubtitle" },
                                ]
                            }
                        ]
                    },
                    {
                        canvas: [{ type: "line", x1: 0, y1: 0, x2: 525, y2: 0, lineWidth: 2, lineColor: "#1e3a8a" }],
                        margin: [0, 10, 0, 16]
                    },

                    // Caixa de alerta
                    {
                        table: {
                            widths: ["*"],
                            body: [[{
                                stack: [
                                    { text: "Confirmação de Vaga Pendente", style: "alertTitle" },
                                    { text: "O seu formulário foi recebido com sucesso. Para garantir e efetivar o seu lugar na turma, conclua o pagamento da taxa de inscrição descrita abaixo.", style: "alertText" }
                                ],
                                fillColor: "#f1f5f9",
                                border: [false, false, false, false]
                            }]]
                        },
                        layout: {
                            hLineWidth: () => 0,
                            vLineWidth: (i) => (i === 0 ? 4 : 0),
                            vLineColor: () => "#1d4ed8",
                            paddingLeft: () => 12, paddingRight: () => 12,
                            paddingTop: () => 10, paddingBottom: () => 10
                        },
                        margin: [0, 0, 0, 4]
                    },

                    // Dados do Candidato
                    { text: "DADOS DO CANDIDATO", style: "sectionTitle" },
                    {
                        table: {
                            widths: ["*", "*"],
                            body: [
                                [
                                    { stack: [cellLabel("PRIMEIRO NOME"), cellValue(firstName)], margin: [6, 6, 6, 6] },
                                    { stack: [cellLabel("ÚLTIMO NOME"), cellValue(lastName)], margin: [6, 6, 6, 6] }
                                ],
                                [
                                    { stack: [cellLabel("GÉNERO"), cellValue(gender)], margin: [6, 6, 6, 6] },
                                    { stack: [cellLabel("DATA DE NASCIMENTO"), cellValue(birthDate)], margin: [6, 6, 6, 6] }
                                ],
                                [
                                    { stack: [cellLabel("TELEMÓVEL / WHATSAPP"), cellValue(tel)], margin: [6, 6, 6, 6] },
                                    { stack: [cellLabel("E-MAIL (OPCIONAL)"), cellValue(email)], margin: [6, 6, 6, 6] }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: () => 1, vLineWidth: () => 1,
                            hLineColor: () => "#e2e8f0", vLineColor: () => "#e2e8f0",
                            paddingLeft: () => 0, paddingRight: () => 0, paddingTop: () => 0, paddingBottom: () => 0
                        },
                        margin: [0, 0, 0, 12]
                    },

                    // Dados Académicos e Curso
                    { text: "DADOS ACADÉMICOS E CURSO", style: "sectionTitle" },
                    {
                        table: {
                            widths: ["*", "*"],
                            body: [[
                                { stack: [cellLabel("CURSO"), cellValue(curso)], margin: [6, 6, 6, 6] },
                                { stack: [cellLabel("NÍVEL / ANO"), cellValue(nivel)], margin: [6, 6, 6, 6] }
                            ]]
                        },
                        layout: {
                            hLineWidth: () => 1, vLineWidth: () => 1,
                            hLineColor: () => "#e2e8f0", vLineColor: () => "#e2e8f0",
                            paddingLeft: () => 0, paddingRight: () => 0, paddingTop: () => 0, paddingBottom: () => 0
                        },
                        margin: [0, 0, 0, 12]
                    },

                    // Dados de Pagamento
                    { text: "DADOS DE PAGAMENTO", style: "sectionTitle" },
                    {
                        table: {
                            widths: ["*"],
                            body: [[{
                                stack: [
                                    { text: "Valor da Taxa de Inscrição:", style: "paymentLabel" },
                                    { text: "5.550,00 Kzs", style: "paymentValue" }
                                ],
                                fillColor: "#fff7ed",
                                margin: [10, 10, 10, 10]
                            }]]
                        },
                        layout: "noBorders",
                        margin: [0, 0, 0, 10]
                    },
                    {
                        columns: [
                            {
                                width: "75%",
                                table: {
                                    widths: ["*"],
                                    body: [[{
                                        stack: [
                                            { text: "COORDENADAS BANCÁRIAS PARA DEPÓSITO/TRANSFERÊNCIA", style: "bankSectionTitle", margin: [0, 0, 0, 8] },
                                            { columns: [{ text: "Nome:", style: "bankLabel", width: 55 }, { text: "José Francisco Conde", style: "bankValue" }], margin: [0, 0, 0, 6] },
                                            { columns: [{ text: "Banco:", style: "bankLabel", width: 55 }, { text: "BAI", style: "bankValue" }], margin: [0, 0, 0, 6] },
                                            { columns: [{ text: "IBAN:", style: "bankLabel", width: 55 }, { text: "0040.0000.9496.1977.1013.8", style: "bankValueHighlight" }], margin: [0, 0, 0, 6] },
                                            { columns: [{ text: "Express:", style: "bankLabel", width: 55 }, { text: "+244 924 605 394", style: "bankValuePhone" }] }
                                        ],
                                        margin: [10, 10, 10, 10]
                                    }]]
                                },
                                layout: { hLineWidth: () => 1, vLineWidth: () => 1, hLineColor: () => "#e2e8f0", vLineColor: () => "#e2e8f0" }
                            },
                            {
                                width: "25%",
                                table: {
                                    widths: ["*"],
                                    body: [[{
                                        stack: [
                                            { image: qrData, width: 65, height: 65, alignment: "center" },
                                            { text: "Aceda ao\nSite Oficial", fontSize: 7.5, color: "#64748b", alignment: "center", bold: true, margin: [0, 4, 0, 0] }
                                        ],
                                        margin: [8, 8, 8, 8]
                                    }]]
                                },
                                layout: { hLineWidth: () => 1, vLineWidth: (i) => (i === 0 ? 0 : 1), hLineColor: () => "#e2e8f0", vLineColor: () => "#e2e8f0" }
                            }
                        ]
                    },

                    { text: "Página 1 de 2", style: "footer", margin: [0, 20, 0, 0] },

                    // Página 2
                    { text: "INSTRUÇÕES DE CONFIRMAÇÃO:", style: "sectionTitle", pageBreak: "before" },
                    {
                        table: {
                            widths: ["*"],
                            body: [[{
                                stack: [
                                    { text: "1. Realize o pagamento por transferência (Multicaixa / Mobile Banking) ou depósito bancário.", style: "instructionText" },
                                    { text: "2. Certifique-se de guardar o comprovativo da operação bancária realizada.", style: "instructionText" },
                                    { text: "3. Submeta ou envie o comprovativo juntamente com este documento para efetivar a sua matrícula.", style: "instructionText", margin: [0, 0, 0, 0] }
                                ],
                                fillColor: "#f8fafc",
                                margin: [12, 12, 12, 12]
                            }]]
                        },
                        layout: { hLineWidth: () => 1, vLineWidth: () => 1, hLineColor: () => "#cbd5e1", vLineColor: () => "#cbd5e1" }
                    },
                    { text: "Página 2 de 2", style: "footer", margin: [0, 20, 0, 0] }
                ]
            };

            const fileName = `Ficha_Inscricao_${firstName}_${lastName}`
                .replace(/[^a-zA-Z0-9_ÀÁÂÃÉÊÍÓÔÕÚÇàáâãéêíóôõúç]/g, "")
                .replace(/\s+/g, "_") + ".pdf";

            pdfMake.createPdf(docDefinition).download(fileName);
        } catch (err) {
            console.error("Erro ao gerar ficha em PDF:", err);
            alert("Não foi possível gerar a ficha em PDF. Tente novamente.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    }

    // Delegação de evento para o botão "Gerar Ficha de Inscrição" (cobre cards clonados dinamicamente)
    document.body.addEventListener("click", async (e) => {
        const pdfBtn = e.target.closest(".generate-pdf-btn");
        if (!pdfBtn) return;

        e.stopPropagation();
        const card = pdfBtn.closest(".student-card");
        const rawData = card?.getAttribute("data-student");
        if (!rawData) return;

        const student = JSON.parse(rawData);
        await gerarFichaInscricaoPDF(student, pdfBtn);
    });
});