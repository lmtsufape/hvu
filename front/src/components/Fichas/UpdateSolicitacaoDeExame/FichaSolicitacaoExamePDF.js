import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

// Estilos para o PDF (semelhante ao anterior)
const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', backgroundColor: '#FFFFFF', padding: 30 },
    header: { fontSize: 20, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: '#333', marginBottom: 20 },
    section: { marginBottom: 10 },
    sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', backgroundColor: '#EEF8F3', padding: 8, borderRadius: 5, color: '#333', marginBottom: 10 },
    subsection: { padding: 10, border: '1px solid #E0E0E0', borderRadius: 5, marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #F5F5F5' },
    rowLast: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0, paddingBottom: 0, borderBottom: 'none' },
    label: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#404040' },
    value: { fontSize: 11, color: '#39805F', maxWidth: '60%', textAlign: 'right' },
    assinatura: { marginTop: 40, paddingTop: 10, borderTop: '1px solid #E9ECEF', textAlign: 'center', fontSize: 10, fontFamily: 'Helvetica-Oblique', color: '#495057' },
    footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 9 },
    listItem: { fontSize: 10, marginLeft: 10, marginBottom: 4, },
    noItems: { fontSize: 10, marginLeft: 10, fontStyle: 'italic', color: '#777' }
});

const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    return moment(dateString).format('DD/MM/YYYY');
};

// Componente auxiliar para renderizar as listas de exames
const ExamList = ({ title, items }) => {
    if (!items || items.length === 0) {
        return null; // Não renderiza a seção se não houver itens
    }

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.subsection}>
                {items.map((item, index) => {
                    if (typeof item === 'object' && item.nome === 'Histopatológico') {
                        return (
                            <View key={index}>
                                <Text style={styles.listItem}>• {item.nome}</Text>
                                <Text style={{...styles.listItem, marginLeft: 20}}>- Aspecto: {item.aspecto || 'N/A'}</Text>
                                <Text style={{...styles.listItem, marginLeft: 20}}>- Local: {item.local || 'N/A'}</Text>
                            </View>
                        );
                    }
                    return <Text key={index} style={styles.listItem}>• {item}</Text>;
                })}
            </View>
        </View>
    );
};

// --- Componente Principal do Documento PDF ---
const FichaSolicitacaoExamePDF = ({ ficha, animal, tutor, medicoLogado }) => (
  <Document
    title={`Solicitação de Exame - ${animal.nome || 'Animal'}`}
    author={medicoLogado ? `Dr(a). ${medicoLogado.nome}` : 'Clínica Vet'}
  >
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Solicitação de Exames</Text>

      {/* Dados do Paciente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Paciente</Text>
        <View style={styles.subsection}>
          <View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{animal.nome || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Espécie:</Text><Text style={styles.value}>{animal.raca?.especie?.nome || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Raça:</Text><Text style={styles.value}>{animal.raca?.nome || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Sexo:</Text><Text style={styles.value}>{animal.sexo || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Data de Nascimento:</Text><Text style={styles.value}>{formatDate(animal.dataNascimento)}</Text></View>
          <View style={styles.rowLast}><Text style={styles.label}>Tutor:</Text><Text style={styles.value}>{tutor.nome || 'N/A'}</Text></View>
        </View>
      </View>

      {/* Listas de Exames Solicitados */}
      <ExamList title="Hematologia Diagnóstica" items={ficha.HematologiaDiagnóstica} />
      <ExamList title="Urinálise" items={ficha.Urinálise} />
      <ExamList title="Parasitológico" items={ficha.Parasitologico} />
      <ExamList title="Bioquímica Clínica" items={ficha.BioquímicaClínica} />
      <ExamList title="Citologia/Histopatologia" items={ficha.CitologiaHistopatologia} />
      <ExamList title="Imunológicos" items={ficha.Imunológicos} />
      <ExamList title="Imaginologia" items={ficha.Imaginologia} />
      <ExamList title="Cardiologia" items={ficha.Cardiologia} />

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

export default FichaSolicitacaoExamePDF;