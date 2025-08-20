import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Step1ClinicaMedica from "./ExameFisicoGeral";    
import Step2ClinicaMedica from "./ExameFisicoSistema";

import styles from "./index.module.css";
import Alert       from "@/components/Alert";
import ErrorAlert  from "@/components/ErrorAlert";

import moment                 from "moment";
import { getCurrentUsuario }  from "../../../../services/userService";
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";

/* ─────────────────────────────────────────────────────────────── */

function UpdateClinicaMedicaSteps() {
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
    const [data, setData] = useState([]);
    const [fichaId, setFichaId] = useState(null);
    const { id, modo } = router.query; 
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [animalId, setAnimalId] = useState(null);
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

  useEffect(() => {
        // Se o modo for 'visualizar', define o estado para somente leitura
        if (modo === 'visualizar') {
            setIsReadOnly(true);
        }
    }, [modo]);

  // Obtém o ID da ficha da URL
  useEffect(() => {
    if (router.isReady) {
        const id = router.query.consultaId;
        const ficha = router.query.fichaId;
        const aId = router.query.agendamentoId;
        if (id) {
          setConsultaId(id);
        }
        if (ficha) {
          setFichaId(ficha);
        }
        if (aId) {
          setAgendamentoId(aId);
        }
    }
  }, [router.isReady, router.query.fichaId]);

    useEffect(() => {
    if (!fichaId) return;

  const fetchData = async () => {
      try {
        const formData = await getFichaById(fichaId);
        setFormData(JSON.parse(formData.conteudo));
        setData(formData.dataHora);
      } catch (error) {
          console.error('Erro ao buscar data da ficha:', error);
      } finally {
          setLoading(false);
      }
  };
    fetchData();
  }, [fichaId]);

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
      conteudo: { ...formData },
      dataHora: moment(data).format("YYYY-MM-DDTHH:mm:ss"),
      agendamento: { id: Number(agendamentoId) }
    };

    console.log("➡️  Enviando para a API:", fichaData);

    try {
      await updateFicha(fichaData, fichaId);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao editar ficha:", error);
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
            message="Ficha editada com sucesso!"
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

export default UpdateClinicaMedicaSteps;
