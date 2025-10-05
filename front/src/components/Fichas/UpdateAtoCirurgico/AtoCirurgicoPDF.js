import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

// Estilos para o PDF
const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', backgroundColor: '#FFFFFF', padding: 30 },
    header: { fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: '#333', marginBottom: 20 },
    section: { marginBottom: 10 },
    sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', backgroundColor: '#EEF8F3', padding: 8, borderRadius: 5, color: '#333', marginBottom: 10 },
    subsection: { padding: 10, border: '1px solid #E0E0E0', borderRadius: 5, marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #F5F5F5' },
    rowLast: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0, paddingBottom: 0, borderBottom: 'none' },
    label: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#404040' },
    value: { fontSize: 11, color: '#39805F', maxWidth: '60%', textAlign: 'right' },
    textAreaContent: { fontSize: 11, lineHeight: 1.5, textAlign: 'justify', color: '#39805F', marginTop: 4 },
    assinatura: { marginTop: 40, paddingTop: 10, borderTop: '1px solid #E9ECEF', textAlign: 'center', fontSize: 10, fontFamily: 'Helvetica-Oblique', color: '#495057' },
    footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 9 },
    // Estilos da Tabela de Protocolos
    table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0, borderColor: '#bfbfbf' },
    tableRow: { margin: "auto", flexDirection: "row" },
    tableColHeader: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f2f2f2', borderColor: '#bfbfbf' },
    tableCol: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#bfbfbf' },
    tableCellHeader: { margin: 5, fontSize: 10, fontWeight: 'bold' },
    tableCell: { margin: 5, fontSize: 9 }
});

const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    return moment(dateString).format('DD/MM/YYYY');
};

// --- Componente Principal do Documento PDF ---
const AtoCirurgicoPDF = ({ ficha, animal, tutor, medicoLogado }) => (
  <Document
    title={`Ato Cirúrgico - ${animal.nome || 'Animal'}`}
    author={medicoLogado ? `Dr(a). ${medicoLogado.nome}` : 'Clínica Vet'}
  >
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Ficha de Ato Cirúrgico</Text>

      {/* Dados do Paciente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Paciente</Text>
        <View style={styles.subsection}>
          <View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{animal.nome || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Espécie:</Text><Text style={styles.value}>{animal.raca?.especie?.nome || 'N/A'}</Text></View>
          <View style={styles.rowLast}><Text style={styles.label}>Tutor:</Text><Text style={styles.value}>{tutor.nome || 'N/A'}</Text></View>
        </View>
      </View>

      {/* Descrição do Ato Cirúrgico */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrição do Ato Cirúrgico</Text>
        <View style={styles.subsection}>
            <View style={styles.row}><Text style={styles.label}>Nome da Cirurgia:</Text><Text style={styles.value}>{ficha.nomeDaCirurgia || 'N/A'}</Text></View>
            <View style={styles.rowLast}><Text style={styles.label}>Data:</Text><Text style={styles.value}>{formatDate(ficha.data)}</Text></View>
        </View>
        <View style={styles.subsection}>
            <Text style={styles.label}>Descrição Detalhada:</Text>
            <Text style={styles.textAreaContent}>{ficha.descricaoAtoCirurgico || 'Não preenchido.'}</Text>
        </View>
      </View>

      {/* Prognóstico e Protocolos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prognóstico e Protocolos</Text>
        <View style={styles.subsection}>
            <View style={styles.rowLast}><Text style={styles.label}>Prognóstico:</Text><Text style={styles.value}>{ficha.prognostico || 'N/A'}</Text></View>
        </View>
        <View style={styles.subsection}>
            <Text style={styles.label}>Protocolos Terapêuticos a Serem Instituídos:</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Medicação</Text></View>
                    <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Dose</Text></View>
                    <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Frequência</Text></View>
                    <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Período</Text></View>
                </View>
                {ficha.protocolos?.map((p, index) => (
                    <View style={styles.tableRow} key={index}>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{p.medicacao}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{p.dose}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{p.frequencia}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{p.periodo}</Text></View>
                    </View>
                ))}
            </View>
        </View>
        <View style={styles.subsection}>
            <Text style={styles.label}>Retorno para Reavaliações:</Text>
            <Text style={styles.textAreaContent}>{ficha.reavaliacao || 'Não preenchido.'}</Text>
        </View>
      </View>

      {/* Responsáveis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipe Responsável</Text>
        <View style={styles.subsection}>
            <View style={styles.rowLast}><Text style={styles.label}>Plantonista(s) Discente(s):</Text><Text style={styles.value}>{ficha.equipeResponsavel || 'N/A'}</Text></View>
        </View>
      </View>

      {/* Assinatura Eletrônica */}
      {medicoLogado && (
        <Text style={styles.assinatura}>
          Assinado eletronicamente por Dr(a). {medicoLogado.nome}, CRMV {medicoLogado.crmv}
        </Text>
      )}

      {/* Rodapé */}
      <Text style={styles.footer} fixed>
        Documento gerado em: {moment().format('DD/MM/YYYY HH:mm:ss')}
      </Text>
    </Page>
  </Document>
);

export default AtoCirurgicoPDF;
