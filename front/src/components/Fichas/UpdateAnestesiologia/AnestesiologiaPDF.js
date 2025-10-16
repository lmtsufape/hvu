// src/components/Fichas/Anestesiologia/AnestesiologiaPDF.js

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
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
    value: { fontSize: 10, color: '#39805F', maxWidth: '60%', textAlign: 'right' },
    textAreaContent: { fontSize: 10, lineHeight: 1.4, textAlign: 'justify', color: '#39805F', marginTop: 4 },
    assinatura: { marginTop: 30, paddingTop: 10, borderTop: '1px solid #E9ECEF', textAlign: 'center', fontSize: 9, fontFamily: 'Helvetica-Oblique', color: '#495057' },
    footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 8 },
    // Estilos da Tabela
    table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0, borderColor: '#bfbfbf', marginTop: 8 },
    tableRow: { margin: "auto", flexDirection: "row" },
    tableColHeader: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f2f2f2', borderColor: '#bfbfbf' },
    tableCol: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#bfbfbf' },
    tableCellHeader: { margin: 4, fontSize: 9, fontFamily: 'Helvetica-Bold' },
    tableCell: { margin: 4, fontSize: 8 },
    // Tabela de Parâmetros
     paramTable: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: '#bfbfbf', marginTop: 8, fontSize: 7 },
    paramTableRow: { flexDirection: "row" },
    paramTableColHeader: { 
        width: "10%", 
        borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f2f2f2', borderColor: '#bfbfbf', padding: 2, textAlign: 'center' 
    },
    paramTableCol: { 
        width: "10%", 
        borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#bfbfbf', padding: 2, textAlign: 'center' 
    },
});

const AnestesiologiaPDF = ({ ficha, animal, tutor, medicoLogado }) => {
    const pre = ficha.pre || {};
    const pos = ficha.pos || {};
    const parameters = ["T°C", "FC", "FR", "PAS", "SPO2", "Fluido", "Resgate", "Vaso", "Iso"];

    const parametrosArray = pos.parametros || [];

const keyMap = {
    'Temperatura (T°C)': 'T°C',
    'FC(mpb)': 'FC',
    'FR(mrm)': 'FR',
    'PAS(mmHg)': 'PAS',
    'SPO2(%)': 'SPO2',
    'Fluido(mL/kg/h)': 'Fluido',
    'Resgate Alalgésico(mL)': 'Resgate',
    'Vasopressor(mL)': 'Vaso',
    '% Isoflurano': 'Iso'
};

// 3. TRANSFORMAR O ARRAY EM UM OBJETO QUE O CÓDIGO DO PDF ENTENDE
const parametrosObjeto = parametrosArray.reduce((acc, linha) => {
    // Pula linhas que não têm um 'tempo' definido ou estão incompletas
    if (!linha || !linha.tempo) {
        return acc;
    }

    const { tempo, ...valoresAntigos } = linha;
    const valoresNovos = {};

    // Itera sobre o mapa de chaves para renomear as propriedades
    for (const [chaveAntiga, chaveNova] of Object.entries(keyMap)) {
        if (valoresAntigos[chaveAntiga] !== undefined && valoresAntigos[chaveAntiga] !== '') {
            valoresNovos[chaveNova] = valoresAntigos[chaveAntiga];
        }
    }
    
    acc[tempo] = valoresNovos;
    return acc;
}, {});


    return (
        <Document
            title={`Ficha Anestesiológica - ${animal.nome || 'Animal'}`}
            author={medicoLogado ? `Dr(a). ${medicoLogado.nome}` : 'Clínica Vet'}
        >
            {/* =================== PÁGINA 1 =================== */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Ficha Anestesiológica</Text>
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
                
                <Text style={styles.sectionTitle}>Avaliação Pré-Anestésica</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Cirurgião:</Text><Text style={styles.value}>{pre.cirurgiao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Exames Laboratoriais:</Text><Text style={styles.value}>{(pre.exames || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Outros Exames:</Text><Text style={styles.value}>{pre.examesOutros || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Hora:</Text><Text style={styles.value}>{pre.hora || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Estado:</Text><Text style={styles.value}>{pre.estado || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Dor:</Text><Text style={styles.value}>{pre.dor || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Temperatura:</Text><Text style={styles.value}>{pre.temperatura ? `${pre.temperatura}°C` : 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Jejum:</Text><Text style={styles.value}>{pre.jejum || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Frequência Cardíaca (BPM):</Text><Text style={styles.value}>{pre.fc || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Pressão arterial:</Text><Text style={styles.value}>{pre.pa || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Frequência Respiratória (RPM):</Text><Text style={styles.value}>{pre.fr || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Grau de Desidratação:</Text><Text style={styles.value}>{pre.desidratacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Turgor Cutâneo:</Text><Text style={styles.value}>{pre.turgor || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>TPC (s):</Text><Text style={styles.value}>{pre.tpc || 'N/A'}</Text></View>
                </View>
                <View style={styles.subsection}><Text style={styles.label}>Mucosas:</Text>{pre.mucosas?.map(m => <Text key={m} style={styles.value}>• {m}: {pre.localizacaoMucosas?.[m] || 'N/A'}</Text>)}</View>

                <Text style={styles.sectionTitle}>Medicação Pré-Anestésica</Text>
                <View style={styles.subsection}><View style={styles.row}><Text style={styles.label}>Hora:</Text><Text style={styles.value}>{pre.hora2 || 'N/A'}</Text></View><View style={styles.rowLast}><Text style={styles.label}>Sedação:</Text><Text style={styles.value}>{pre.sedacao || 'N/A'}</Text></View></View>
                <View style={styles.subsection}><Text style={styles.label}>Fármacos Pré-Anestésicos:</Text><View style={styles.table}><View style={styles.tableRow}><View style={{...styles.tableColHeader, width: '50%'}}><Text style={styles.tableCellHeader}>Fármaco</Text></View><View style={{...styles.tableColHeader, width: '30%'}}><Text style={styles.tableCellHeader}>Dose/Volume</Text></View><View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Via</Text></View></View>{pre.farmacosPre?.filter(p => p.farmaco).map((p, index) => (<View style={styles.tableRow} key={index}><View style={{...styles.tableCol, width: '50%'}}><Text style={styles.tableCell}>{p.farmaco}</Text></View><View style={{...styles.tableCol, width: '30%'}}><Text style={styles.tableCell}>{p.dose}</Text></View><View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{p.via}</Text></View></View>))}</View></View>
                <View style={styles.subsection}><View style={styles.row}><Text style={styles.label}>AINES:</Text><Text style={styles.value}>{pre.aines || 'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Antibiótico:</Text><Text style={styles.value}>{pre.antibiotico || 'N/A'}</Text></View><View style={styles.rowLast}><Text style={styles.label}>Outros:</Text><Text style={styles.value}>{pre.outros || 'N/A'}</Text></View></View>
            
                <Text style={styles.header}>Ficha Anestesiológica (Pós-Anestesia)</Text>
                <Text style={styles.sectionTitle}>Indução</Text>
                <View style={styles.subsection}><View style={styles.row}><Text style={styles.label}>Hora Indução:</Text><Text style={styles.value}>{pos.inducao?.hora || 'N/A'}</Text></View><View style={styles.rowLast}><Text style={styles.label}>Intubação:</Text><Text style={styles.value}>{pos.inducao?.intubacao || 'N/A'}</Text></View></View>
                <View style={styles.subsection}><Text style={styles.label}>Fármacos de Indução:</Text><View style={styles.table}><View style={styles.tableRow}><View style={{...styles.tableColHeader, width: '50%'}}><Text style={styles.tableCellHeader}>Fármaco</Text></View><View style={{...styles.tableColHeader, width: '30%'}}><Text style={styles.tableCellHeader}>Dose/Volume</Text></View><View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Via</Text></View></View>{pos.farmacos?.filter(p => p.farmaco).map((p, index) => (<View style={styles.tableRow} key={index}><View style={{...styles.tableCol, width: '50%'}}><Text style={styles.tableCell}>{p.farmaco}</Text></View><View style={{...styles.tableCol, width: '30%'}}><Text style={styles.tableCell}>{p.dose}</Text></View><View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{p.via}</Text></View></View>))}</View></View>
                <View style={styles.subsection}><View style={styles.row}><Text style={styles.label}>Nº Sonda Endotraqueal:</Text><Text style={styles.value}>{pos.sondaEndotraqueal || 'N/A'}</Text></View><View style={styles.rowLast}><Text style={styles.label}>Fluidoterapia:</Text><Text style={styles.value}>{pos.fluidoterapia || 'N/A'}</Text></View></View>
                
                <Text style={styles.sectionTitle}>Trans-Anestésicos</Text>
                <View style={styles.subsection}><View style={styles.row}><Text style={styles.label}>Início Procedimento:</Text><Text style={styles.value}>{pos.procedimento?.horaInicio || 'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Fim Procedimento:</Text><Text style={styles.value}>{pos.procedimento?.horaFim || 'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Equipo:</Text><Text style={styles.value}>{pos.procedimento?.equipo || 'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Hora Extubação:</Text><Text style={styles.value}>{pos.extubacao3?.horaExtubacao || 'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Respiração:</Text><Text style={styles.value}>{pos.extubacao3?.respiracao || 'N/A'}</Text></View><View style={styles.rowLast}><Text style={styles.label}>Suporte de Oxigênio:</Text><Text style={styles.value}>{pos.recuperacao?.suporteOxigenio || 'N/A'}</Text></View></View>

                <Text style={styles.sectionTitle}>Fármacos Pós-Anestésicos</Text>
                <View style={styles.subsection}><View style={styles.table}><View style={styles.tableRow}><View style={{...styles.tableColHeader, width: '40%'}}><Text style={styles.tableCellHeader}>Fármaco</Text></View><View style={{...styles.tableColHeader, width: '25%'}}><Text style={styles.tableCellHeader}>Dose/Volume</Text></View><View style={{...styles.tableColHeader, width: '15%'}}><Text style={styles.tableCellHeader}>Via</Text></View><View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Hora</Text></View></View>{pos.farmacoPosAnestesico?.filter(p => p.farmaco).map((p, index) => (<View style={styles.tableRow} key={index}><View style={{...styles.tableCol, width: '40%'}}><Text style={styles.tableCell}>{p.farmaco}</Text></View><View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableCell}>{p.dose}</Text></View><View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableCell}>{p.via}</Text></View><View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{p.hora}</Text></View></View>))}</View></View>
                
                <Text style={styles.sectionTitle}>Observações e Plantonistas</Text>
                <View style={styles.subsection}><Text style={styles.label}>Observações e Complicações:</Text><Text style={styles.textAreaContent}>{pos.observacoes || 'Nenhuma.'}</Text></View>
                <View style={styles.subsection}><Text style={styles.label}>Plantonistas:</Text><Text style={styles.textAreaContent}>{pos.plantonistas || 'Não informado.'}</Text></View>
                
            </Page>

            // =================== PÁGINA 3 - PARÂMETROS (CORRIGIDO) ===================
<Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.header}>Parâmetros e Intervenções Trans-Anestésicos</Text>
            <View style={styles.paramTable}>
                {/* CABEÇALHO DA TABELA (sem alterações) */}
                <View style={styles.paramTableRow} fixed>
                    <View style={{...styles.paramTableColHeader, width: '10%'}}><Text>Tempo</Text></View>
                    <View style={styles.paramTableColHeader}><Text>T°C</Text></View>
                    <View style={styles.paramTableColHeader}><Text>FC(mpb)</Text></View>
                    <View style={styles.paramTableColHeader}><Text>FR(mrm)</Text></View>
                    <View style={styles.paramTableColHeader}><Text>PAS(mmHg)</Text></View>
                    <View style={styles.paramTableColHeader}><Text>SPO2(%)</Text></View>
                    <View style={styles.paramTableColHeader}><Text>Fluido(mL/kg/h)</Text></View>
                    <View style={styles.paramTableColHeader}><Text>Resgate Alalgésico(mL)</Text></View>
                    <View style={styles.paramTableColHeader}><Text>Vasopressor(mL)</Text></View>
                    <View style={styles.paramTableColHeader}><Text>Isoflurano %</Text></View>
                </View>

                {/* CORPO DA TABELA - AGORA USANDO O OBJETO TRANSFORMADO */}
                {Object.entries(parametrosObjeto).map(([tempo, valores]) => {
                    // Filtro para não renderizar linhas que ficaram completamente vazias após a transformação
                    if (!Object.values(valores).some(v => v)) {
                        return null;
                    }

                    return (
                        <View key={tempo} style={styles.paramTableRow} wrap={false}>
                            <View style={{...styles.paramTableCol, width: '10%'}}><Text>{tempo}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores['T°C'] || ''}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores.FC || ''}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores.FR || ''}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores.PAS || ''}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores.SPO2 || ''}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores.Fluido || ''}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores.Resgate || ''}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores.Vaso || ''}</Text></View>
                            <View style={styles.paramTableCol}><Text>{valores.Iso || ''}</Text></View>
                        </View> 
                    );
                })}
            </View>
            <View fixed>{medicoLogado && <Text style={styles.assinatura}>Assinado eletronicamente por Dr(a). {medicoLogado.nome}, CRMV {medicoLogado.crmv}</Text>}</View>
        </Page>
        </Document>
    );
};

export default AnestesiologiaPDF;
