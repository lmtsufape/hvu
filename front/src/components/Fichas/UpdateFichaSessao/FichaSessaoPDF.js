// src/components/Fichas/FichaSessaoPDF.js

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';

// Estilos para o PDF usando a fonte padrão Helvetica
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        backgroundColor: '#FFFFFF',
        padding: 30,
    },
    header: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        backgroundColor: '#EEF8F3',
        padding: 8,
        borderRadius: 5,
        color: '#333',
        marginBottom: 10,
    },
    subsection: {
        padding: 10,
        border: '1px solid #E0E0E0',
        borderRadius: 5,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottom: '1px solid #F5F5F5',
    },
    rowLast: { // Para o último item de uma lista não ter borda
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
        paddingBottom: 0,
        borderBottom: 'none',
    },
    label: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#404040',
    },
    value: {
        fontSize: 11,
        color: '#39805F',
        maxWidth: '60%',
        textAlign: 'right',
    },
    anotacaoText: {
        fontSize: 11,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    assinatura: {
        marginTop: 40,
        paddingTop: 10,
        borderTop: '1px solid #E9ECEF',
        textAlign: 'center',
        fontSize: 10,
        fontFamily: 'Helvetica-Oblique',
        color: '#495057',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: 'grey',
        fontSize: 9,
    },
    logo: {
        width: 100,
        height: 'auto',
        alignSelf: 'center',
        marginBottom: 15,
    }
});

// Função para formatar data
const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    return moment(dateString).format('DD/MM/YYYY');
};

// --- Componente do Documento PDF ---
const FichaSessaoPDF = ({ ficha, animal, tutor, medicoLogado }) => (
  <Document
    title={`Ficha de Sessão - ${animal.nome || 'Animal'}`}
    author={medicoLogado ? `Dr(a). ${medicoLogado.nome}` : 'Clínica Vet'}
  >
    <Page size="A4" style={styles.page}>
      {/* Se você tiver um logo na pasta /public/images, pode usá-lo */}
      {/* <Image src="/images/hvu_black_logo.svg" style={styles.logo} /> */}
      
      <Text style={styles.header}>Ficha de Sessão Clínica</Text>

      {/* Dados da Sessão */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados da Sessão</Text>
        <View style={styles.subsection}>
          <View style={styles.row}>
            <Text style={styles.label}>Sessão nº:</Text>
            <Text style={styles.value}>{ficha.numeroSessao || 'N/A'}</Text>
          </View>
          <View style={styles.rowLast}>
            <Text style={styles.label}>Data da Sessão:</Text>
            <Text style={styles.value}>{formatDate(ficha.sessaoData)}</Text>
          </View>
        </View>
      </View>

      {/* Dados do Paciente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Paciente</Text>
        <View style={styles.subsection}>
          <View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{animal.nome || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Espécie:</Text><Text style={styles.value}>{animal.raca?.especie?.nome || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Raça:</Text><Text style={styles.value}>{animal.raca?.nome || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Sexo:</Text><Text style={styles.value}>{animal.sexo || 'N/A'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Data de Nascimento:</Text><Text style={styles.value}>{formatDate(animal.dataNascimento)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Peso:</Text><Text style={styles.value}>{animal.peso ? `${animal.peso} kg` : 'N/A'}</Text></View>
          <View style={styles.rowLast}><Text style={styles.label}>Tutor:</Text><Text style={styles.value}>{tutor.nome || 'N/A'}</Text></View>
        </View>
      </View>

      {/* Anotações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anotações da Sessão</Text>
        <View style={styles.subsection}>
          <Text style={styles.anotacaoText}>{ficha.anotacao || 'Nenhuma anotação registrada.'}</Text>
        </View>
      </View>

      {/* Responsáveis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Responsáveis</Text>
        <View style={styles.subsection}>
          <View style={styles.row}><Text style={styles.label}>Estagiário:</Text><Text style={styles.value}>{ficha.estagiario || 'N/A'}</Text></View>
          <View style={styles.rowLast}><Text style={styles.label}>RG do Estagiário:</Text><Text style={styles.value}>{ficha.rg || 'N/A'}</Text></View>
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

export default FichaSessaoPDF;
