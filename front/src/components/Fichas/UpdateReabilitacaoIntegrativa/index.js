import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';

import Reabilitacao from "./ReabilitacaoIntegrativaUm";
import Reabilitacao2 from "./ReabilitacaoIntegrativaDois";
import Reabilitacao3 from "./ReabilitacaoIntegrativaTres";
import ReabilitacaoIntegrativaPDF from './ReabilitacaoIntegrativaPDF';

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
      document={<ReabilitacaoIntegrativaPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} 
      fileName={`FichaReabilitacao_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`} 
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function ReabilitacaoIntegrativaSteps() {
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

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const [formData, setFormData] = useState({
    // página 1
    numeroProntuario: "",
    peso: "",
    queixaPrincipal: "",
    historicoClinico: {
      ortopedico: "",
      neurologico: "",
      oncologico: "",
      outros: "",
    },
    exameClinicoEspecialOrtpedico: {
      palpacaoMembrosArticulacao: "",
      palpacaoColuna: "",
      testeOrtolani: "",
      testeDeGaveta: "",
      testeDeCompressaoTibial: "",
      instabilidadeMedialDeOmbro: "",
      palpacaoDoTendaoBicipital: "",
      avaliacaoDeMassaMuscular: "",
      avaliacaoDaCapacidadeDeMovimento: "",
    },
    exameClinicoEspecialNeurologico: {
      estadoMental: "",
      postura: "",
      locomocao: "",
      nervosCranianos: "",
      reacoesPosturais: "",
      reflexoesSegmentares: "",
      avaliacaoSensitiva: "",
    },
    exameClinicoEspecialOutros: {
      observacoes: "",
    },
    queixaPrincipal2: {
      sinaisClinicos: "",
      primeiraOcorrencia: "",
      evolucao: "",
    },
    medicacaoAdministrada: "",

    // página 2
    sistemaDigestorio: {
      alimentacao: "",
      apetiteDeglutinacao: "",
      tipo: "",
      denticao: "",
      fezes: "",
      obesidade: "",
      ConsumoDeAgua: "",
    },
    sistemaCardiorespiratorio: {
      respiracao: "",
      tosseEspirros: "",
      secrecao: "",
      intoleranciaExercicio: "",
      cardiopatia: "",
      aumentoDeVolume: "",
    },
    sistemaGeniturinario: {
      miccao: "",
      castradoInteiro: "",
      tipo1: "",
      tipo2: "",
    },
    sistemaNervoso: {
      convulsoesDesequilibrios: "",
      alteracoesComportamentais: "",
      nistagmoMioclonias: "",
      dorDeCabeca: "",
      sinaisNeurologicos: "",
    },
    sistemaOsteoarticularLocomotor: {
      posturaMarcha: "",
      claudinacao: "",
      tipo3: "",
      tipo4: "",
    },
    sistemaTegumentarAnexos: {
      tipo5: "",
      tipo6: "",
      odoresSecrecoes: "",
      qualidade: "",
      acusia: "",
      unhas: "",
    },
    sistemaVisual: {
      opacificacaoDeCristalino: "",
      perdaDaVisao: "",
      secrecao2: "",
    },
    manejosGerais: {
      vacinacao: "",
      desverminizacao: "",
      ambiente: "",
      banhos: "",
      contactantes: "",
    },

    // página 3
    sensibilidadePontosMu: "",
    sensibilidadePontosShu: "",
    sensibilidadeDorCorporal: "",
    pulso: "",
    lingua: "",
    perguntasAdicionaisMTC: {
      historicoAncestral: "",
      comportamento: "",
      latidoMiado: "",
      sono: "",
      descricao: "",
    },
    diagnosticoMTC: {
      orgaosSubstacias: "",
      wuXing: "",
      zangFu: "",
    },
    responsavel: "",
    estagiario: "",
    cpf: "",
    medicosResponsaveis: "",
    principios: [],
    constituicaoCorporal: [],
    preferencias: [],
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
        console.error('Erro ao buscar médico:', error);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePreferenciasChange = (event) => {
    const { value, checked } = event.target;
    let updatedPreferencias = formData.preferencias ? [...formData.preferencias] : [];

    if (checked) {
      if (!updatedPreferencias.includes(value)) {
        updatedPreferencias.push(value);
      }
    } else {
      updatedPreferencias = updatedPreferencias.filter(item => item !== value);
    }

    handleChange({
      target: {
        name: "preferencias",
        value: updatedPreferencias,
      },
    });
  };

  const handlePrincipiosChange = (event) => {
    const { value, checked } = event.target;
    let updatedPrincipios = formData.principios ? [...formData.principios] : [];

    if (checked) {
      if (!updatedPrincipios.includes(value)) {
        updatedPrincipios.push(value);
      }
    } else {
      updatedPrincipios = updatedPrincipios.filter(item => item !== value);
    }

    handleChange({
      target: {
        name: "principios",
        value: updatedPrincipios,
      },
    });
  };

  const handleSelectChange = (e, index) => {
    const value = e.target.value;
    setFormData((prevData) => {
      const updatedArray = [...(prevData.constituicaoCorporal || [])];
      updatedArray[index] = value;
      return {
        ...prevData,
        constituicaoCorporal: updatedArray
      };
    });
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
      nome: "Ficha de Reabilitação Integrativa",
      conteudo: {
        numeroProntuario: formData.numeroProntuario,
        peso: formData.peso,
        queixaPrincipal: formData.queixaPrincipal,
        historicoClinico: formData.historicoClinico,
        exameClinicoEspecialOrtpedico: formData.exameClinicoEspecialOrtpedico,
        exameClinicoEspecialNeurologico: formData.exameClinicoEspecialNeurologico,
        exameClinicoEspecialOutros: formData.exameClinicoEspecialOutros,
        queixaPrincipal2: formData.queixaPrincipal2,
        medicacaoAdministrada: formData.medicacaoAdministrada,
        sistemaDigestorio: formData.sistemaDigestorio,
        sistemaCardiorespiratorio: formData.sistemaCardiorespiratorio,
        sistemaGeniturinario: formData.sistemaGeniturinario,
        sistemaNervoso: formData.sistemaNervoso,
        sistemaOsteoarticularLocomotor: formData.sistemaOsteoarticularLocomotor,
        sistemaTegumentarAnexos: formData.sistemaTegumentarAnexos,
        sistemaVisual: formData.sistemaVisual,
        manejosGerais: formData.manejosGerais,
        sensibilidadePontosMu: formData.sensibilidadePontosMu,
        sensibilidadePontosShu: formData.sensibilidadePontosShu,
        sensibilidadeDorCorporal: formData.sensibilidadeDorCorporal,
        pulso: formData.pulso,
        lingua: formData.lingua,
        perguntasAdicionaisMTC: formData.perguntasAdicionaisMTC,
        diagnosticoMTC: formData.diagnosticoMTC,
        medicosResponsaveis: formData.medicosResponsaveis,
        estagiario: formData.estagiario,
        cpf: formData.cpf,
        principios: formData.principios,
        constituicaoCorporal: formData.constituicaoCorporal,
        preferencias: formData.preferencias,
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
    switch (step) {
      case 1:
        return (
          <Reabilitacao 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Reabilitacao2 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Reabilitacao3
            formData={formData} 
            handlePreferenciasChange={handlePreferenciasChange}
            handlePrincipiosChange={handlePrincipiosChange}
            handleChange={handleChange}
            handleRadioAninhado={handleRadioAninhado} 
            handleSubmit={handleSubmit}
            prevStep={prevStep}
            handleSelectChange={handleSelectChange}
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
          <DownloadPdfStyledButton
            ficha={formData}
            animal={animal}
            tutor={tutor}
            medicoLogado={medicoLogado}
          />
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

export default ReabilitacaoIntegrativaSteps;