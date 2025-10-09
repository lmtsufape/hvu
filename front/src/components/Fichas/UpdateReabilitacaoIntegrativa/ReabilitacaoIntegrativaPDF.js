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
});

const ReabilitacaoIntegrativaPDF = ({ ficha, animal, tutor, medicoLogado }) => {
    const { 
        historicoClinico = {}, exameClinicoEspecialOrtpedico = {}, exameClinicoEspecialNeurologico = {},
        exameClinicoEspecialOutros = {}, queixaPrincipal2 = {}, sistemaDigestorio = {},
        sistemaCardiorespiratorio = {}, sistemaGeniturinario = {}, sistemaNervoso = {},
        sistemaOsteoarticularLocomotor = {}, sistemaTegumentarAnexos = {}, sistemaVisual = {},
        manejosGerais = {}, perguntasAdicionaisMTC = {}, diagnosticoMTC = {}
    } = ficha;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Ficha de Reabilitação Integrativa</Text>
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
                
                <Text style={styles.sectionTitle}>Anamnese Inicial</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Nº Prontuário:</Text><Text style={styles.value}>{ficha.numeroProntuario || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Peso:</Text><Text style={styles.value}>{ficha.peso ? `${ficha.peso} kg` : 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Queixa Principal:</Text><Text style={styles.value}>{ficha.queixaPrincipal || 'N/A'}</Text></View>
                </View>

                <Text style={styles.sectionTitle}>Histórico Clínico Especial</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Histórico Ortopédico:</Text><Text style={styles.value}>{historicoClinico.ortopedico || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Histórico Neurológico:</Text><Text style={styles.value}>{historicoClinico.neurologico || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Histórico Oncológico:</Text><Text style={styles.value}>{historicoClinico.oncologico || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Outros:</Text><Text style={styles.value}>{historicoClinico.outros || 'N/A'}</Text></View>
                </View>

                <Text style={styles.sectionTitle}>Exame Clínico Especial</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Palpação de Membros/Articulações:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.palpacaoMembrosArticulacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Palpação de Coluna:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.palpacaoColuna || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Teste Ortolani:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.testeOrtolani || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Teste de Gaveta:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.testeDeGaveta || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Teste de Compressão Tibial:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.testeDeCompressaoTibial || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Instabilidade Medial de Ombro:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.instabilidadeMedialDeOmbro || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Palpação do Tendão Bicipital:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.palpacaoDoTendaoBicipital || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Avaliação de Massa Muscular:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.avaliacaoDeMassaMuscular || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Avaliação da Capacidade de Movimento:</Text><Text style={styles.value}>{exameClinicoEspecialOrtpedico.avaliacaoDaCapacidadeDeMovimento || 'N/A'}</Text></View>
                </View>
            
                <Text style={styles.sectionTitle}>Exame Clínico Neurológico</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Estado Mental:</Text><Text style={styles.value}>{exameClinicoEspecialNeurologico.estadoMental || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Postura:</Text><Text style={styles.value}>{exameClinicoEspecialNeurologico.postura || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Locomoção:</Text><Text style={styles.value}>{exameClinicoEspecialNeurologico.locomocao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Nervos Cranianos:</Text><Text style={styles.value}>{exameClinicoEspecialNeurologico.nervosCranianos || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Reações Posturais:</Text><Text style={styles.value}>{exameClinicoEspecialNeurologico.reacoesPosturais || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Reflexos Segmentares:</Text><Text style={styles.value}>{exameClinicoEspecialNeurologico.reflexoesSegmentares || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Avaliação Sensitiva:</Text><Text style={styles.value}>{exameClinicoEspecialNeurologico.avaliacaoSensitiva || 'N/A'}</Text></View>
                </View>
                <Text style={styles.sectionTitle}>Exame clínico especial / Outros</Text>
                <View style={styles.subsection}><Text style={styles.label}>Observações:</Text><Text style={styles.textAreaContent}>{exameClinicoEspecialOutros.observacoes || 'N/A'}</Text></View>

                <Text style={styles.sectionTitle}>Queixa Principal (Detalhes)</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Sinais Clínicos:</Text><Text style={styles.value}>{queixaPrincipal2.sinaisClinicos || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Primeira Ocorrência:</Text><Text style={styles.value}>{queixaPrincipal2.primeiraOcorrencia || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Evolução:</Text><Text style={styles.value}>{queixaPrincipal2.evolucao || 'N/A'}</Text></View>
                </View>
                <View style={styles.subsection}><Text style={styles.label}>Medicação Administrada:</Text><Text style={styles.textAreaContent}>{ficha.medicacaoAdministrada || 'N/A'}</Text></View>

                <Text style={styles.sectionTitle}>Avaliação por Sistemas</Text>
                <View style={styles.subsection}>
                    {/* Sistema Digestório */}
                    <Text style={styles.sectionTitle}>Sistema Digestório</Text>
                    <View style={styles.row}><Text style={styles.label}>Alimentação:</Text><Text style={styles.value}>{sistemaDigestorio.alimentacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Apetite/Deglutição:</Text><Text style={styles.value}>{sistemaDigestorio.apetiteDeglutinacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Êmese/ Regurgitação/ Refluxo/ Eructação/ Flatulência:</Text><Text style={styles.value}>{sistemaDigestorio.tipo || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Dentição:</Text><Text style={styles.value}>{sistemaDigestorio.denticao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Fezes/Defecação:</Text><Text style={styles.value}>{sistemaDigestorio.fezes || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Obesidade:</Text><Text style={styles.value}>{sistemaDigestorio.obesidade || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Consumo de Água:</Text><Text style={styles.value}>{sistemaDigestorio.ConsumoDeAgua || 'N/A'}</Text></View>

                    {/* Sistema Cardiorrespiratório */}
                    <Text style={styles.sectionTitle}>Sistema Cardiorrespiratório</Text>
                    <View style={styles.row}><Text style={styles.label}>Respiração:</Text><Text style={styles.value}>{sistemaCardiorespiratorio.respiracao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Tosse/Espirros:</Text><Text style={styles.value}>{sistemaCardiorespiratorio.tosseEspirros || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Secreções (Nasais/Oculares):</Text><Text style={styles.value}>{sistemaCardiorespiratorio.secrecao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Intolerância ao Exercício/Cianose:</Text><Text style={styles.value}>{sistemaCardiorespiratorio.intoleranciaExercicio || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Cardiopatia:</Text><Text style={styles.value}>{sistemaCardiorespiratorio.cardiopatia || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Aumento de Volume (Membros/Ascite):</Text><Text style={styles.value}>{sistemaCardiorespiratorio.aumentoDeVolume || 'N/A'}</Text></View>

                    {/* Sistema Geniturinário */}
                    <Text style={styles.sectionTitle}>Sistema Geniturinário</Text>
                    <View style={styles.row}><Text style={styles.label}>Micção (Dor/Odor/Coloração):</Text><Text style={styles.value}>{sistemaGeniturinario.miccao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Castrado/Inteiro:</Text><Text style={styles.value}>{sistemaGeniturinario.castradoInteiro || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Cruzamentos/Cios/etc:</Text><Text style={styles.value}>{sistemaGeniturinario.tipo1 || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Infecções/Secreções Genitais:</Text><Text style={styles.value}>{sistemaGeniturinario.tipo2 || 'N/A'}</Text></View>

                    {/* Sistema Nervoso */}
                    <Text style={styles.sectionTitle}>Sistema Nervoso</Text>
                    <View style={styles.row}><Text style={styles.label}>Convulsões/Desequilíbrios:</Text><Text style={styles.value}>{sistemaNervoso.convulsoesDesequilibrios || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Alterações Comportamentais:</Text><Text style={styles.value}>{sistemaNervoso.alteracoesComportamentais || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Nistagmo/Mioclonias:</Text><Text style={styles.value}>{sistemaNervoso.nistagmoMioclonias || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Dor de Cabeça:</Text><Text style={styles.value}>{sistemaNervoso.dorDeCabeca || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Sinais Neurológicos:</Text><Text style={styles.value}>{sistemaNervoso.sinaisNeurologicos || 'N/A'}</Text></View>

                    {/* Sistema Osteoarticular/Locomotor */}
                    <Text style={styles.sectionTitle}>Sistema Osteoarticular/Locomotor</Text>
                    <View style={styles.row}><Text style={styles.label}>Postura/Marcha:</Text><Text style={styles.value}>{sistemaOsteoarticularLocomotor.posturaMarcha || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Claudicação:</Text><Text style={styles.value}>{sistemaOsteoarticularLocomotor.claudinacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Paralisia/Paresia/Ataxia:</Text><Text style={styles.value}>{sistemaOsteoarticularLocomotor.tipo3 || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Atonia/Hipotonia/Hipertonia:</Text><Text style={styles.value}>{sistemaOsteoarticularLocomotor.tipo4 || 'N/A'}</Text></View>

                    {/* Sistema Tegumentar e Anexos */}
                    <Text style={styles.sectionTitle}>Sistema Tegumentar e Anexos</Text>
                    <View style={styles.row}><Text style={styles.label}>Pruridos/Lambedura:</Text><Text style={styles.value}>{sistemaTegumentarAnexos.tipo5 || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Descamações/Lesões/Nódulos:</Text><Text style={styles.value}>{sistemaTegumentarAnexos.tipo6 || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Odores/Secreções:</Text><Text style={styles.value}>{sistemaTegumentarAnexos.odoresSecrecoes || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Qualidade/Coloração Pelos:</Text><Text style={styles.value}>{sistemaTegumentarAnexos.qualidade || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Acusia:</Text><Text style={styles.value}>{sistemaTegumentarAnexos.acusia || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Unhas (Crescimento/Quebra):</Text><Text style={styles.value}>{sistemaTegumentarAnexos.unhas || 'N/A'}</Text></View>

                    {/* Sistema Visual */}
                    <Text style={styles.sectionTitle}>Sistema Visual</Text>
                    <View style={styles.row}><Text style={styles.label}>Opacificação de Cristalino:</Text><Text style={styles.value}>{sistemaVisual.opacificacaoDeCristalino || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Perda da Visão:</Text><Text style={styles.value}>{sistemaVisual.perdaDaVisao || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Secreções (Visual):</Text><Text style={styles.value}>{sistemaVisual.secrecao2 || 'N/A'}</Text></View>

                    {/* Manejos Gerais */}
                    <Text style={styles.sectionTitle}>Manejos Gerais</Text>
                    <View style={styles.row}>
                    <Text style={styles.label}>Vacinação:</Text><Text style={styles.value}>{ficha.manejosGerais?.vacinacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Desverminização:</Text><Text style={styles.value}>{ficha.manejosGerais?.desverminizacao || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Ambiente:</Text><Text style={styles.value}>{ficha.manejosGerais?.ambiente || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Banhos:</Text><Text style={styles.value}>{ficha.manejosGerais?.banhos || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Contactantes:</Text><Text style={styles.value}>{ficha.manejosGerais?.contactantes || 'N/A'}</Text></View>
                </View>
        
               
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Sensibilidade Pontos Mu:</Text><Text style={styles.value}>{ficha.sensibilidadePontosMu || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Sensibilidade Pontos Shu:</Text><Text style={styles.value}>{ficha.sensibilidadePontosShu || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Sensibilidade/Dor Corporal:</Text><Text style={styles.value}>{ficha.sensibilidadeDorCorporal || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Pulso:</Text><Text style={styles.value}>{ficha.pulso || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Língua:</Text><Text style={styles.value}>{ficha.lingua || 'N/A'}</Text></View>
                </View>
                 <Text style={styles.sectionTitle}>Perguntas Adicionais - MTC</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Histórico Ancestral:</Text><Text style={styles.value}>{perguntasAdicionaisMTC.historicoAncestral || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Comportamento:</Text><Text style={styles.value}>{perguntasAdicionaisMTC.comportamento || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Latido/Miado:</Text><Text style={styles.value}>{perguntasAdicionaisMTC.latidoMiado || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Sono:</Text><Text style={styles.value}>{perguntasAdicionaisMTC.sono || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Preferências:</Text><Text style={styles.value}>{(ficha.preferencias || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Constituição Corporal:</Text><Text style={styles.value}>{(ficha.constituicaoCorporal || []).join(', ')}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>Piora com Clima/Época:</Text><Text style={styles.value}>{perguntasAdicionaisMTC.descricao || 'N/A'}</Text></View>
                </View>

                <Text style={styles.sectionTitle}>Diagnóstico MTC</Text>
                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Órgãos/Substâncias Envolvidas:</Text><Text style={styles.value}>{diagnosticoMTC.orgaosSubstacias || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Princípios:</Text><Text style={styles.value}>{(ficha.principios || []).join(', ')}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>WU XING:</Text><Text style={styles.value}>{diagnosticoMTC.wuXing || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>ZANG FU:</Text><Text style={styles.value}>{diagnosticoMTC.zangFu || 'N/A'}</Text></View>
                </View>

                <View style={styles.subsection}>
                    <View style={styles.row}><Text style={styles.label}>Responsável:</Text><Text style={styles.value}>{ficha.responsavel || 'N/A'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Estagiário:</Text><Text style={styles.value}>{ficha.estagiario || 'N/A'}</Text></View>
                    <View style={styles.rowLast}><Text style={styles.label}>CPF:</Text><Text style={styles.value}>{ficha.cpf || 'N/A'}</Text></View>
                </View>

                <View fixed>{medicoLogado && <Text style={styles.assinatura}>Assinado eletronicamente por Dr(a). {medicoLogado.nome}, CRMV {medicoLogado.crmv}</Text>}</View>
            </Page>
        </Document>
    );
};

export default ReabilitacaoIntegrativaPDF;
