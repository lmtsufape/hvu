import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cardiologica from "./AtendimentoCardiologico";
import Cardiologica2 from "./ExameFisicoCardiologico";
import Cardiologica3 from "./CardiologicoComplementar";
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";
import { getCurrentUsuario } from '../../../../services/userService';

function UpdateCardiologicaSteps() {
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
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState([]);
  const router = useRouter();
  const { id, modo } = router.query; 
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [formData, setFormData] = useState({

    // página 1
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
    antecedentesHistorico:"",

    // página 2
    
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
    //página 3
    ExamesComplementares: {
      examesAnteriores: "",
    },

    diagnostico: {},
    medicacoes: [{ medicacao: "", dose: "", frequencia: "", periodo: "" }],

    plantonistas:"",
    medicosResponsaveis:"",
  });

    const { medicacoes } = formData;

    // Obtém o ID da ficha da URL
    useEffect(() => {
      if (router.isReady) {
          const id = router.query.consultaId;
          const ficha = router.query.fichaId;
          if (id) {
            setConsultaId(id);
          }
          if (ficha) {
            setFichaId(ficha);
          }
      }
    }, [router.isReady, router.query.consultaId]);

    useEffect(() => {
    if (!fichaId) return;

    const fetchData = async () => {
        try {
            const formData = await getFichaById(fichaId);
            setFormData(JSON.parse(formData.conteudo));
            setData(formData.dataHora);
        } catch (error) {
            console.error('Erro ao buscar dados da ficha:', error);
        } finally {
            setLoading(false);
        }
    };

        fetchData();
    }, [fichaId]);

  useEffect(() => {
      if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('token');
          const storedRoles = JSON.parse(localStorage.getItem('roles'));
          setToken(storedToken || "");
          setRoles(storedRoles || []);
      }
      }, []);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const userData = await getCurrentUsuario();
              setUserId(userData.usuario.id);
          } catch (error) {
              console.error('Erro ao buscar usuário:', error);
          } finally {
              setLoading(false); // Marcar como carregado após buscar os dados
          }
      };
      fetchData();
  }, []);

  // Verifica se os dados estão carregando
  if (loading) {
      return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  // Verifica se o usuário tem permissão
  if (!roles.includes("medico")) {
      return (
          <div className={styles.container}>
              <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
          </div>
      );
  }    

  if (!token) {
      return (
          <div className={styles.container}>
              <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
          </div>
      );
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    const finalValue = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const path = name.split('.');
      setFormData(prev => {
        const clone = JSON.parse(JSON.stringify(prev));
        let ref = clone;
        
        for (let i = 0; i < path.length - 1; i++) {
          if (!ref[path[i]]) ref[path[i]] = {};
          ref = ref[path[i]];
        }
        
        ref[path[path.length - 1]] = finalValue;
        return clone;
      });
    } else {
      setFormData(prev => ({
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
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };
  

  const handleSubmit = async (event) => {

  setShowErrorAlert(false);

  const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss");

  // Criar uma cópia de formData excluindo os campos 'option' e 'opc'
  const { option, opc, ...dadosParaEnviar } = formData;

  const fichaData = {
    nome: "Ficha clínica cardiológica",
    conteudo: dadosParaEnviar, // Envia apenas os dados relevantes
    dataHora: dataFormatada,
  };

  try {
    await updateFicha(fichaData, fichaId);
    setShowAlert(true);
  } catch (error) {
    console.error("Erro ao editar ficha:", error);
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
    const clone = JSON.parse(JSON.stringify(prevData));
    let ref = clone;
    for (let i = 0; i < path.length - 1; i++) {
      if (!ref[path[i]]) ref[path[i]] = {};
      ref = ref[path[i]];
    }
    ref[path[path.length - 1]] = value;
    return clone;
  });
};


  const handleSinalChange = (e, sinalClinico) => {
    const { checked } = e.target;
    setFormData((prevState) => {
      const updatedSinaisClinicos = { ...prevState.sinalClinico };
      if (checked) {
        updatedSinaisClinicos[sinalClinico] = []; // Adiciona o linfonodo com array vazio
      } else {
        delete updatedSinaisClinicos[sinalClinico]; // Remove o linfonodo ao desmarcar
      }
      return {
        ...prevState,
        sinaisClinicos: updatedSinaisClinicos
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

  const renderStepContent = () => {
    switch(step) {
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
          <>
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
          </>
        );
      case 3:
        return (
          <>
          {showAlert && consultaId &&
          <div className={styles.alert}>
            <Alert message="Ficha ediatada com sucesso!" 
            show={showAlert} url={`/createConsulta/${consultaId}`} />
          </div>}
          {showErrorAlert && 
          <div className={styles.alert}>
            <ErrorAlert message={errorMessage || "Erro ao editar ficha"} 
            show={showErrorAlert} />
          </div>}

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
          </>
        );
    }
  }
  return (
    <div className={styles.container}>
      {renderStepContent()}

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
    </div>
  );
}

export default UpdateCardiologicaSteps;