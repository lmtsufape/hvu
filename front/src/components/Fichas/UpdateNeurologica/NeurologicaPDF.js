// src/components/Fichas/UpdateNeurologica/NeurologicaPDF.js

import React from 'react';
import { Page, Text, View, Document, StyleSheet, render } from '@react-pdf/renderer';
import moment from 'moment';

// Estilos para o PDF
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
});

const NeurologicaPDF = ({ ficha, animal, tutor, medicoLogado }) => {
    // Desestruturação segura de todos os níveis do formData
    const { 
        nervosCranianos = {}, 
        reacoesPosturais = {}, 
        reflexosSegmentares = {}, 
        avaliacaoSensitiva = {}, 
        diagnosticoAnatomico = {} 
    } = ficha;

    // Função helper para renderizar campos bilaterais (Esquerdo/Direito)
    const renderBilateral = (label, data) => (
        <View style={styles.row}><Text style={styles.label}>{label}:</Text><Text style={styles.value}>Esq: {data?.Esq || 'N/A'}, Dir: {data?.Dir || 'N/A'}</Text></View>
    );

    // Função helper para renderizar campos posturais (MTD/MTE/MPD/MPE)
    const renderPostural = (label, data) => (
        <View style={styles.row}><Text style={styles.label}>{label}:</Text><Text style={styles.value}>MTD: {data?.MTD || 'N/A'}, MTE: {data?.MTE || 'N/A'}, MPD: {data?.MPD || 'N/A'}, MPE: {data?.MPE || 'N/A'}</Text></View>
    );

    return (
        <Document>
            {/* =================== PÁGINA 1 =================== */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Ficha Neurológica</Text>
                
                {/* --- DADOS DO PACIENTE --- */}
                <View style={styles.section}><Text style={styles.sectionTitle}>Dados do Paciente</Text><View style={styles.subsection}><View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{animal.nome || 'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Espécie:</Text><Text style={styles.value}>{animal.raca?.especie?.nome || 'N/A'}</Text></View><View style={styles.rowLast}><Text style={styles.label}>Tutor:</Text><Text style={styles.value}>{tutor.nome || 'N/A'}</Text></View></View></View>
                
                {/* --- PÁGINA 1 DO FORMULÁRIO --- */}
                <Text style={styles.sectionTitle}>Estado Mental, Postura e Locomoção</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Nível de Consciência:</Text><Text style={styles.value}>{ficha.nivelConsciencia || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Resultado Exames:</Text><Text style={styles.value}>{ficha.resultadoExame || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Postura:</Text><Text style={styles.value}>{(ficha.postura || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Descrição Locomoção:</Text><Text style={styles.value}>{(ficha.descricaoLocomocao || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Tipo de Ataxia:</Text><Text style={styles.value}>{(ficha.tipoAtaxia || []).join(', ')}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Andar Compulsivo:</Text><Text style={styles.value}>{ficha.andarCompulsivo || 'N/A'}</Text></View>
                </View>

                {/* --- PÁGINA 2 DO FORMULÁRIO (PARTE 1) --- */}
                <Text style={styles.sectionTitle}>Nervos Cranianos</Text>
                <View style={styles.subsection}>
                    {renderBilateral("Ameaça", nervosCranianos.ameaca)}
                    {renderBilateral("Tamanho/Simetria Pupilar", nervosCranianos.tamanhoSimetria)}
                    {renderBilateral("Reflexo Pupilar", nervosCranianos.reflexoPupilar)}
                    {renderBilateral("Posição Ocular", nervosCranianos.posturaOcular)}
                    {renderBilateral("Reflexo Oculocefálico", nervosCranianos.reflexoOculocefalico)}
                    {renderBilateral("Nistagmo Patológico", nervosCranianos.nistagmoPatologico)}
                    {renderBilateral("Reflexo Palpebral", nervosCranianos.reflexoPalpebral)}
                    {renderBilateral("Sensibilidade Nasal", nervosCranianos.sensibilidadeNasal)}
                    {renderBilateral("Histórico Disfonia/Disfagia", nervosCranianos.historicoDisfoniaDisfagia)}
                    {renderBilateral("Simetria de Língua", nervosCranianos.simetriaLingua)}
                    {renderBilateral("Estrabismo Posicional", nervosCranianos.estrabismoPosicional)}
                    {renderBilateral("Simetria da Face", nervosCranianos.simetriaFace)}
                </View>

                <Text style={styles.sectionTitle}>Reações Posturais</Text>
                <View style={styles.subsection}>
                    {renderPostural("Propriocepção Consciente", reacoesPosturais.propriocepcaoConsciente)}
                    {renderPostural("Saltitar", reacoesPosturais.saltitar)}
                    {renderPostural("Posicionamento Tátil", reacoesPosturais.posicionamentoTatil)}
                    {renderPostural("Hemiestação", reacoesPosturais.hemiestacao)}
                    {renderPostural("Hemilocomoção", reacoesPosturais.hemilocomocao)}
                    {renderPostural("Carrinho de Mão", reacoesPosturais.carrinhoDeMao)}
                    {renderPostural("Correção Tátil", reacoesPosturais.correcaoTatil)}
                </View>

                <Text style={styles.header}>Ficha Neurológica (Continuação)</Text>
                
                {/* --- PÁGINA 2 DO FORMULÁRIO (PARTE 2) --- */}
                <Text style={styles.sectionTitle}>Reflexos Segmentares</Text>
                <text style={{fontSize: 8, fontFamily: 'Helvetica-Oblique', color: '#6c757d', marginBottom: 4}}>(0 – ausente, 1 – diminuído, 2 – normal, 3 – aumentado, 4 - clono)</text>
                <View style={styles.subsection}>
                    {renderPostural("Tono Muscular", reflexosSegmentares.tonoMuscular)}
                    {renderPostural("Patelar", reflexosSegmentares.patelar)}
                    {renderPostural("Flexor", reflexosSegmentares.flexor)}
                    {renderPostural("Perineal", reflexosSegmentares.perineal)}
                    {renderPostural("Reflexo Cutâneo", reflexosSegmentares.reflexoCutaneo)}
                    {renderPostural("Reflexo Torácico Lateral", reflexosSegmentares.reflexoToracicoLateral)}
                    {renderPostural("Tono da Cauda", reflexosSegmentares.tonoDaCalda)}
                    {renderPostural("Micção", reflexosSegmentares.miccao)}
                </View>

                <Text style={styles.sectionTitle}>Avaliação Sensitiva</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Palpação Epaxial:</Text><Text style={styles.value}>{avaliacaoSensitiva.palpacaoEpaxial || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Dor Cervical:</Text><Text style={styles.value}>{avaliacaoSensitiva.dorCervical || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Sensibilidade dos Membros:</Text><Text style={styles.value}>{avaliacaoSensitiva.sensibilidadeDosMembros || 'N/A'}</Text></View>
                </View>

                {/* --- PÁGINA 3 DO FORMULÁRIO --- */}
                <Text style={styles.sectionTitle}>Diagnóstico e Conduta</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Local da Lesão:</Text><Text style={styles.value}>{(diagnosticoAnatomico.localLesao || []).join(', ')}</Text></View>
                    {diagnosticoAnatomico.localLesao?.includes("Medula espinhal") && (
                        <View style={styles.row}><Text style={styles.label}>Subníveis Medula:</Text><Text style={styles.value}>{(diagnosticoAnatomico.subniveisMedula || []).join(', ')}</Text></View>
                    )}
                    <View style={styles.row}><Text style={styles.label}>Nervo Periférico:</Text><Text style={styles.value}>{diagnosticoAnatomico.nervoPeriferico || 'N/A'}</Text></View>
                    <Text style={styles.label}>Suspeita(s) Clínica(s):</Text><Text style={styles.textAreaContent}>{diagnosticoAnatomico.suspeitasClinicas || 'N/A'}</Text>
                    <Text style={{...styles.label, marginTop: 8}}>Exame(s) Complementare(s):</Text><Text style={styles.textAreaContent}>{diagnosticoAnatomico.examesComplementares || 'N/A'}</Text>
                    <Text style={{...styles.label, marginTop: 8}}>Prognóstico:</Text><Text style={styles.textAreaContent}>{diagnosticoAnatomico.prognostico || 'N/A'}</Text>
                    <Text style={{...styles.label, marginTop: 8}}>Diagnóstico:</Text><Text style={styles.textAreaContent}>{diagnosticoAnatomico.diagnostico || 'N/A'}</Text>
                    <Text style={{...styles.label, marginTop: 8}}>Tratamento:</Text><Text style={styles.textAreaContent}>{diagnosticoAnatomico.tratamento || 'N/A'}</Text>
                </View>

                <Text style={styles.sectionTitle}>Responsáveis</Text>
                <View style={styles.subsection}><View style={styles.rowLast}><Text style={styles.label}>Plantonista(s) Discente(s):</Text><Text style={styles.value}>{ficha.plantonistasDiscentes || 'N/A'}</Text></View></View>

                <View fixed>{medicoLogado && <Text style={styles.assinatura}>Assinado eletronicamente por Dr(a). {medicoLogado.nome}, CRMV {medicoLogado.crmv}</Text>}</View>
                
            </Page>
        </Document>
    );
};

export default NeurologicaPDF;
