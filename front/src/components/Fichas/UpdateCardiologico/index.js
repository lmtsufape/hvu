import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';

import Cardiologica from "./AtendimentoCardiologico";
import Cardiologica2 from "./ExameFisicoCardiologico";
import Cardiologica3 from "./CardiologicoComplementar";
import CardiologicaPDF from './CardiologicaPDF';

import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";

import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getCurrentUsuario } from '../../../../services/userService';
import { getAnimalById } from "../../../../services/animalService";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getMedicoById } from "../../../../services/medicoService";

const PDFLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), 
  { ssr: false }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
  <button type="button" className={styles.green_buttonFichas} style={{ width: 'auto', padding: '0 1.5rem' }}>
    <PDFLink 
      document={<CardiologicaPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} 
      fileName={`FichaCardiologica_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`} 
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

export default function UpdateCardiologicaSteps() {
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
    peso: "",
    opc: {
      antiRabica: false,
      giardia: false,
      leishmaniose: false,
      tosseDosCanis: false,
      polivalenteCanina: false,
      polivalenteFelina: false,
      outros: false,
      naoVacinado: false,
      naoInformado: false,
    },
    vacinacao: {
      antiRabica: "",
      giardia: "",
      leishmaniose: "",
      tosseDosCanis: "",
      polivalenteCanina: "",
      polivalenteFelina: "",
      outros: "",
      naoVacinado: "",
      naoInformado: "",
    },
    alimentacao: "",
    estiloVida: "",
    contactantes: "",
    sinaisClinicos: [],
    antecedentesHistorico: "",
    ExameFisico: {
      postura: "",
      nivelConsciencia: "",
      temperatura: "",
      score: "",
      acp: "",
      pulsoArterial: "",
      distencaoEPulso: "",
      respiracao: "",
      narinasEOutros: "",
      freqCardiaca: "",
      freqRespiratoria: "",
      abdomem: "",
      hidratacao: "",
      tpc: "",
      turgorCutaneo: "",
      mucosas: "",
      linfonodosGeral: "",
      linfonodosLocal: []
    },
    option: {
      roseas: false,
      roseasPalidas: false,
      porcelanicas: false,
      hiperemicas: false,
      cianoticas: false,
      ictaricas: false,
      naoAvaliado: false
    },
    mucosas: {
      roseas: "",
      roseasPalidas: "",
      porcelanicas: "",
      hiperemicas: "",
      cianoticas: "",
      ictaricas: "",
      naoAvaliado: ""
    },
    linfonodos: {},
    ExamesComplementares: {
      examesAnteriores: "",
    },
    diagnostico: {},
    medicacoes: [{ medicacao: "", dose: "", frequencia: "", periodo: "" }],
    plantonistas: "",
    medicosResponsaveis: "",
  });

  const { medicacoes = [] } = formData;

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
      setToken(localStorage.getItem('token') || "");
      setRoles(JSON.parse(localStorage.getItem('roles') || "[]"));
    }
  }, []);

  useEffect(() => {
    if (!animalId) return;

    const fetchDataForPDF = async () => {
      try {
        const [animalData, tutorData, userData] = await Promise.all([
          getAnimalById(animalId),
          getTutorByAnimal(animalId),
          getCurrentUsuario()
        ]);
        setAnimal(animalData || {});
        setTutor(tutorData || {});
        if (userData?.usuario?.id) {
          const medicoData = await getMedicoById(userData.usuario.id);
          setMedicoLogado(medicoData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados para cabeçalho/PDF:', error);
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
        const fichaResponse = await getFichaById(fichaId);
        if (fichaResponse?.conteudo) {
          setFormData(typeof fichaResponse.conteudo === 'string'
            ? JSON.parse(fichaResponse.conteudo)
            : fichaResponse.conteudo);
        }
        setData(fichaResponse?.dataHora);
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
    const { name, value, type, checked } = event.target;
    const finalValue = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const path = name.split('.');
      setFormData((prev) => {
        const clone = structuredClone(prev);
        let ref = clone;
        for (let i = 0; i < path.length - 1; i++) {
          if (!ref[path[i]]) ref[path[i]] = {};
          ref = ref[path[i]];
        }
        ref[path[path.length - 1]] = finalValue;
        return clone;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: finalValue
      }));
    }
  };

  const handleCheckboxChange = (event, field) => {
    const { value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (event) => {
    if (event?.preventDefault) event.preventDefault();
    setShowErrorAlert(false);

    const currentModo = router.query.modo || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('modo'));
    const currentFichaId = fichaId || router.query.fichaId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fichaId'));
    const currentAgendamentoId = agendamentoId || router.query.agendamentoId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('agendamentoId'));

    const dataFormatada = moment(data).isValid()
      ? moment(data).format("YYYY-MM-DDTHH:mm:ss")
      : moment().format("YYYY-MM-DDTHH:mm:ss");

    const fichaData = {
      nome: "Ficha clínica cardiológica",
      conteudo: { ...formData },
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

  const handleCheckboxChangeVacinacao = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      opc: {
        ...prevState.opc,
        [name]: checked
      }
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      vacinacao: {
        ...prevState.vacinacao,
        [name]: value
      }
    }));
  };

  const handleChangeAtualizaSelect = (e) => {
    const { name, value } = e.target;
    const path = name.split(".");

    setFormData((prevData) => {
      const clone = structuredClone(prevData);
      let ref = clone;
      for (let i = 0; i < path.length - 1; i++) {
        if (!ref[path[i]]) ref[path[i]] = {};
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return clone;
    });
  };

  const handleCheckboxChangeMucosas = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      option: {
        ...prevState.option,
        [name]: checked
      }
    }));
  };

  const handleLinfonodoChange = (e, linfonodo) => {
    const { checked } = e.target;
    setFormData((prevState) => {
      const updatedLinfonodos = { ...prevState.linfonodos };
      if (checked) {
        updatedLinfonodos[linfonodo] = [];
      } else {
        delete updatedLinfonodos[linfonodo];
      }
      return {
        ...prevState,
        linfonodos: updatedLinfonodos
      };
    });
  };

  const handleCaracteristicaChange = (e, linfonodo) => {
    const { name, checked } = e.target;
    setFormData((prevState) => {
      const currentValues = prevState.linfonodos?.[linfonodo] || [];
      let nextValues = checked
        ? [...currentValues, name]
        : currentValues.filter((item) => item !== name);

      if (name === "reativos" && checked) {
        nextValues = nextValues.filter((item) => item !== "semAlteracao");
      }
      if (name === "semAlteracao" && checked) {
        nextValues = nextValues.filter((item) => item !== "reativos");
      }

      return {
        ...prevState,
        linfonodos: {
          ...prevState.linfonodos,
          [linfonodo]: nextValues
        }
      };
    });
  };

  const handleMucosaLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      mucosas: {
        ...prevState.mucosas,
        [name]: value,
      },
    }));
  };

  const handleChangeTratamentos = (index, campo, valor) => {
    setFormData((prev) => {
      const novosTratamentos = [...prev.medicacoes];
      novosTratamentos[index][campo] = valor;
      return {
        ...prev,
        medicacoes: novosTratamentos
      };
    });
  };

  const adicionarLinhaTratamento = () => {
    setFormData((prev) => ({
      ...prev,
      medicacoes: [
        ...(prev.medicacoes || []),
        { medicacao: "", dose: "", frequencia: "", periodo: "" }
      ]
    }));
  };

  const removerUltimaLinhaTratamento = () => {
    setFormData((prev) => {
      if (prev.medicacoes?.length > 1) {
        return {
          ...prev,
          medicacoes: prev.medicacoes.slice(0, -1),
        };
      }
      return prev;
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Cardiologica
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            handleCheckboxChange={handleCheckboxChange}
            handleCheckboxChangeVacinacao={handleCheckboxChangeVacinacao}
            handleLocationChange={handleLocationChange}
          />
        );
      case 2:
        return (
          <Cardiologica2
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
            handleCheckboxChange={handleCheckboxChange}
            handleChangeAtualizaSelect={handleChangeAtualizaSelect}
            handleCheckboxChangeMucosas={handleCheckboxChangeMucosas}
            handleLinfonodoChange={handleLinfonodoChange}
            handleCaracteristicaChange={handleCaracteristicaChange}
            handleMucosaLocationChange={handleMucosaLocationChange}
          />
        );
      case 3:
        return (
          <Cardiologica3
            formData={formData}
            handleChange={handleChange}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            handleChangeTratamentos={handleChangeTratamentos}
            adicionarLinhaTratamento={adicionarLinhaTratamento}
            removerUltimaLinhaTratamento={removerUltimaLinhaTratamento}
            medicacoes={medicacoes}
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