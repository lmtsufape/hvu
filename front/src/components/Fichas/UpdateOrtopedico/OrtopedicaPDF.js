// src/components/Fichas/UpdateOrtopedico/OrtopedicaPDF.js

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
    palpacaoTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginTop: 8, marginBottom: 4 },
    palpacaoItem: { fontSize: 9, color: '#39805F', marginLeft: 10 },
    assinatura: { marginTop: 30, paddingTop: 10, borderTop: '1px solid #E9ECEF', textAlign: 'center', fontSize: 9, fontFamily: 'Helvetica-Oblique', color: '#495057' },
    footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 8 },
});

const OrtopedicaPDF = ({ ficha, animal, tutor, medicoLogado }) => {

    const renderPalpacao = (titulo, grupoData) => {
        if (!grupoData || Object.values(grupoData).every(item => !item.Direito && !item.Esquerdo)) {
            return null;
        }
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={styles.palpacaoTitle}>{titulo}</Text>
                {Object.keys(grupoData).map(key => {
                    const item = grupoData[key];
                    if (item && (item.Direito || item.Esquerdo)) {
                        return (
                            <Text key={key} style={styles.palpacaoItem}>
                                • {key.replace(/([A-Z])/g, ' $1').trim()}: 
                                {item.Direito ? ` (D: ${item.Direito})` : ''}
                                {item.Esquerdo ? ` (E: ${item.Esquerdo})` : ''}
                            </Text>
                        );
                    }
                    return null;
                })}
            </View>
        );
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Ficha de Atendimento Ortopédico</Text>
                <View style={styles.section}><Text style={styles.sectionTitle}>Dados do Paciente</Text><View style={styles.subsection}><View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{animal.nome || 'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Espécie:</Text><Text style={styles.value}>{animal.raca?.especie?.nome || 'N/A'}</Text></View><View style={styles.rowLast}><Text style={styles.label}>Tutor:</Text><Text style={styles.value}>{tutor.nome || 'N/A'}</Text></View></View></View>

                <Text style={styles.sectionTitle}>Histórico</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Queixa Principal:</Text><Text style={styles.value}>{ficha.queixaPrincipal || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Ocorrência de Trauma:</Text><Text style={styles.value}>{ficha.ocorrenciaTrauma || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Duração do Problema:</Text><Text style={styles.value}>{ficha.duracaoProblema || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Evolução do Quadro:</Text><Text style={styles.value}>{ficha.evolucaoQuadro || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Ocorrência de Claudicação:</Text><Text style={styles.value}>{ficha.ocorrenciaClaudicacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Tolerância ao Exercício:</Text><Text style={styles.value}>{ficha.toleranciaExercicio || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Indícios de Dor:</Text><Text style={styles.value}>{ficha.indiciosDor || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Acidentes/Doenças Anteriores:</Text><Text style={styles.value}>{ficha.acidentesAnteriores || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Tratamentos:</Text><Text style={styles.value}>{ficha.Tratamentos || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Alimentação:</Text><Text style={styles.value}>{ficha.Alimentacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Vitaminas/Minerais:</Text><Text style={styles.value}>{ficha.vitaminas || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Ambiente:</Text><Text style={styles.value}>{ficha.ambiente || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Obs:</Text><Text style={styles.value}>{ficha.observacao || 'N/A'}</Text></View>
                </View>

                <Text style={styles.sectionTitle}>Inspeção Visual e Marcha</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Condição Corporal:</Text><Text style={styles.value}>{ficha.condicaoCorporal || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Comportamento:</Text><Text style={styles.value}>{ficha.comportamento || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Postura:</Text><Text style={styles.value}>{ficha.postura || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Capacidade de Sustentar Peso:</Text><Text style={styles.value}>{ficha.capacidadePeso || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Tumefação:</Text><Text style={styles.value}>{ficha.tumefacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Assimetrias/Desvios:</Text><Text style={styles.value}>{ficha.assimetriaDesvio || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Atrofia Muscular:</Text><Text style={styles.value}>{ficha.atrofiaMuscular || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Escoriações/Fístulas:</Text><Text style={styles.value}>{ficha.escoriacoesFistulas || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Marcha:</Text><Text style={styles.value}>{ficha.marcha || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Características da Marcha:</Text><Text style={styles.value}>{ficha.caracteristicas || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Claudicação:</Text><Text style={styles.value}>{ficha.claudicacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Fase de Apoio:</Text><Text style={styles.value}>{ficha.faseApoio || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Fase de Elevação:</Text><Text style={styles.value}>{ficha.faseElevacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Ângulo das Articulações:</Text><Text style={styles.value}>{ficha.anguloArticulacoes || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Obs Marcha:</Text><Text style={styles.value}>{ficha.segundaObservacao || 'N/A'}</Text></View>
                </View>
                
                <Text style={styles.sectionTitle}>Palpação Membro Torácico</Text>
                <View style={styles.subsection}>
                    {renderPalpacao("Dígitos/Metacarpos", ficha.digitosMetacarpos)}
                    {renderPalpacao("Carpo", ficha.carpo)}
                    {renderPalpacao("Rádio/Ulna", ficha.radioUlna)}
                    {renderPalpacao("Músculos e Tendões", ficha.musculosTendoes)}
                    {renderPalpacao("Úmero", ficha.umero)}
                    {renderPalpacao("Ombro", ficha.ombro)}
                    {renderPalpacao("Área Axilar/Subescapular", ficha.axilarSubescapular)}
                    {renderPalpacao("Escápula", ficha.escapula)}
                    {renderPalpacao("Articulação Cubital", ficha.articulacaoCubital)}
                </View>

                <Text style={styles.sectionTitle}>Palpação Membro Pélvico</Text>
                <View style={styles.subsection}>
                    {renderPalpacao("Dígitos/Metatarsos", ficha.digitosMetatarsos)}
                    {renderPalpacao("Tarso", ficha.tarso)}
                    {renderPalpacao("Tíbia/Fíbula", ficha.tibiaFibula)}
                    {renderPalpacao("Articulação do Joelho", ficha.articulacaoJoelho)}
                    {renderPalpacao("Fêmur", ficha.femur)}
                    {renderPalpacao("Articulação Coxal", ficha.articulacaoCoxal)}
                    {renderPalpacao("Articulação Sacroilíaca", ficha.articulacaoSacroiliaca)}
                    {renderPalpacao("Pelve", ficha.pelve)}
                </View>

                <Text style={styles.sectionTitle}>Cabeça e Esqueleto Axial</Text>
                <View style={styles.subsection}>
                    {renderPalpacao("Cabeça e Esqueleto Axial", ficha.cabecaEsqueletoAxial)}
                </View>
            

                <Text style={styles.sectionTitle}>Exames e Diagnóstico</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Achados Exames de Imagem:</Text><Text style={styles.value}>{ficha.achadosImagem || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Outros Exames:</Text><Text style={styles.value}>{ficha.outrosExames || 'N/A'}</Text></View>
                </View>
                <View style={styles.subsection}>
                    <Text style={styles.label}>Diagnóstico:</Text>
                    <Text style={styles.textAreaContent}>{ficha.diagnostico || 'N/A'}</Text>
                </View>
                <View style={styles.subsection}>
                    <Text style={styles.label}>Tratamento:</Text>
                    <Text style={styles.textAreaContent}>{ficha.tratamento || 'N/A'}</Text>
                </View>

                <Text style={styles.sectionTitle}>Responsáveis</Text>
                <View style={styles.subsection}>
                    <View style={styles.rowLast}><Text style={styles.label}>Plantonista(s) Discente(s):</Text><Text style={styles.value}>{ficha.plantonistas || 'N/A'}</Text></View>
                </View>

                 <View fixed>{medicoLogado && <Text style={styles.assinatura}>Assinado eletronicamente por Dr(a). {medicoLogado.nome}, CRMV {medicoLogado.crmv}</Text>}</View>
            </Page>
        </Document>
    );
};

export default OrtopedicaPDF;
