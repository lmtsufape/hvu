import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';

import Ortopedica from "./OrtopedicoHistorico";
import Ortopedica2 from "./OrtopedicoMarcha";
import Ortopedica3 from "./OrtopedicoPalpacao";
import OrtopedicaPDF from './OrtopedicaPDF';

import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";

import { getCurrentUsuario } from '../../../../services/userService';
import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getAnimalById } from "../../../../services/animalService";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getMedicoById } from "../../../../services/medicoService";

// Dynamic import fora do componente
const PDFLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), 
  { ssr: false }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
  <button type="button" className={styles.green_buttonFichas} style={{ width: 'auto', padding: '0 1.5rem' }}>
    <PDFLink 
      document={<OrtopedicaPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} 
      fileName={`FichaOrtopedica_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`} 
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function OrtopedicaSteps() {
  const router = useRouter();
  const { modo, animalId: queryAnimalId, fichaId: queryFichaId, agendamentoId: queryAgendamentoId, consultaId: queryConsultaId } = router.query;

  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [consultaId, setConsultaId] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [data, setData] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [animal, setAnimal] = useState({});
  const [tutor, setTutor] = useState({});
  const [medicoLogado, setMedicoLogado] = useState(null);

  const [selecionadosGrupoExame, setSelecionadosGrupoExame] = useState([]);
  const [ladosVisiveisGrupoExame, setLadosVisiveisGrupoExame] = useState({});

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const [formData, setFormData] = useState({
    // página 1
    queixaPrincipal: "",
    ocorrenciaTrauma: "",
    duracaoProblema: "",
    evolucaoQuadro: "",
    ocorrenciaClaudicacao: "",
    toleranciaExercicio: "",
    indiciosDor: "",
    acidentesAnteriores: "",
    tratamentosHistorico: "",
    alimentacao: "",
    vitaminas: "",
    ambiente: "",
    observacao: "",

    // página 2
    condicaoCorporal: "",
    comportamento: "",
    postura: "",
    capacidadePeso: "",
    tumefacao: "",
    assimetriaDesvio: "",
    atrofiaMuscular: "",
    escoriacoesFistulas: "",
    caracteristicas: "",
    claudicacao: "",
    faseApoio: "",
    faseElevacao: "",
    anguloArticulacoes: "",
    segundaObservacao: "",
    marcha: "",

    // página 3
    digitosMetacarpos: {
      flexaoMetacarpos: { Direito: "", Esquerdo: "" },
      extensaoMetacarpos: { Direito: "", Esquerdo: "" }
    },
    carpo: {
      hiperextensao: { Direito: "", Esquerdo: "" },
      flexaoCarpo: { Direito: "", Esquerdo: "" },
      extensaoCarpo: { Direito: "", Esquerdo: "" },
      instabilidadeMedial: { Direito: "", Esquerdo: "" },
      rotacaoCarpo: { Direito: "", Esquerdo: "" }
    },
    radioUlna: {
      olecrano: { Direito: "", Esquerdo: "" },
    },
    musculosTendoes: {
      hipertonia: { Direito: "", Esquerdo: "" },
      hipotonia: { Direito: "", Esquerdo: "" },
      hipertrofia: { Direito: "", Esquerdo: "" },
      atrofia: { Direito: "", Esquerdo: "" },
      contraturaFibrose: { Direito: "", Esquerdo: "" },
      enrijecimento: { Direito: "", Esquerdo: "" },
      restricaoMovArticular: { Direito: "", Esquerdo: "" },
      ampliacaoMovArticular: { Direito: "", Esquerdo: "" },
      dorInchaco: { Direito: "", Esquerdo: "" },
      hematoma: { Direito: "", Esquerdo: "" },
      laceracoesRuptura: { Direito: "", Esquerdo: "" },
      tremoresMioclonias: { Direito: "", Esquerdo: "" },
      caibra: { Direito: "", Esquerdo: "" },
      depressaoMiotonicaPercussao: { Direito: "", Esquerdo: "" },
      higroma: { Direito: "", Esquerdo: "" },
      tumor: { Direito: "", Esquerdo: "" },
      posturaCaranguejo: { Direito: "", Esquerdo: "" },
      outros: { Direito: "", Esquerdo: "" }
    },
    umero: {
      ladoUmero: { Direito: "", Esquerdo: "" }
    },
    ombro: {
      flexaoOmbro: { Direito: "", Esquerdo: "" },
      extensaoOmbro: { Direito: "", Esquerdo: "" },
      rotacaoOmbro: { Direito: "", Esquerdo: "" },
      aducaoAbducao: { Direito: "", Esquerdo: "" },
      palpacaoGlenoideCaudal: { Direito: "", Esquerdo: "" },
      compressaoUmeral: { Direito: "", Esquerdo: "" },
      origemBiceps: { Direito: "", Esquerdo: "" },
      retracaoBiceps: { Direito: "", Esquerdo: "" },
      estiramentoBiceps: { Direito: "", Esquerdo: "" },
      relAcromioTuberculoMaior: { Direito: "", Esquerdo: "" }
    },
    axilarSubescapular: {
      ladoSubescapular: { Direito: "", Esquerdo: "" },
    },
    escapula: {
      corpoEspinha: { Direito: "", Esquerdo: "" },
      colo: { Direito: "", Esquerdo: "" },
      acromio: { Direito: "", Esquerdo: "" },
      luxacaoDorsal: { Direito: "", Esquerdo: "" },
    },
    articulacaoCubital: {
      flexaoCubital: { Direito: "", Esquerdo: "" },
      extensaoCubital: { Direito: "", Esquerdo: "" },
      instabilidadeMedialLateral: { Direito: "", Esquerdo: "" },
      processoAnconeo: { Direito: "", Esquerdo: "" },
      processoCoronoide: { Direito: "", Esquerdo: "" },
      efusaoArticular: { Direito: "", Esquerdo: "" },
      palpacaoTensaoLigColMed: { Direito: "", Esquerdo: "" },
      epicondiloMedial: { Direito: "", Esquerdo: "" },
    },
    digitosMetatarsos: {
      flexaoMetatarsos: { Direito: "", Esquerdo: "" },
      extensaoMetatarsos: { Direito: "", Esquerdo: "" },
    },
    tarso: {
      calcaneoTendao: { Direito: "", Esquerdo: "" },
      flexaoTarso: { Direito: "", Esquerdo: "" },
      extensaoTarso: { Direito: "", Esquerdo: "" },
      instabilidadeMedialLateralTarso: { Direito: "", Esquerdo: "" },
      rotacaoTarso: { Direito: "", Esquerdo: "" },
    },
    tibiaFibula: {
      cristaTibia: { Direito: "", Esquerdo: "" },
    },
    articulacaoJoelho: {
      ligamentoElevacaoPatelar: { Direito: "", Esquerdo: "" },
      luxacaoPatelarMedialLateral: { Direito: "", Esquerdo: "" },
      sentar: { Direito: "", Esquerdo: "" },
      flexaoArticulacaoJoelho: { Direito: "", Esquerdo: "" },
      extensaoArticulacaoJoelho: { Direito: "", Esquerdo: "" },
      posicaoRotacaoCristaTibial: { Direito: "", Esquerdo: "" },
      instabilidadeCraniomedial: { Direito: "", Esquerdo: "" },
      gavetaCranial: { Direito: "", Esquerdo: "" },
      gavetaCaudal: { Direito: "", Esquerdo: "" },
      compressaoTibial: { Direito: "", Esquerdo: "" },
      gavetaMedialLateral: { Direito: "", Esquerdo: "" },
      menisco: { Direito: "", Esquerdo: "" },
      clickMeniscal: { Direito: "", Esquerdo: "" },
      clickTendaoExtensorDigitalLongo: { Direito: "", Esquerdo: "" },
      efusaoArticular: { Direito: "", Esquerdo: "" },
      coximAdiposo: { Direito: "", Esquerdo: "" },
    },
    femur: {
      ladoFemur: { Direito: "", Esquerdo: "" },
    },
    articulacaoCoxal: {
      conformacaoBase: { Direito: "", Esquerdo: "" },
      clunck: { Direito: "", Esquerdo: "" },
      stand: { Direito: "", Esquerdo: "" },
      abducaoRotacaoExterna: { Direito: "", Esquerdo: "" },
      simetriaReacaoExtensao: { Direito: "", Esquerdo: "" },
      testeSubluxacao: { Direito: "", Esquerdo: "" },
      testeIliopsoas: { Direito: "", Esquerdo: "" },
      anguloSubluxacao: { Direito: "", Esquerdo: "" },
      anguloReducao: { Direito: "", Esquerdo: "" },
      sinalOrtolani: { Direito: "", Esquerdo: "" },
      sinalBarlow: { Direito: "", Esquerdo: "" },
      testeBardens: { Direito: "", Esquerdo: "" },
      compressaoTrocanterica: { Direito: "", Esquerdo: "" },
    },
    articulacaoSacroiliaca: {
      ladoSacroiliaca: { Direito: "", Esquerdo: "" },
    },
    pelve: {
      cristaIliaca: { Direito: "", Esquerdo: "" },
      tuberosidadeIsquiatica: { Direito: "", Esquerdo: "" },
      relacaoTrocanterMaior: { Direito: "", Esquerdo: "" },
      exameRetal: { Direito: "", Esquerdo: "" },
    },
    cabecaEsqueletoAxial: {
      cranio: "",
      maxila: "",
      ramosMandibulares: "",
      sinfiseMandibular: "",
      atm: "",
      colunaCervical: "",
    },
    achadosImagem: "",
    outrosExames: "",
    diagnostico: "",
    tratamento: "",
    plantonistas: "",
    medicosResponsaveis: "",
  });

  useEffect(() => {
    if (modo === 'visualizar') {
      setIsReadOnly(true);
    }
  }, [modo]);

  useEffect(() => {
    if (router.isReady) {
      if (queryConsultaId) setConsultaId(queryConsultaId);
      if (queryFichaId) setFichaId(queryFichaId);
      if (queryAgendamentoId) setAgendamentoId(queryAgendamentoId);
      if (queryAnimalId) setAnimalId(queryAnimalId);
    }
  }, [router.isReady, queryConsultaId, queryFichaId, queryAgendamentoId, queryAnimalId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedRoles = JSON.parse(localStorage.getItem('roles') || "[]");
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUsuario();
        const medicoId = userData?.usuario?.id;
        if (medicoId) {
          const medicoCompletoData = await getMedicoById(medicoId);
          setMedicoLogado(medicoCompletoData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do médico:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!animalId) return;

    const fetchDataForPDF = async () => {
      try {
        const [animalData, tutorData] = await Promise.all([
          getAnimalById(animalId),
          getTutorByAnimal(animalId)
        ]);
        setAnimal(animalData || {});
        setTutor(tutorData || {});
      } catch (error) {
        console.error('Erro ao buscar dados para o PDF:', error);
      }
    };
    fetchDataForPDF();
  }, [animalId]);

  useEffect(() => {
    if (modo === "criar") {
      setLoading(false);
      return;
    }

    if (!fichaId) return;

    const fetchData = async () => {
      try {
        const formDataResponse = await getFichaById(fichaId);
        if (formDataResponse?.conteudo) {
          const parsedConteudo = typeof formDataResponse.conteudo === 'string'
            ? JSON.parse(formDataResponse.conteudo)
            : formDataResponse.conteudo;
          setFormData(parsedConteudo);
        }
        setData(formDataResponse?.dataHora);
      } catch (error) {
        console.error('Erro ao buscar dados da ficha:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fichaId, modo]);

  useEffect(() => {
    if (!fichaId || Object.keys(formData).length === 0) {
      return;
    }

    const novosLadosVisiveis = {};
    const novosSelecionados = [];

    const gruposDePalpacao = [
      "digitosMetacarpos", "carpo", "radioUlna", "musculosTendoes", "umero", "ombro", 
      "axilarSubescapular", "escapula", "articulacaoCubital", "digitosMetatarsos", "tarso", 
      "tibiaFibula", "articulacaoJoelho", "femur", "articulacaoCoxal", "articulacaoSacroiliaca", 
      "pelve", "cabecaEsqueletoAxial"
    ];

    gruposDePalpacao.forEach(grupoTitulo => {
      const grupoData = formData[grupoTitulo];
      if (typeof grupoData === 'object' && grupoData !== null) {
        for (const itemKey in grupoData) {
          const itemData = grupoData[itemKey];
          if (itemData && (itemData.Direito || itemData.Esquerdo)) {
            if (!novosSelecionados.includes(itemKey)) {
              novosSelecionados.push(itemKey);
            }
            if (typeof itemData === 'object' && itemData !== null) {
              novosLadosVisiveis[itemKey] = {};
              if (itemData.Direito) {
                novosLadosVisiveis[itemKey].Direito = true;
              }
              if (itemData.Esquerdo) {
                novosLadosVisiveis[itemKey].Esquerdo = true;
              }
            }
          }
        }
      }
    });

    setSelecionadosGrupoExame(novosSelecionados);
    setLadosVisiveisGrupoExame(novosLadosVisiveis);
  }, [formData, fichaId]);

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    );
  }

  if (!roles.includes("medico") && !roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    );
  }

  const toggleItem = (titulo, key) => {
    const wasSelected = selecionadosGrupoExame.includes(key);

    setSelecionadosGrupoExame(prev =>
      wasSelected ? prev.filter(i => i !== key) : [...prev, key]
    );

    if (wasSelected) {
      setFormData(prev => {
        const newFormData = { ...prev };
        if (newFormData[titulo] && newFormData[titulo][key]) {
          newFormData[titulo][key] = {
            Direito: "",
            Esquerdo: ""
          };
        }
        return newFormData;
      });

      setLadosVisiveisGrupoExame(prev => {
        const novo = { ...prev };
        if (novo[key]) delete novo[key];
        return novo;
      });
    }
  };

  const toggleLadoVisivel = (titulo, key, lado) => {
    const wasVisible = ladosVisiveisGrupoExame[key]?.[lado];

    setLadosVisiveisGrupoExame(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [lado]: !wasVisible,
      },
    }));

    if (wasVisible) {
      setFormData(prev => {
        const newFormData = { ...prev };
        if (newFormData[titulo]?.[key]) {
          newFormData[titulo][key] = {
            ...newFormData[titulo][key],
            [lado]: ""
          };
        }
        return newFormData;
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioAninhado = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
    const newFormData = { ...formData };

    let temp = newFormData;
    for (let i = 0; i < nameParts.length - 1; i++) {
      temp = temp[nameParts[i]] = temp[nameParts[i]] || {};
    }
    temp[nameParts[nameParts.length - 1]] = value;

    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    setShowErrorAlert(false);

    const currentModo = modo || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('modo'));
    const currentFichaId = fichaId || queryFichaId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fichaId'));
    const currentAgendamentoId = agendamentoId || queryAgendamentoId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('agendamentoId'));

    const dataFormatada = moment(data).isValid() 
      ? moment(data).format("YYYY-MM-DDTHH:mm:ss") 
      : moment().format("YYYY-MM-DDTHH:mm:ss");

    const fichaData = {
      nome: "Ficha clínica ortopédica",
      conteudo: {
        queixaPrincipal: formData.queixaPrincipal,
        ocorrenciaTrauma: formData.ocorrenciaTrauma,
        duracaoProblema: formData.duracaoProblema,
        evolucaoQuadro: formData.evolucaoQuadro,
        ocorrenciaClaudicacao: formData.ocorrenciaClaudicacao,
        toleranciaExercicio: formData.toleranciaExercicio,
        indiciosDor: formData.indiciosDor,
        acidentesAnteriores: formData.acidentesAnteriores,
        tratamentosHistorico: formData.tratamentosHistorico,
        alimentacao: formData.alimentacao,
        vitaminas: formData.vitaminas,
        ambiente: formData.ambiente,
        observacao: formData.observacao,

        condicaoCorporal: formData.condicaoCorporal,
        comportamento: formData.comportamento,
        postura: formData.postura,
        capacidadePeso: formData.capacidadePeso,
        tumefacao: formData.tumefacao,
        assimetriaDesvio: formData.assimetriaDesvio,
        atrofiaMuscular: formData.atrofiaMuscular,
        escoriacoesFistulas: formData.escoriacoesFistulas,
        caracteristicas: formData.caracteristicas,
        claudicacao: formData.claudicacao,
        faseApoio: formData.faseApoio,
        faseElevacao: formData.faseElevacao,
        anguloArticulacoes: formData.anguloArticulacoes,
        segundaObservacao: formData.segundaObservacao,
        marcha: formData.marcha,

        achadosImagem: formData.achadosImagem,
        outrosExames: formData.outrosExames,
        diagnostico: formData.diagnostico,
        tratamento: formData.tratamento,
        plantonistas: formData.plantonistas,

        digitosMetacarpos: formData.digitosMetacarpos,
        carpo: formData.carpo,
        radioUlna: formData.radioUlna,
        musculosTendoes: formData.musculosTendoes,
        umero: formData.umero,
        ombro: formData.ombro,
        axilarSubescapular: formData.axilarSubescapular,
        escapula: formData.escapula,
        articulacaoCubital: formData.articulacaoCubital,
        digitosMetatarsos: formData.digitosMetatarsos,
        tarso: formData.tarso,
        tibiaFibula: formData.tibiaFibula,
        articulacaoJoelho: formData.articulacaoJoelho,
        femur: formData.femur,
        articulacaoCoxal: formData.articulacaoCoxal,
        articulacaoSacroiliaca: formData.articulacaoSacroiliaca,
        pelve: formData.pelve,
        cabecaEsqueletoAxial: formData.cabecaEsqueletoAxial,
        medicosResponsaveis: formData.medicosResponsaveis,
      },
      dataHora: dataFormatada,
      agendamento: { id: Number(currentAgendamentoId) }
    };

    try {
      if (currentModo === "criar" || !currentFichaId || currentFichaId === "null") {
        await createFicha(fichaData);
      } else {
        await updateFicha(fichaData, currentFichaId);
      }
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);
      setErrorMessage(error?.response?.data?.message || (currentModo === "criar" || !currentFichaId ? "Erro ao criar ficha" : "Erro ao editar ficha"));
      setShowErrorAlert(true);
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <Ortopedica 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Ortopedica2
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Ortopedica3
            formData={formData} 
            handleChange={handleChange}
            handleRadioAninhado={handleRadioAninhado} 
            handleSubmit={handleSubmit}
            prevStep={prevStep}
            selecionados={selecionadosGrupoExame}
            ladosVisiveis={ladosVisiveisGrupoExame}
            toggleItem={toggleItem}
            toggleLadoVisivel={toggleLadoVisivel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {renderStepContent()}
      
      <div className={styles.footerControls}>
        {!loading && animal?.id && tutor?.id && medicoLogado && (
          <DownloadPdfStyledButton ficha={formData} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />
        )}
      </div>

      <div className={styles.pagination}>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={styles.pageButton}
            onClick={() => setStep(page)}
            disabled={step === page}
          >
            {page}
          </button>
        ))}
      </div>

      {showAlert && (
        <div className={styles.alert}>
          <Alert
            message={modo === "criar" ? "Ficha criada com sucesso!" : "Ficha editada com sucesso!"}
            show={showAlert}
            url={consultaId ? `/createConsulta/${consultaId}` : (animalId ? `/getAllConsultas/${animalId}` : `/getAllConsultas`)}
          />
        </div>
      )}
      {showErrorAlert && (
        <div className={styles.alert}>
          <ErrorAlert
            message={errorMessage || (modo === "criar" ? "Erro ao criar ficha" : "Erro ao editar ficha")}
            show={showErrorAlert}
          />
        </div>
      )}
    </div>
  );
}

export default OrtopedicaSteps;