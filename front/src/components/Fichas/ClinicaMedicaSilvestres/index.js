import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Step1ClinicaMedica from "./dadosClinicaMedicaUm";    
import Step2ClinicaMedica from "./dadosClinicaMedicaDois";
import Step3ClinicaMedica from "./diagnosticoTratamento";

import styles from "./index.module.css";
import Alert       from "@/components/Alert";
import ErrorAlert  from "@/components/ErrorAlert";

import moment                 from "moment";
import { createFicha } from '../../../../services/fichaService';
import { getCurrentUsuario }  from "../../../../services/userService";

/* ─────────────────────────────────────────────────────────────── */

function ClinicaMedicaSilvestresSteps() {
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
    const [agendamentoId, setAgendamentoId] = useState(null);

  /* dados do formulário (pág. 1 + pág. 2) */
  const [formData, setFormData] = useState({
    /* ------------- passo 1 ------------- */
    queixaPrincipal: "",
    HistoricoMedico: {
      progresso: "",
      // vacinação: "",
      // vacinasSelecionadas: [],
      // vermifugação: "",
      // produtoVermifugação: "",
      // dataVacinação: "",
      // dataVermifugação: "",
      // ectoparasitas: "",
      // produtoEctoparasitas: "",
      // dataEctoparasitas: "",
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
          const savedFormData = localStorage.getItem("fichaClinicaMedicaSilvestreFormData");
          if (savedFormData) {
              setFormData(JSON.parse(savedFormData));
          }
      }
  }, []); 

  // Salva os dados do formulário no localStorage 
  useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem("fichaClinicaMedicaSilvestreFormData", JSON.stringify(formData));
      }
  }, [formData]); 

  // Obtém o ID da ficha da URL
  useEffect(() => {
    if (router.isReady) {
        const id = router.query.fichaId;
        const aId = router.query.agendamentoId; // Obtém o ID do agendamento da URL
        if (id) {
        setConsultaId(id);
        console.log("ID da ficha:", id);
        }
        if (aId) {
          setAgendamentoId(aId); // Define o ID do agendamento
        }
    }
  }, [router.isReady, router.query.fichaId]);

  useEffect(() => {
      if (router.isReady) {
        const medicoFromQuery = router.query.medico;
        if (medicoFromQuery) {
          const nomeMedico = decodeURIComponent(medicoFromQuery);

          // 2. ATUALIZA o formData com o nome do médico vindo da URL.
          setFormData(prevData => ({
            ...prevData,
            medicosResponsaveis: nomeMedico 
          }));
        }
      }
    }, [router.isReady, router.query.medico]);

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
  const handleSubmit = async (nomeDoMedicoResponsavel) => {
    const finalFormData = { ...formData, medicosResponsaveis: nomeDoMedicoResponsavel };
    setShowErrorAlert(false);
    const fichaData = {
      nome: "Ficha Clínica Médica (silvestres ou exóticos)",
      conteudo: { ...formData },
      dataHora: moment().format("YYYY-MM-DDTHH:mm:ss"),
      agendamento: {
                id: Number(agendamentoId)
            }
    };

    console.log("➡️  Enviando para a API:", fichaData);

    try {
        const resultado = await createFicha(fichaData);
        localStorage.setItem('fichaId', resultado.id.toString());
        localStorage.removeItem("fichaClinicaMedicaSilvestreFormData");
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
    localStorage.removeItem("fichaClinicaMedicaSilvestreFormData");
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
            nextStep={nextStep}
            handleChangeTratamentos={handleChangeTratamentos}
            adicionarLinhaTratamento={adicionarLinhaTratamento}
            removerUltimaLinhaTratamento={removerUltimaLinhaTratamento}
            medicacoes={medicacoes}

          />
        );
      case 3:
        return(
          <>
          <Step3ClinicaMedica
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
          </>
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
        {[1, 2 ,3].map((p) => (
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

export default ClinicaMedicaSilvestresSteps;
