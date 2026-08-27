import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';

import Neurologica from "./NeurologicaPostura";
import Neurologica2 from "./NeurologicaNervos";
import Neurologica3 from "./NeurologicaDiagnostico";
import NeurologicaPDF from './NeurologicaPDF';

import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";

import { getCurrentUsuario } from '../../../../services/userService';
import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getAnimalById } from "../../../../services/animalService";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getMedicoById } from "../../../../services/medicoService";

const NUMERIC_SEGMENTAR_FIELDS = [
  "perineal",
  "reflexoCutaneo",
  "reflexoToracicoLateral",
  "tonoDaCalda",
  "miccao",
];

const getFirstLegacyValue = (value) => {
  if (!value || typeof value !== "object") return "";
  const keys = ["MTD", "MTE", "MPD", "MPE"];
  for (const key of keys) {
    const item = value[key];
    if (item !== undefined && item !== null && String(item).trim() !== "") {
      return String(item).trim();
    }
  }
  return "";
};

const normalizeNumericSegmentarValue = (value) => {
  if (value === undefined || value === null) return "";
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  const bounded = Math.min(4, Math.max(0, Number(digits[0])));
  return String(bounded);
};

const normalizeNeurologicaFormData = (data) => {
  if (!data || typeof data !== "object") return data;
  const normalized = JSON.parse(JSON.stringify(data));
  const reflexosSegmentares = normalized.reflexosSegmentares || {};

  normalized.reflexosSegmentares = {
    ...reflexosSegmentares,
    patelar: {
      MPD: reflexosSegmentares?.patelar?.MPD ?? "",
      MPE: reflexosSegmentares?.patelar?.MPE ?? "",
    },
  };

  for (const field of NUMERIC_SEGMENTAR_FIELDS) {
    const currentValue = reflexosSegmentares[field];
    const sourceValue =
      currentValue && typeof currentValue === "object"
        ? getFirstLegacyValue(currentValue)
        : currentValue;
    normalized.reflexosSegmentares[field] = normalizeNumericSegmentarValue(sourceValue);
  }

  return normalized;
};

// Dynamic import fora do componente
const PDFLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), 
  { ssr: false }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
  <button type="button" className={styles.green_buttonFichas} style={{ width: 'auto', padding: '0 1.5rem' }}>
    <PDFLink 
      document={<NeurologicaPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} 
      fileName={`FichaNeurologica_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`} 
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function NeurologicaSteps() {
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
    nivelConsciencia: "",
    resultadoExame: "",
    postura: [],
    descricaoLocomocao: [],
    tipoAtaxia: [],
    andarCompulsivo: "",

    // página 2
    nervosCranianos: {
      ameaca: { Esq: "", Dir: "" },
      tamanhoSimetria: { Esq: "", Dir: "" },
      reflexoPupilar: { Esq: "", Dir: "" },
      posturaOcular: { Esq: "", Dir: "" },
      reflexoOculocefalico: { Esq: "", Dir: "" },
      nistagmoPatologico: { Esq: "", Dir: "" },
      reflexoPalpebral: { Esq: "", Dir: "" },
      sensibilidadeNasal: { Esq: "", Dir: "" },
      historicoDisfoniaDisfagia: { Esq: "", Dir: "" },
      simetriaLingua: { Esq: "", Dir: "" },
      estrabismoPosicional: { Esq: "", Dir: "" },
      simetriaFace: { Esq: "", Dir: "" }
    },
    reacoesPosturais: {
      propriocepcaoConsciente: { MTD: "", MTE: "", MPD: "", MPE: "" },
      saltitar: { MTD: "", MTE: "", MPD: "", MPE: "" },
      posicionamentoTatil: { MTD: "", MTE: "", MPD: "", MPE: "" },
      hemiestacao: { MTD: "", MTE: "", MPD: "", MPE: "" },
      hemilocomocao: { MTD: "", MTE: "", MPD: "", MPE: "" },
      carrinhoDeMao: { MTD: "", MTE: "", MPD: "", MPE: "" },
      correcaoTatil: { MTD: "", MTE: "", MPD: "", MPE: "" }
    },
    reflexosSegmentares: {
      tonoMuscular: { MTD: "", MTE: "", MPD: "", MPE: "" },
      patelar: { MPD: "", MPE: "" },
      flexor: { MTD: "", MTE: "", MPD: "", MPE: "" },
      perineal: "",
      reflexoCutaneo: "",
      reflexoToracicoLateral: "",
      tonoDaCalda: "",
      miccao: "",
    },
    avaliacaoSensitiva: {
      palpacaoEpaxial: "",
      dorCervical: "",
      sensibilidadeDosMembros: ""
    },

    // página 3
    diagnosticoAnatomico: {
      localLesao: [],
      subniveisMedula: [],
      nervoPeriferico: "",
      suspeitasClinicas: "",
      examesComplementares: "",
      prognostico: "",
      diagnostico: "",
      tratamento: "",
    },
    plantonistasDiscentes: "",
    medicosResponsaveis: ""
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
          setFormData(normalizeNeurologicaFormData(parsedConteudo));
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
    const fieldNames = name.split('.');

    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let currentLevel = newData;
      for (let i = 0; i < fieldNames.length - 1; i++) {
        if (!currentLevel[fieldNames[i]]) {
          currentLevel[fieldNames[i]] = {};
        }
        currentLevel = currentLevel[fieldNames[i]];
      }
      currentLevel[fieldNames[fieldNames.length - 1]] = value;
      return newData;
    });
  };

  const handleCheckboxChange = (event, fieldPath) => {
    const { value, checked } = event.target;
    const keys = fieldPath.split(".");

    setFormData((prev) => {
      const updated = { ...prev };
      let pointer = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        pointer[key] = { ...pointer[key] };
        pointer = pointer[key];
      }

      const finalKey = keys[keys.length - 1];
      const currentArray = pointer[finalKey] || [];

      pointer[finalKey] = checked
        ? [...currentArray, value]
        : currentArray.filter((item) => item !== value);

      if (fieldPath === "diagnosticoAnatomico.localLesao" && value === "Medula espinhal" && !checked) {
        if (pointer.subniveisMedula) {
          pointer.subniveisMedula = [];
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (event) => {
    if (event?.preventDefault) event.preventDefault();
    setShowErrorAlert(false);

    const currentModo = modo || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('modo'));
    const currentFichaId = fichaId || queryFichaId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fichaId'));
    const currentAgendamentoId = agendamentoId || queryAgendamentoId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('agendamentoId'));

    const normalizedFormData = normalizeNeurologicaFormData(formData);
    const dataFormatada = moment(data).isValid() 
      ? moment(data).format("YYYY-MM-DDTHH:mm:ss") 
      : moment().format("YYYY-MM-DDTHH:mm:ss");

    const fichaData = {
      nome: "Ficha clínica neurológica",
      conteudo: {
        nivelConsciencia: normalizedFormData.nivelConsciencia,
        resultadoExame: normalizedFormData.resultadoExame,
        postura: normalizedFormData.postura,
        descricaoLocomocao: normalizedFormData.descricaoLocomocao,
        tipoAtaxia: normalizedFormData.tipoAtaxia,
        andarCompulsivo: normalizedFormData.andarCompulsivo,
        nervosCranianos: normalizedFormData.nervosCranianos,
        reacoesPosturais: normalizedFormData.reacoesPosturais,
        reflexosSegmentares: normalizedFormData.reflexosSegmentares,
        avaliacaoSensitiva: normalizedFormData.avaliacaoSensitiva,
        diagnosticoAnatomico: normalizedFormData.diagnosticoAnatomico,
        plantonistasDiscentes: normalizedFormData.plantonistasDiscentes,
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
          <Neurologica
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case 2:
        return (
          <Neurologica2
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Neurologica3
            formData={formData}
            handleChange={handleChange}
            prevStep={prevStep}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
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

export default NeurologicaSteps;