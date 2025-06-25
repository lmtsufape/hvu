import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Step1ClinicaMedica from "./ExameFisicoGeral";    
import Step2ClinicaMedica from "./ExameFisicoSistema";

import styles from "./index.module.css";
import Alert       from "@/components/Alert";
import ErrorAlert  from "@/components/ErrorAlert";

import moment                 from "moment";
import { createFicha } from '../../../../services/fichaService';
import { getCurrentUsuario }  from "../../../../services/userService";

/* ─────────────────────────────────────────────────────────────── */

function ClinicaMedicaSteps() {
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
    const [consultaId, setConsultaId] = useState(null);
    const router = useRouter();

  /* dados do formulário (pág. 1 + pág. 2) */
  const [formData, setFormData] = useState({
    /* ------------- passo 1 ------------- */
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

    vermifugacaoDetalhes:{
      vermifugacao: '',
      produto: '',
      data: '',
    },
    ectoparasitosDetalhes:{
      ectoparasitos: '',
      produto: '',
      data: '',
    }
    ,
    tpc:"",
    turgorCutaneo:"",
    freqCardiaca:"",
    freqRespiratoria:"",

    
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
    /* ------------- passo 2 ------------- */
    fisicogeral: {},
    diagnostico: {},
    medicacoes: [{ medicacao: "", dose: "", frequencia: "", periodo: "" }],

    plantonistas:"",
    medicosResponsaveis:"",
  });

  /* ─────────────── handlers genéricos ─────────────── */
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
        updatedLinfonodos[linfonodo] = []; // Adiciona o linfonodo com array vazio
      } else {
        delete updatedLinfonodos[linfonodo]; // Remove o linfonodo ao desmarcar
      }
      return {
        ...prevState,
        linfonodos: updatedLinfonodos
      };
    });
  };
  const handleCaracteristicaChange = (e, linfonodo) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      linfonodos: {
        ...prevState.linfonodos,
        [linfonodo]: checked
          ? [...prevState.linfonodos[linfonodo], name]
          : prevState.linfonodos[linfonodo].filter((item) => item !== name)
      }
    }));
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
      setFormData({
        ...formData,
        tipo: {
          ...formData.tipo,
          [e.target.name]: e.target.value
        }
      });
  };
 

  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckboxChange = ({ target: { value, checked } }, path) => {
    setFormData((prev) => {
      const clone = structuredClone(prev);
      const keys  = path.split(".");
      const leaf  = keys.pop();
      const ref   = keys.reduce((acc, k) => acc[k], clone);

      const arr = ref[leaf] ?? [];
      ref[leaf] = checked ? [...arr, value] : arr.filter((v) => v !== value);
      return clone;
    });
  };
  /* ─────────────────────────────────────────────────── */

  // Carrega os dados do formulário do localStorage 
  useEffect(() => {
      if (typeof window !== 'undefined') {
          const savedFormData = localStorage.getItem("fichaClinicaMedicaFormData");
          if (savedFormData) {
              setFormData(JSON.parse(savedFormData));
          }
      }
  }, []); 

  // Salva os dados do formulário no localStorage 
  useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem("fichaClinicaMedicaFormData", JSON.stringify(formData));
      }
  }, [formData]); 

  // Obtém o ID da ficha da URL
  useEffect(() => {
    if (router.isReady) {
        const id = router.query.fichaId;
        if (id) {
        setConsultaId(id);
        console.log("ID da ficha:", id);
        }
    }
  }, [router.isReady, router.query.fichaId]);

  /* carregar token/roles e verificar usuário */
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") ?? "");
      setRoles(JSON.parse(localStorage.getItem("roles") ?? "[]"));
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try { await getCurrentUsuario(); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadUser();
  }, []);

  if (loading)                     return <p>Carregando…</p>;
  if (!token)                      return <p>Acesso negado – faça login.</p>;
  if (!roles.includes("medico"))   return <p>Acesso negado – sem permissão.</p>;

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
  /* envio final */
  const handleSubmit = async () => {
    setShowErrorAlert(false);
    const fichaData = {
      nome: "Ficha Clínica Médica",
      conteudo: { 
        "Queixa Principal": formData.queixaPrincipal,

    "Histórico Médico": {
      "Progresso": formData.HistoricoMedico.progresso
    },

    "Vacinação (Datas)": {
      "Antirrábica": formData.vacinacao.antiRabica,
      "Giárdia": formData.vacinacao.giardia,
      "Leishmaniose": formData.vacinacao.leishmaniose,
      "Tosse dos Canis": formData.vacinacao.tosseDosCanis,
      "Polivalente Canina": formData.vacinacao.polivalenteCanina,
      "Polivalente Felina": formData.vacinacao.polivalenteFelina,
      "Outros": formData.vacinacao.outros,
      "Não Vacinado": formData.vacinacao.naoVacinado,
      "Não Informado": formData.vacinacao.naoInformado
    },

    "Vermifugação": {
      "Vermifugação Realizada": formData.vermifugacaoDetalhes.vermifugacao,
      "Produto Utilizado": formData.vermifugacaoDetalhes.produto,
      "Data": formData.vermifugacaoDetalhes.data
    },

    "Controle de Ectoparasitas": {
      "Ectoparasitas": formData.ectoparasitosDetalhes.ectoparasitos,
      "Produto Utilizado": formData.ectoparasitosDetalhes.produto,
      "Data": formData.ectoparasitosDetalhes.data
    },

    "Sinais Vitais": {
      "TPC": formData.tpc,
      "Turgor Cutâneo": formData.turgorCutaneo,
      "Frequência Cardíaca": formData.freqCardiaca,
      "Frequência Respiratória": formData.freqRespiratoria
    },

    "Exame Físico": {
      "Alimentação": formData.ExameFisico.alimentacao,
      "Postura": formData.ExameFisico.postura,
      "Temperatura": formData.ExameFisico.temperatura,
      "Score Corporal": formData.ExameFisico.score,
      "Frequência Cardíaca": formData.ExameFisico.freqCardiaca,
      "Frequência Respiratória": formData.ExameFisico.freqRespiratoria,
      "Hidratação": formData.ExameFisico.hidratacao,
      "Tempo de Preenchimento Capilar (TPC)": formData.ExameFisico.tpc,
      "Turgor": formData.ExameFisico.turgor,
      "Mucosas": formData.ExameFisico.mucosas,
      "Linfonodos (Geral)": formData.ExameFisico.linfonodosGeral,
      "Linfonodos (Locais)": formData.ExameFisico.linfonodosLocal
    },

    "Mucosas (Descrição)": {
      "Róseas": formData.mucosas.roseas,
      "Róseas Pálidas": formData.mucosas.roseasPalidas,
      "Porcelânicas": formData.mucosas.porcelanicas,
      "Hiperêmicas": formData.mucosas.hiperemicas,
      "Cianóticas": formData.mucosas.cianoticas,
      "Ictéricas": formData.mucosas.ictaricas,
      "Não Avaliado": formData.mucosas.naoAvaliado
    },

    "Linfonodos": formData.linfonodos,

    "Avaliação Física Geral": formData.fisicogeral,

    "Diagnóstico": formData.diagnostico,

    "Medicações Prescritas": formData.medicacoes.map(m => ({
      "Medicação": m.medicacao,
      "Dose": m.dose,
      "Frequência": m.frequencia,
      "Período": m.periodo
    })),

    "Plantonistas": formData.plantonistas,
    "Médicos Responsáveis": formData.medicosResponsaveis
  },
      dataHora: moment().format("YYYY-MM-DDTHH:mm:ss")
    };

    console.log("➡️  Enviando para a API:", fichaData);

    try {
        const resultado = await createFicha(fichaData);
        localStorage.setItem('fichaId', resultado.id.toString());
        localStorage.removeItem("fichaClinicaMedicaFormData");
      setShowAlert(true);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message ?? "");
      setShowErrorAlert(true);
    }
  };

  const { medicacoes } = formData;
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
            ...prev.medicacoes,
            { medicacao: "", dose: "", frequencia: "", periodo: "" }
          ]
        }));
    };

     const removerUltimaLinhaTratamento = () => {
        setFormData((prev) => {
          const tratamentos = prev.medicacoes;
          if (tratamentos.length > 1) {
            return {
              ...prev,
              medicacoes: tratamentos.slice(0, -1),
            };
          }
          return prev;
        });
    };  
    
  const cleanLocalStorage = () => {
    localStorage.removeItem("fichaClinicaMedicaFormData");
  }

  /* renderização de cada página */
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
            cleanLocalStorage={cleanLocalStorage}

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

  /* UI */
  return (
    <div className={styles.container}>
      {renderStep()}

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

      {showAlert && consultaId &&(
        <div className={styles.alert}>
          <Alert
            message="Ficha criada com sucesso!"
            show={showAlert}
            url={`/createConsulta/${consultaId}`}
          />
        </div>
      )}
      {showErrorAlert && (
        <div className={styles.alert}>
          <ErrorAlert
            message={errorMessage || "Erro ao criar ficha"}
            show={showErrorAlert}
          />
        </div>
      )}
    </div>
  );
}

export default ClinicaMedicaSteps;
