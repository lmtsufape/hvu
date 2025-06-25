import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cardiologica from "./AtendimentoCardiologico";
import Cardiologica2 from "./ExameFisicoCardiologico";
import Cardiologica3 from "./CardiologicoComplementar";
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { createFicha } from '../../../../services/fichaService';
import { getCurrentUsuario } from '../../../../services/userService';

function CardiologicaSteps() {
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
    antecedentesHistorico: "",

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

    plantonistas: "",
    medicosResponsaveis: "",
  });

  const { medicacoes } = formData;

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedFormData = localStorage.getItem("fichaCardiologicaFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(prev => ({
        ...prev,
        ...parsedData,
        ExameFisico: {
          ...prev.ExameFisico,
          ...parsedData.ExameFisico
        },
        mucosas: {
          ...prev.mucosas,
          ...parsedData.mucosas
        },
        option: {
          ...prev.option,
          ...parsedData.option
        },
        linfonodos: {
          ...prev.linfonodos,
          ...parsedData.linfonodos
        }
      }));
    }
  }
}, []);


  // Salva os dados do formulário no localStorage 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("fichaCardiologicaFormData", JSON.stringify(formData));
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

    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");

    // Criar uma cópia de formData excluindo os campos 'option' e 'opc'
    const { option, opc, ...dadosParaEnviar } = formData;

    const fichaData = {
      nome: "Ficha clínica cardiológica",
      conteudo: {
        "Peso": formData.peso,

        "Vacinação": {
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

        "Alimentação": formData.alimentacao,
        "Estilo de Vida": formData.estiloVida,
        "Contactantes": formData.contactantes,
        "Sinais Clínicos": formData.sinaisClinicos,
        "Antecedentes / Histórico": formData.antecedentesHistorico,

        "Exame Físico": {
          "Postura": formData.ExameFisico.postura,
          "Nível de Consciência": formData.ExameFisico.nivelConsciencia,
          "Temperatura": formData.ExameFisico.temperatura,
          "Score Corporal": formData.ExameFisico.score,
          "ACPs": formData.ExameFisico.acp,
          "Pulso Arterial": formData.ExameFisico.pulsoArterial,
          "Distensão e Pulso": formData.ExameFisico.distencaoEPulso,
          "Respiração": formData.ExameFisico.respiracao,
          "Narinas e Outros": formData.ExameFisico.narinasEOutros,
          "Frequência Cardíaca": formData.ExameFisico.freqCardiaca,
          "Frequência Respiratória": formData.ExameFisico.freqRespiratoria,
          "Abdômen": formData.ExameFisico.abdomem,
          "Hidratação": formData.ExameFisico.hidratacao,
          "TPC": formData.ExameFisico.tpc,
          "Turgor Cutâneo": formData.ExameFisico.turgorCutaneo,
          "Mucosas (geral)": formData.ExameFisico.mucosas,
          "Linfonodos (geral)": formData.ExameFisico.linfonodosGeral,
          "Linfonodos (locais)": formData.ExameFisico.linfonodosLocal
        },

        "Mucosas (detalhado)": {
          "Róseas": formData.mucosas.roseas,
          "Róseas Pálidas": formData.mucosas.roseasPalidas,
          "Porcelânicas": formData.mucosas.porcelanicas,
          "Hiperêmicas": formData.mucosas.hiperemicas,
          "Cianóticas": formData.mucosas.cianoticas,
          "Ictéricas": formData.mucosas.ictaricas,
          "Não Avaliado": formData.mucosas.naoAvaliado
        },

        "Linfonodos": formData.linfonodos,

        "Exames Complementares": {
          "Exames Anteriores": formData.ExamesComplementares.examesAnteriores
        },

        "Diagnóstico": formData.diagnostico,

        "Medicações": formData.medicacoes,

        "Plantonistas": formData.plantonistas,
        "Médicos Responsáveis": formData.medicosResponsaveis
      },
      dataHora: dataFormatada,
    };

    try {
      const resultado = await createFicha(fichaData);
      localStorage.setItem('fichaId', resultado.id.toString());
      localStorage.removeItem("fichaCardiologicaFormData");
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar ficha:", error);
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

  const cleanLocalStorage = () => {
    localStorage.removeItem("fichaCardiologicaFormData");
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Cardiologica
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            handleCheckboxChange={handleCheckboxChange}
            cleanLocalStorage={cleanLocalStorage}
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
                <Alert message="Ficha criada com sucesso!"
                  show={showAlert} url={`/createConsulta/${consultaId}`} />
              </div>}
            {showErrorAlert &&
              <div className={styles.alert}>
                <ErrorAlert message={errorMessage || "Erro ao criar ficha"}
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

export default CardiologicaSteps;