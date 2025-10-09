import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

// Estilos para o PDF
const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', backgroundColor: '#FFFFFF', padding: 30 },
    header: { fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: '#333', marginBottom: 20, lineHeight: 1.4 },
    section: { marginBottom: 10 },
    sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', backgroundColor: '#EEF8F3', padding: 8, borderRadius: 5, color: '#333', marginBottom: 10 },
    subsection: { padding: 10, border: '1px solid #E0E0E0', borderRadius: 5, marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #F5F5F5' },
    rowLast: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0, paddingBottom: 0, borderBottom: 'none' },
    label: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#404040' },
    value: { fontSize: 11, color: '#39805F', maxWidth: '60%', textAlign: 'right' },
    textAreaContent: { fontSize: 11, lineHeight: 1.5, textAlign: 'justify',color: '#39805F', marginTop: 4 },
    assinatura: { marginTop: 40, paddingTop: 10, borderTop: '1px solid #E9ECEF', textAlign: 'center', fontSize: 10, fontFamily: 'Helvetica-Oblique', color: '#495057' },
    footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 9 },
});

const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    return moment(dateString).format('DD/MM/YYYY');
};

// --- Componente Principal do Documento PDF ---
const FichaDermatologicaRetornoPDF = ({ ficha, animal, tutor, medicoLogado }) => (
  <Document
    title={`Ficha Dermatológica de Retorno - ${animal.nome || 'Animal'}`}
    author={medicoLogado ? `Dr(a). ${medicoLogado.nome}` : 'Clínica Vet'}
  >
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Ficha Clínica Dermatológica de Retorno</Text>

      {/* Dados do Paciente */}
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

      {/* Anamnese */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anamnese</Text>
        <View style={styles.subsection}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.textAreaContent}>{ficha.peso || 'Não preenchido.'}</Text>
        </View>
        

        <View style={styles.subsection}>
            <Text style={styles.label}>Anamnese/Histórico Clínico:</Text>
            <Text style={styles.textAreaContent}>{ficha.anamnese || 'Não preenchido.'}</Text>
        </View>
        <View style={styles.subsection}>
            <Text style={styles.label}>Tratamentos Realizados (Início/Término/Resposta terapêutica):</Text>
            <Text style={styles.textAreaContent}>{ficha.tratamentos || 'Não preenchido.'}</Text>
        </View>
        <View style={styles.subsection}>
            <Text style={styles.label}>Resultados dos Exames Realizados:</Text>
            <Text style={styles.textAreaContent}>{ficha.resultados || 'Não preenchido.'}</Text>
        </View>
      </View>

      {/* Exame Físico */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exame Físico Dermatológico</Text>
        <View style={styles.subsection}>
            <Text style={styles.label}>Locais Afetados:</Text>
            <Text style={styles.textAreaContent}>{ficha.locaisAfetados || 'Não preenchido.'}</Text>
        </View>
        <View style={styles.subsection}>
            <Text style={styles.label}>Conduta Terapêutica:</Text>
            <Text style={styles.textAreaContent}>{ficha.condutaTerapeutica || 'Não preenchido.'}</Text>
        </View>
      </View>

      {/* Responsáveis */}
      <View style={styles.section}>
        <View style={styles.subsection}>
            <View style={styles.rowLast}><Text style={styles.label}>Plantonista(s) Discente(s):</Text><Text style={styles.value}>{ficha.estagiarios || 'N/A'}</Text></View>
        </View>
      </View>

      <View fixed>{medicoLogado && <Text style={styles.assinatura}>Assinado eletronicamente por Dr(a). {medicoLogado.nome}, CRMV {medicoLogado.crmv}</Text>}</View>

    </Page>
  </Document>
);

export default FichaDermatologicaRetornoPDF;
