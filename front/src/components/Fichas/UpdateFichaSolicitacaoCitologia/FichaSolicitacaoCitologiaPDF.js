import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
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
    textAreaContent: { fontSize: 11, lineHeight: 1.5, textAlign: 'justify' },
    assinatura: { marginTop: 40, paddingTop: 10, borderTop: '1px solid #E9ECEF', textAlign: 'center', fontSize: 10, fontFamily: 'Helvetica-Oblique', color: '#495057' },
    footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 9 },
    listItem: { fontSize: 10, marginLeft: 10, marginBottom: 4 },
    desenhoLesao: { width: '100%', maxWidth: 500, height: 'auto', alignSelf: 'center', border: '1px solid #ccc', marginTop: 10 }
});

const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    return moment(dateString).format('DD/MM/YYYY');
};

// --- Componente Principal do Documento PDF ---
const FichaSolicitacaoCitologiaPDF = ({ ficha, animal, tutor, medicoLogado }) => (
  <Document
    title={`Solicitação de Citologia - ${animal.nome || 'Animal'}`}
    author={medicoLogado ? `Dr(a). ${medicoLogado.nome}` : 'Clínica Vet'}
  >
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Ficha de Solicitação de Citologia</Text>

       <View style={styles.section}>
    <Text style={styles.sectionTitle}>Dados do Paciente</Text>
    <View style={styles.subsection}>
        <View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{animal.nome || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Espécie:</Text><Text style={styles.value}>{animal.raca?.especie?.nome || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Raça:</Text><Text style={styles.value}>{animal.raca?.nome || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Porte:</Text><Text style={styles.value}>{animal.raca?.porte || 'Não definido'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Alergias:</Text><Text style={styles.value}>{animal.alergias || 'Não definidas'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Número da Ficha:</Text><Text style={styles.value}>{animal.numeroFicha || 'Não definido'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Sexo:</Text><Text style={styles.value}>{animal.sexo || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Data de Nascimento:</Text><Text style={styles.value}>{formatDate(animal.dataNascimento)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Peso:</Text><Text style={styles.value}>{animal.peso ? `${animal.peso} kg` : 'N/A'}</Text></View>
        <View style={styles.rowLast}><Text style={styles.label}>Tutor:</Text><Text style={styles.value}>{tutor.nome || 'N/A'}</Text></View>
    </View>
</View>

      {/* Dados da Ficha */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Coleta</Text>
        <View style={styles.subsection}>
            <View style={styles.row}><Text style={styles.label}>Data da Colheita:</Text><Text style={styles.value}>{formatDate(ficha.dataColheita)}</Text></View>
            <View style={styles.rowLast}><Text style={styles.label}>Histórico/Exame Físico:</Text><Text style={styles.value}>{ficha.historicoExameFisico || 'N/A'}</Text></View>
        </View>
      </View>

      {/* Lesão */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localização e Desenho da Lesão</Text>
        <View style={styles.subsection}>
            <Text style={styles.label}>Localização Descrita:</Text>
            <Text style={styles.textAreaContent}>{ficha.localizacaoLesao || 'Não descrito.'}</Text>
            {ficha.imagemLesao?.imagem && (
                <Image src={ficha.imagemLesao.imagem} style={styles.desenhoLesao} />
            )}
        </View>
      </View>

      {/* Características da Lesão */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Características da Lesão / Material</Text>
        <View style={styles.subsection}>
            {ficha.caracteristicasLesao?.selecionadas?.map((item, index) => <Text key={index} style={styles.listItem}>• {item}</Text>)}
            <View style={styles.row}><Text style={styles.label}>Descrição:</Text><Text style={styles.value}>{ficha.caracteristicasLesao?.descricao || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Cor:</Text><Text style={styles.value}>{ficha.caracteristicasLesao?.cor || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Consistência:</Text><Text style={styles.value}>{ficha.caracteristicasLesao?.consistencia || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Bordas:</Text><Text style={styles.value}>{ficha.caracteristicasLesao?.bordas || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Ulceração:</Text><Text style={styles.value}>{ficha.caracteristicasLesao?.ulceracao || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Dor à Palpação:</Text><Text style={styles.value}>{ficha.caracteristicasLesao?.dorPalpacao || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Temperatura Local:</Text><Text style={styles.value}>{ficha.caracteristicasLesao?.temperaturaLocal || 'N/A'}</Text></View>
            <View style={styles.rowLast}><Text style={styles.label}>Relação com Tecidos Vizinhos:</Text><Text style={styles.value}>{ficha.caracteristicasLesao?.relacaoTecidosVizinhos || 'N/A'}</Text></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Citologia</Text>
        <View style={styles.subsection}>
            <View style={styles.row}><Text style={styles.label}>Descrição:</Text><Text style={styles.value}>{ficha.citologia?.descricao || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Método:</Text><Text style={styles.value}>{ficha.citologia?.metodo || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Número de Lâminas:</Text><Text style={styles.value}>{ficha.citologia?.numeroLaminas || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Resultado:</Text><Text style={styles.value}>{ficha.citologia?.resultado || 'N/A'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Conclusão:</Text><Text style={styles.value}>{ficha.citologia?.conclusao || 'N/A'}</Text></View>
            <View style={styles.rowLast}><Text style={styles.label}>Comentários:</Text><Text style={styles.value}>{ficha.citologia?.comentarios || 'N/A'}</Text></View>
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

export default FichaSolicitacaoCitologiaPDF;
