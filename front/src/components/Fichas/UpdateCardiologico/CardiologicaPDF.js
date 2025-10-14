import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', backgroundColor: '#FFFFFF', padding: 30, fontSize: 9 },
    header: { fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: '#333', marginBottom: 15 },
    section: { marginBottom: 8, breakInside: 'avoid' },
    sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', backgroundColor: '#EEF8F3', padding: 6, borderRadius: 4, color: '#333', marginBottom: 8 },
    subsection: { padding: 8, border: '1px solid #E0E0E0', borderRadius: 4, marginBottom: 8 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid #F5F5F5' },
    rowLast: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0, paddingBottom: 0, borderBottom: 'none' },
    label: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#404040' },
    value: { fontSize: 10, color: '#39805F', maxWidth: '70%', textAlign: 'right' },
    textAreaContent: { fontSize: 10, lineHeight: 1.4, textAlign: 'justify', color: '#39805F', marginTop: 4 },
    assinatura: { marginTop: 30, paddingTop: 10, borderTop: '1px solid #E9ECEF', textAlign: 'center', fontSize: 9, fontFamily: 'Helvetica-Oblique', color: '#495057' },
    footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 8 },
    table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0, borderColor: '#bfbfbf', marginTop: 8 },
    tableRow: { margin: "auto", flexDirection: "row" },
    tableColHeader: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f2f2f2', borderColor: '#bfbfbf' },
    tableCol: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#bfbfbf' },
    tableCellHeader: { margin: 4, fontSize: 9, fontFamily: 'Helvetica-Bold' },
    tableCell: { margin: 4, fontSize: 8 }
});

const CardiologicaPDF = ({ ficha, animal, tutor, medicoLogado }) => {
    const { ExameFisico = {}, diagnostico = {}, medicacoes = [] } = ficha;

    const vacinas = [
        { key: 'antiRabica', label: 'Anti-Rábica' }, { key: 'giardia', label: 'Giardia' },
        { key: 'leishmaniose', label: 'Leishmaniose' }, { key: 'tosseDosCanis', label: 'Tosse dos Canis' },
        { key: 'polivalenteCanina', label: 'Polivalente Canina' }, { key: 'polivalenteFelina', label: 'Polivalente Felina' },
        { key: 'outros', label: 'Outros' },
    ];

    const linfonodosLabels = {
        mandibularD: "Mandibular D", mandibularE: "Mandibular E", cervicalSuperiorD: "Cervical sup. D",
        cervicalSuperiorE: "Cervical sup. E", axilarD: "Axilar D", axilarE: "Axilar E",
        inguinalD: "Inguinal D", inguinalE: "Inguinal E", popliteoD: "Poplíteo D", popliteoE: "Poplíteo E"
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Ficha de Atendimento Cardiológico</Text>
                 <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dados do Paciente</Text>
                        <View style={styles.subsection}>
                          <View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{animal.nome || 'N/A'}</Text></View>
                          <View style={styles.row}><Text style={styles.label}>Espécie:</Text><Text style={styles.value}>{animal.raca?.especie?.nome || 'N/A'}</Text></View>
                          <View style={styles.row}><Text style={styles.label}>Raça:</Text><Text style={styles.value}>{animal.raca?.nome || 'N/A'}</Text></View>
                          <View style={styles.row}><Text style={styles.label}>Sexo:</Text><Text style={styles.value}>{animal.sexo || 'N/A'}</Text></View>
                          <View style={styles.row}><Text style={styles.label}>Data de Nascimento:</Text><Text style={styles.value}>{animal.dataNascimento ? moment(animal.dataNascimento).format('DD/MM/YYYY') : 'N/A'}</Text></View>
                          <View style={styles.row}><Text style={styles.label}>Porte:</Text><Text style={styles.value}>{animal.raca?.porte || 'N/A'}</Text></View>
                          <View style={styles.row}><Text style={styles.label}>Alergias:</Text><Text style={styles.value}>{animal.alergias || 'N/A'}</Text></View>
                          <View style={styles.row}><Text style={styles.label}>Número da Ficha:</Text><Text style={styles.value}>{animal.numeroFicha || 'N/A'}</Text></View>
                          <View style={styles.rowLast}><Text style={styles.label}>Tutor:</Text><Text style={styles.value}>{tutor.nome || 'N/A'}</Text></View>
                        </View>
                      </View>
                      
                <Text style={styles.sectionTitle}>Anamnese</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Peso:</Text><Text style={styles.value}>{ficha.peso ? `${ficha.peso} kg` : 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Alimentação:</Text><Text style={styles.value}>{ficha.alimentacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Estilo de Vida:</Text><Text style={styles.value}>{ficha.estiloVida || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Contactantes/Ambiente:</Text><Text style={styles.value}>{ficha.contactantes || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Sinais Clínicos:</Text><Text style={styles.value}>{(ficha.sinaisClinicos || []).join(', ')}</Text></View>
                    <Text style={styles.label}>Antecedentes/Histórico:</Text><Text style={{...styles.value, textAlign: 'left'}}>{ficha.antecedentesHistorico || 'N/A'}</Text>
                </View>
                <Text style={styles.sectionTitle}>Vacinação</Text>
                <View style={styles.subsection}>
                    {vacinas.filter(v => ficha.opc?.[v.key]).map(v => (
                        <View key={v.key} style={styles.row}><Text style={styles.label}>{v.label}:</Text><Text style={styles.value}>{ficha.vacinacao?.[v.key] || 'Data não informada'}</Text></View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Exame Físico</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Postura:</Text><Text style={styles.value}>{ExameFisico.postura || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Nível de Consciência:</Text><Text style={styles.value}>{ExameFisico.nivelConsciencia || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Score Corporal:</Text><Text style={styles.value}>{ExameFisico.score || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Temperatura:</Text><Text style={styles.value}>{ExameFisico.temperatura ? `${ExameFisico.temperatura}°C` : 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Grau de Desidratação:</Text><Text style={styles.value}>{ExameFisico.hidratacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Turgor Cutâneo:</Text><Text style={styles.value}>{ExameFisico.turgorCutaneo || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>TPC:</Text><Text style={styles.value}>{ExameFisico.tpc || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Frequência cardíaca (BPM)</Text><Text style={styles.value}>{ExameFisico.freqCardiaca || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Frequência Respiratória (RPM)</Text><Text style={styles.value}>{ExameFisico.freqRespiratoria || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>ACP:</Text><Text style={styles.value}>{ExameFisico.acp || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Pulso Arterial:</Text><Text style={styles.value}>{ExameFisico.pulsoArterial || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Narinas/Traqueia/Tireóide:</Text><Text style={styles.value}>{ExameFisico.narinasEOutros || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Abdômen:</Text><Text style={styles.value}>{ExameFisico.abdomem || 'N/A'}</Text></View>
                </View>
                <View style={styles.subsection}><Text style={styles.label}>Mucosas:</Text>{Object.keys(ficha.option || {}).filter(key => ficha.option[key]).map(key => <Text key={key} style={{...styles.value, textAlign: 'left', marginTop: 4}}>• {key.replace(/([A-Z])/g, ' $1').trim()}: {ficha.mucosas?.[key] || 'Não especificado'}</Text>)}</View>
                <View style={styles.subsection}><Text style={styles.label}>Linfonodos:</Text>{Object.keys(ficha.linfonodos || {}).map(key => <Text key={key} style={{...styles.value, textAlign: 'left', marginTop: 4}}>• {linfonodosLabels[key] || key}: {(ficha.linfonodos[key] || []).join(', ')}</Text>)}</View>
                <Text style={styles.sectionTitle}>Exames Complementares</Text>
                <View style={styles.subsection}><Text style={styles.label}>Exames Anteriores:</Text><Text style={styles.textAreaContent}>{ficha.ExamesComplementares?.examesAnteriores || 'N/A'}</Text></View>
                
                <Text style={styles.sectionTitle}>Diagnóstico e tratamento</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Diagnóstico(s):</Text><Text style={styles.value}>{diagnostico.diagnostico || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Observações:</Text><Text style={styles.value}>{diagnostico.observacoes || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Prognóstico:</Text><Text style={styles.value}>{diagnostico.prognostico || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Peso para Cálculo:</Text><Text style={styles.value}>{diagnostico.peso ? `${diagnostico.peso} kg` : 'N/A'}</Text></View>
                </View>

                <Text style={styles.sectionTitle}>Tratamento</Text>
                <View style={styles.subsection}>
                    <View style={styles.table}>
                        <View style={styles.tableRow} fixed>
                            <View style={{...styles.tableColHeader, width: '40%'}}><Text style={styles.tableCellHeader}>Medicação</Text></View>
                            <View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Dose</Text></View>
                            <View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Frequência</Text></View>
                            <View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Período</Text></View>
                        </View>
                        {medicacoes.filter(m => m.medicacao).map((m, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={{...styles.tableCol, width: '40%'}}><Text style={styles.tableCell}>{m.medicacao}</Text></View>
                                <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{m.dose}</Text></View>
                                <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{m.frequencia}</Text></View>
                                <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{m.periodo}</Text></View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.subsection}><View style={styles.rowLast}><Text style={styles.label}>Plantonista(s) Discente(s):</Text><Text style={styles.value}>{ficha.plantonistas || 'N/A'}</Text></View></View>

                <View fixed>{medicoLogado && <Text style={styles.assinatura}>Assinado eletronicamente por Dr(a). {medicoLogado.nome}, CRMV {medicoLogado.crmv}</Text>}</View>
            </Page>
        </Document>
    );
};

export default CardiologicaPDF;
