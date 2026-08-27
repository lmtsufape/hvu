import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from "moment";

import Step1ClinicaMedica from "./ExameFisicoGeral";    
import Step2ClinicaMedica from "./ExameFisicoSistema";
import ClinicaMedicaPDF from './ClinicaMedicaPDF';

import styles from "./index.module.css";
import Alert from "@/components/Alert";
import ErrorAlert from "@/components/ErrorAlert";

import { getCurrentUsuario } from "../../../../services/userService";
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
      document={<ClinicaMedicaPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} 
      fileName={`FichaClinicaMedica_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`} 
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function UpdateClinicaMedicaSteps() {
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
  const [data, setData] = useState("");
  const [fichaId, setFichaId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [animalId, setAnimalId] = useState(null);
  const [agendamentoId, setAgendamentoId] = useState(null);

  const [animal, setAnimal] = useState({});
  const [tutor, setTutor] = useState({});
  const [medicoLogado, setMedicoLogado] = useState(null);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const [formData, setFormData] = useState({
    queixaPrincipal: "",
    HistoricoMedico: {
      progresso: "",
    },
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
    vermifugacaoDetalhes: {
      vermifugacao: '',
      produto: '',
      data: '',
    },
    ectoparasitosDetalhes: {
      ectoparasitos: '',
      produto: '',
      data: '',
    },
    tpc: "",
    turgorCutaneo: "",
    freqCardiaca: "",
    freqRespiratoria: "",
    observacoes: "",
    ExameFisico: {
      alimentacao: "",
      postura: "",
      temperatura: "",
      score: "",
      freqCardiaca: "",
      freqRespiratoria: "",
      hidratacao: "",
      tpc: "",
      turgor: "",
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
    fisicogeral: {},
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
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") ?? "");
      setRoles(JSON.parse(localStorage.getItem("roles") ?? "[]"));
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
          setFormData(typeof formDataResponse.conteudo === 'string'
            ? JSON.parse(formDataResponse.conteudo)
            : formDataResponse.conteudo);
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
    const loadUser = async () => {
      try {
        await getCurrentUsuario();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) return <p>Carregando…</p>;
  if (!token) return <p>Acesso negado – faça login.</p>;
  if (!roles.includes("medico") && !roles.includes("patologista")) return <p>Acesso negado – sem permissão.</p>;

  const handleChange = ({ target: { name, value } }) => {
    const path = name.split(".");
    setFormData((prev) => {
      const clone = structuredClone(prev);
      let ref = clone;
      for (let i = 0; i < path.length - 1; i++) {
        if (!ref[path[i]]) ref[path[i]] = {};
        ref = ref[path[i]];
      }
      ref[path.at(-1)] = value;
      return clone;
    });
  };

  const handleChangeAtualizaSelect = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

  const handleChangeSelect = (e) => {
    setFormData((prev) => ({
      ...prev,
      tipo: {
        ...prev.tipo,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleCheckboxChange = ({ target: { value, checked } }, path) => {
    setFormData((prev) => {
      const clone = structuredClone(prev);
      const keys = path.split(".");
      const leaf = keys.pop();
      const ref = keys.reduce((acc, k) => acc[k], clone);
      const arr = ref[leaf] ?? [];
      ref[leaf] = checked ? [...arr, value] : arr.filter((v) => v !== value);
      return clone;
    });
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

  const handleSubmit = async () => {
    setShowErrorAlert(false);

    const currentModo = modo || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('modo'));
    const currentFichaId = fichaId || queryFichaId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fichaId'));
    const currentAgendamentoId = agendamentoId || queryAgendamentoId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('agendamentoId'));

    const dataFormatada = moment(data).isValid()
      ? moment(data).format("YYYY-MM-DDTHH:mm:ss")
      : moment().format("YYYY-MM-DDTHH:mm:ss");

    const fichaData = {
      nome: "Ficha Clínica Médica",
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
      setErrorMessage(error?.response?.data?.message || error?.response?.data?.error || (currentModo === "criar" || !currentFichaId ? "Erro ao criar ficha" : "Erro ao editar ficha"));
      setShowErrorAlert(true);
    }
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1ClinicaMedica
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            nextStep={nextStep}
            handleCheckboxChangeVacinacao={handleCheckboxChangeVacinacao}
            handleLocationChange={handleLocationChange}
            handleChangeAtualizaSelect={handleChangeAtualizaSelect}
            handleCheckboxChangeMucosas={handleCheckboxChangeMucosas}
            handleLinfonodoChange={handleLinfonodoChange}
            handleCaracteristicaChange={handleCaracteristicaChange}
            handleChangeSelect={handleChangeSelect}
            handleMucosaLocationChange={handleMucosaLocationChange}
          />
        );
      case 2:
        return (
          <Step2ClinicaMedica
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
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
      {renderStep()}
      
      {!loading && animal?.id && tutor?.id && medicoLogado && (
        <DownloadPdfStyledButton
          ficha={formData}
          animal={animal}
          tutor={tutor}
          medicoLogado={medicoLogado}
        />
      )}

      <div className={styles.pagination}>
        {[1, 2].map((p) => (
          <button
            key={p}
            className={styles.pageButton}
            onClick={() => setStep(p)}
            disabled={p === step}
          >
            {p}
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

export default UpdateClinicaMedicaSteps;