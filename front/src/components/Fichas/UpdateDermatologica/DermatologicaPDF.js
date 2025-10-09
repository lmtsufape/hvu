import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
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
    tableCell: { margin: 4, fontSize: 8 },
    desenhoLesao: { width: '80%', alignSelf: 'center', marginTop: 10, border: '1px solid #ccc' }
});

const DermatologicaPDF = ({ ficha, animal, tutor, medicoLogado }) => {
    const { ExameFisico = {}, diagnostico = {}, tratamentoDermatologico = [] } = ficha;

    const linfonodosLabels = {
        mandibularD: "Mandibular D", mandibularE: "Mandibular E", cervicalSuperiorD: "Cervical sup. D",
        cervicalSuperiorE: "Cervical sup. E", axilarD: "Axilar D", axilarE: "Axilar E",
        inguinalD: "Inguinal D", inguinalE: "Inguinal E", popliteoD: "Poplíteo D", popliteoE: "Poplíteo E"
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Ficha Dermatológica</Text>
                <View style={styles.section}><Text style={styles.sectionTitle}>Dados do Paciente</Text><View style={styles.subsection}><View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{animal.nome || 'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Espécie:</Text><Text style={styles.value}>{animal.raca?.especie?.nome || 'N/A'}</Text></View><View style={styles.rowLast}><Text style={styles.label}>Tutor:</Text><Text style={styles.value}>{tutor.nome || 'N/A'}</Text></View></View></View>
                
                <Text style={styles.sectionTitle}>Anamnese</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Peso:</Text><Text style={styles.value}>{ficha.peso ? `${ficha.peso} kg` : 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Ambiente:</Text><Text style={styles.value}>{ficha.ambiente || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Estilo de Vida:</Text><Text style={styles.value}>{ficha.estiloVida || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Acesso à Rua:</Text><Text style={styles.value}>{ficha.acessoRua || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Alimentação:</Text><Text style={styles.value}>{ficha.alimentacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Banhos:</Text><Text style={styles.value}>{ficha.banhos || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Frequência de Banhos:</Text><Text style={styles.value}>{ficha.frequenciaBanhos || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Produtos Utilizados:</Text><Text style={styles.value}>{ficha.produtosUtilizados || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Contato com:</Text><Text style={styles.value}>{ficha.contatoComSuperficie || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Convive com outros animais:</Text><Text style={styles.value}>{ficha.conviveComAnimais || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Contactante Sintomáticos:</Text><Text style={styles.value}>{ficha.contactantesSintomaticos || 'N/A'}</Text></View>

                    <View style={styles.row}><Text style={styles.label}>Última Administração Ectoparasitas:</Text><Text style={styles.value}>{ficha.ultimaAdministracao ? moment(ficha.ultimaAdministracao).format('DD/MM/YYYY') : 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Apresenta Ectoparasitas:</Text><Text style={styles.value}>{ficha.apresentaEctoparasitas || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Visto por Última Vez:</Text><Text style={styles.value}>{ficha.quandoVistoUltimaVez || 'N/A'}</Text></View>
                    
                </View>
                <View style={styles.subsection}>
                    <Text style={styles.label}>Queixa Principal:</Text><Text style={styles.textAreaContent}>{ficha.queixaPrincipal || 'N/A'}</Text>
                    <View style={styles.row}><Text style={styles.label}>Prurido:</Text><Text style={styles.value}>{ficha.prurido || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Intensidade:</Text><Text style={styles.value}>{ficha.intensidade || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Lambedura de Patas:</Text><Text style={styles.value}>{ficha.lambedura || 'N/A'}</Text></View>
                    <Text style={{...styles.label, marginTop: 8}}>Tratamentos Anteriores:</Text><Text style={styles.textAreaContent}>{ficha.tratamento || 'N/A'}</Text>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Ficha Dermatológica (Continuação)</Text>
                <Text style={styles.sectionTitle}>Exame Físico Geral</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Postura:</Text><Text style={styles.value}>{ficha.postura || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Nível de Consciência:</Text><Text style={styles.value}>{ficha.nivelDeConsciencia || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Score Corporal:</Text><Text style={styles.value}>{ficha.scoreCorporal || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Temperatura:</Text><Text style={styles.value}>{ficha.temperatura ? `${ficha.temperatura}°C` : 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Hidratação:</Text><Text style={styles.value}>{ficha.grauDedesidratacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Turgor Cutâneo:</Text><Text style={styles.value}>{ficha.turgorCutaneo || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>TPC:</Text><Text style={styles.value}>{ficha.tpc || 'N/A'}</Text></View>
                </View>
                <View style={styles.subsection}><Text style={styles.label}>Mucosas:</Text>{Object.keys(ficha.options || {}).filter(key => ficha.options[key]).map(key => <Text key={key} style={{...styles.value, textAlign: 'left', marginTop: 4}}>• {key.replace(/([A-Z])/g, ' $1').trim()}: {ficha.mucosas?.[key] || 'Não especificado'}</Text>)}</View>
                <View style={styles.subsection}><Text style={styles.label}>Linfonodos:</Text>{Object.keys(ficha.linfonodos || {}).map(key => <Text key={key} style={{...styles.value, textAlign: 'left', marginTop: 4}}>• {linfonodosLabels[key] || key}: {(ficha.linfonodos[key] || []).join(', ')}</Text>)}</View>
                <View style={styles.subsection}><Text style={styles.label}>Alterações Clínicas Diversas:</Text><Text style={styles.textAreaContent}>{ficha.alteracoesClinicas || 'N/A'}</Text></View>

                <Text style={styles.sectionTitle}>Exame Dermatológico</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Ectoparasitas:</Text><Text style={styles.value}>{ficha.ectoparasitas || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Pelagem:</Text><Text style={styles.value}>{(ficha.pelagem || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Descamação:</Text><Text style={styles.value}>{ficha.descamacao || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Untuosidade:</Text><Text style={styles.value}>{ficha.untuosidade || 'N/A'}</Text></View>
                </View>
                <View style={styles.subsection}>
                    <Text style={styles.label}>Conduto Auditivo Direito:</Text><Text style={styles.value}>{(ficha.condutoAuditivoDireito || []).join(', ')}</Text>
                    <Text style={{...styles.label, marginTop: 8}}>Conduto Auditivo Esquerdo:</Text><Text style={styles.value}>{(ficha.condutoAuditivoEsquerdo || []).join(', ')}</Text>
                </View>
                {ficha.imagemLesao?.imagem && <Image src={ficha.imagemLesao.imagem} style={styles.desenhoLesao} />}
            </Page>

            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Ficha Dermatológica (Diagnóstico e Tratamento)</Text>
                <Text style={styles.sectionTitle}>Lesões</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Formações Sólidas:</Text><Text style={styles.value}>{(ficha.formacoesSolidas || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Alterações de Cor:</Text><Text style={styles.value}>{(ficha.alteracoesDeCor || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Coleções Líquidas:</Text><Text style={styles.value}>{(ficha.colecoesLiquidas || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Alterações de Espessura:</Text><Text style={styles.value}>{(ficha.alteracoesEspessura || []).join(', ')}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Perdas Teciduais:</Text><Text style={styles.value}>{ficha.perdasTeciduais || 'N/A'}</Text></View>
                </View>
                <View style={styles.subsection}><Text style={styles.label}>Descrição Lesional:</Text><Text style={styles.textAreaContent}>{ficha.descricaoLesional || 'N/A'}</Text></View>
                <View style={styles.subsection}><Text style={styles.label}>Critérios de Favrot:</Text><Text style={styles.value}>{(ficha.criteriosFavrot || []).join(', ')}</Text></View>
                <View style={styles.subsection}><Text style={styles.label}>Observação:</Text><Text style={styles.textAreaContent}>{ficha.observacao || 'N/A'}</Text></View>

                <Text style={styles.sectionTitle}>Diagnóstico e Conduta</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Diagnóstico Definitivo:</Text><Text style={styles.value}>{diagnostico.definitivo || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Observações:</Text><Text style={styles.value}>{diagnostico.observacoes || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Prognóstico:</Text><Text style={styles.value}>{diagnostico.prodnostico || 'N/A'}</Text></View>
                </View>

                <Text style={styles.sectionTitle}>Tratamento</Text>
                <View style={styles.subsection}>
                    <View style={styles.table}>
                        <View style={styles.tableRow} fixed><View style={{...styles.tableColHeader, width: '40%'}}><Text style={styles.tableCellHeader}>Medicação</Text></View><View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Dose</Text></View><View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Frequência</Text></View><View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableCellHeader}>Período</Text></View></View>
                        {tratamentoDermatologico.filter(t => t.medicacao).map((t, index) => (
                            <View style={styles.tableRow} key={index}><View style={{...styles.tableCol, width: '40%'}}><Text style={styles.tableCell}>{t.medicacao}</Text></View><View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{t.dose}</Text></View><View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{t.frequencia}</Text></View><View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{t.periodo}</Text></View></View>
                        ))}
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Responsáveis</Text>
                <View style={styles.subsection}><View style={styles.rowLast}><Text style={styles.label}>Estagiário(s):</Text><Text style={styles.value}>{ficha.estagiarios || 'N/A'}</Text></View></View>

                <View fixed>{medicoLogado && <Text style={styles.assinatura}>Assinado eletronicamente por Dr(a). {medicoLogado.nome}, CRMV {medicoLogado.crmv}</Text>}</View>
            </Page>
        </Document>
    );
};

export default DermatologicaPDF;
