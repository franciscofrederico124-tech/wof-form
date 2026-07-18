import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from "../public/assets/logo.png";
import qr from "../public/assets/qr.png";

const styles = StyleSheet.create({
    // Espaçamento geral da página (respiro de 35px nas laterais para melhor aproveitamento)
    page: {
        paddingTop: 40,
        paddingBottom: 30,
        paddingHorizontal: 35,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#334155',
        flexDirection: 'column'
    },
    // Cabeçalho com espaçamento inferior controlado
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderColor: '#1e3a8a',
        paddingBottom: 10,
        marginBottom: 16,
        alignItems: 'center'
    },
    logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoImg: { width: 50, height: 50 },
    logoTextContainer: { flexDirection: 'column' },
    logoTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
    logoSubtitle: { fontSize: 8, color: '#64748b', marginTop: 1, letterSpacing: 1 },
    docTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'right' },
    docSubtitle: { fontSize: 9, fontWeight: 'bold', color: '#d97706', textAlign: 'right', marginTop: 3, textTransform: 'uppercase' },

    // Caixa de alerta com margem inferior reduzida para não empurrar os dados
    alertBox: { backgroundColor: '#f1f5f9', borderLeftWidth: 4, borderLeftColor: '#1d4ed8', padding: 12, marginBottom: 16 },
    alertTitle: { fontSize: 10, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 3 },
    alertText: { color: '#334155', lineHeight: 1.4, fontSize: 9.5 },

    // Títulos das seções com margens equilibradas
    sectionTitle: { fontSize: 10.5, fontWeight: 'bold', color: '#1e3a8a', borderLeftWidth: 3, borderLeftColor: '#d97706', paddingLeft: 8, marginBottom: 10, marginTop: 14, textTransform: 'uppercase' },

    // Grelha de dados com minHeight reduzido para evitar transbordo de página
    grid: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', minHeight: 38 },
    rowLast: { flexDirection: 'row', minHeight: 38 },
    col: { flex: 1, padding: 6, borderRightWidth: 1, borderRightColor: '#e2e8f0' },
    colLast: { flex: 1, padding: 6 },
    label: { fontSize: 7.5, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 3 },
    value: { fontSize: 10, color: '#0f172a', fontWeight: 'bold' },

    // Bloco de Pagamento e Coordenadas com espaçamentos internos (paddings) otimizados
    paymentContainer: { flexDirection: 'column', gap: 10, marginBottom: 12 },
    paymentBox: { backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#ffedd5', borderRadius: 4, padding: 10 },
    paymentLabel: { fontSize: 8.5, color: '#9a3412', fontWeight: 'bold' },
    paymentValue: { fontSize: 20, fontWeight: 'bold', color: '#ea580c', marginTop: 2 },

    bankAndQrGrid: { flexDirection: 'row', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
    bankDetails: { flex: 3, padding: 10, backgroundColor: '#ffffff' },
    bankSectionTitle: { fontSize: 8.5, fontWeight: 'bold', color: '#ea580c', textTransform: 'uppercase', marginBottom: 8 },
    bankRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'center' },
    bankLabel: { width: 60, fontSize: 9.5, color: '#64748b', fontWeight: 'bold' },
    bankValue: { fontSize: 9.5, color: '#334155', fontWeight: 'bold' },
    bankValueHighlight: { fontSize: 11, color: '#0f172a', fontWeight: 'bold', letterSpacing: 0.5 },
    bankValuePhone: { fontSize: 9.5, color: '#1e3a8a', fontWeight: 'bold' },

    qrContainer: { flex: 1, borderLeftWidth: 1, borderLeftColor: '#e2e8f0', backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', padding: 8 },
    qrImg: { width: 65, height: 65 },
    qrText: { fontSize: 7.5, color: '#64748b', textAlign: 'center', marginTop: 4, fontWeight: 'bold' },

    // Instruções da Página 2
    instructionsBox: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 12, backgroundColor: '#f8fafc', marginTop: 8 },
    instructionText: { fontSize: 9.5, color: '#334155', marginBottom: 8, lineHeight: 1.4 },

    // Rodapé empurrado dinamicamente para o fundo com uma linha subtil de divisão
    footer: { fontSize: 8, color: '#94a3b8', textAlign: 'right', marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 6 }
});

export interface DadosInscricao {
    first_name: string;
    last_name: string;
    gender: string;
    data: string;
    email?: string;
    tel: string;
    course: string;
    academic_level: string;
    level: string;
}

export const FichaInscricaoPdf: React.FC<{ dados: DadosInscricao }> = ({ dados }) => {
    const mapearCurso = (c: string) => ({ slide: 'Desenvolvimento de Slides', web: 'Desenvolvimento Web Front-End', iot: 'Desenvolvimento de sistemas IOT' }[c] || c);
    const mapearNivel = (n: string) => ({ medio: 'Médio', universitario: 'Universitário', outro: 'Outro' }[n] || n);
    const mapearExp = (e: string) => ({ junior: 'Iniciante', pleno: 'Intermediário', senior: 'Avançado' }[e] || e);

    return (
        <Document>
            {/* PÁGINA 1 */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image src={logo} style={styles.logoImg} />
                        <View style={styles.logoTextContainer}>
                            <Text style={styles.logoTitle}>WOF-HUB</Text>
                            <Text style={styles.logoSubtitle}>PLANO DE FÉRIAS</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.docTitle}>Ficha de Inscrição</Text>
                        <Text style={styles.docSubtitle}></Text>
                    </View>
                </View>

                <View style={styles.alertBox}>
                    <Text style={styles.alertTitle}>Confirmação de Vaga Pendente</Text>
                    <Text style={styles.alertText}>
                        O seu formulário foi recebido com sucesso. Para garantir e efetivar o seu lugar na turma, conclua o pagamento da taxa de inscrição descrita abaixo.
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>Dados do Candidato</Text>
                <View style={styles.grid}>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Primeiro Nome</Text>
                            <Text style={styles.value}>{dados.first_name}</Text>
                        </View>
                        <View style={styles.colLast}>
                            <Text style={styles.label}>Último Nome</Text>
                            <Text style={styles.value}>{dados.last_name}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Género</Text>
                            <Text style={styles.value}>{dados.gender}</Text>
                        </View>
                        <View style={styles.colLast}>
                            <Text style={styles.label}>Data de Nascimento</Text>
                            <Text style={styles.value}>{dados.data.split('-').reverse().join('/')}</Text>
                        </View>
                    </View>
                    <View style={styles.rowLast}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Telemóvel (WhatsApp)</Text>
                            <Text style={styles.value}>{dados.tel}</Text>
                        </View>
                        <View style={styles.colLast}>
                            <Text style={styles.label}>E-mail (Opcional)</Text>
                            <Text style={styles.value}>{dados.email || 'Não Fornecido'}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Dados Académicos e Curso</Text>
                <View style={styles.grid}>
                    <View style={styles.row}>
                        <View style={styles.colLast}>
                            <Text style={styles.label}>Curso Pretendido</Text>
                            <Text style={styles.value}>{mapearCurso(dados.course)}</Text>
                        </View>
                    </View>
                    <View style={styles.rowLast}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Nível Académico</Text>
                            <Text style={styles.value}>{mapearNivel(dados.academic_level)}</Text>
                        </View>
                        <View style={styles.colLast}>
                            <Text style={styles.label}>Nível de Experiência</Text>
                            <Text style={styles.value}>{mapearExp(dados.level)}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Dados de Pagamento</Text>
                <View style={styles.paymentContainer}>
                    <View style={styles.paymentBox}>
                        <Text style={styles.paymentLabel}>Valor da Taxa de Inscrição:</Text>
                        <Text style={styles.paymentValue}>5.550,00 Kzs</Text>
                    </View>

                    <View style={styles.bankAndQrGrid}>
                        <View style={styles.bankDetails}>
                            <Text style={styles.bankSectionTitle}>Coordenadas Bancárias para Depósito/Transferência</Text>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>Nome:</Text>
                                <Text style={styles.bankValue}>José Francisco Conde</Text>
                            </View>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>Banco:</Text>
                                <Text style={styles.bankValue}>BAI</Text>
                            </View>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}> BAI:</Text>
                                <Text style={styles.bankValueHighlight}>0040.0000.9496.1977.1013.8</Text>
                            </View>
                            <View style={[styles.bankRow, { marginBottom: 0 }]}>
                                <Text style={styles.bankLabel}>Express:</Text>
                                <Text style={styles.bankValuePhone}>+244 924 605 394</Text>
                            </View>
                        </View>

                        <View style={styles.qrContainer}>
                            <Image src={qr} style={styles.qrImg} />
                            <Text style={styles.qrText}>Aceda ao{"\n"}Site Oficial</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>Página 1 de 2</Text>
            </Page>

            {/* PÁGINA 2 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>Instruções de Confirmação:</Text>
                <View style={styles.instructionsBox}>
                    <Text style={styles.instructionText}>1. Realize o pagamento por transferência (Multicaixa / Mobile Banking) ou depósito bancário.</Text>
                    <Text style={styles.instructionText}>2. Certifique-se de guardar o comprovativo da operação bancária realizada.</Text>
                    <Text style={styles.instructionText}>3. Submeta ou envie o comprovativo juntamente com este documento para efetivar a sua matrícula.</Text>
                </View>

                <Text style={styles.footer}>Página 2 de 2</Text>
            </Page>
        </Document>
    );
};