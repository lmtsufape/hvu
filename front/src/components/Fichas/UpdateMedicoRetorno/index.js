import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { getCurrentUsuario } from "../../../../services/userService";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from "moment";
import ClinicaMedicaRetornoStep1 from "./AnamneseRetorno";
import ClinicaMedicaRetornoStep2 from "./ExameFisicoSistemaRetorno"
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";
import dynamic from 'next/dynamic';
import ClinicaMedicaRetornoPDF from './ClinicaMedicaRetornoPDF';
import { getAnimalById } from "../../../../services/animalService";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getMedicoById } from "../../../../services/medicoService";


function FichaMedicaRetorno() {
  const router = useRouter();

    const PDFLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), { ssr: false });
    const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
        <button type="button" className={styles.green_buttonFichas} style={{width: 'auto', padding: '0 1.5rem'}}>
            <PDFLink document={<ClinicaMedicaRetornoPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} fileName={`FichaClinicaRetorno_${animal.nome?.replace(/\s/g, '_')}.pdf`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
            </PDFLink>
        </button>
    );

    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [tutor, setTutor] = useState({});
    const [medicoLogado, setMedicoLogado] = useState(null);

    useEffect(() => { if (router.isReady) { setAnimalId(router.query.animalId); } }, [router.isReady, router.query.animalId]);

    useEffect(() => {
        const fetchDataForPDF = async () => {
            if (!animalId) return;
            try {
                const [animalData, tutorData, userData] = await Promise.all([getAnimalById(animalId), getTutorByAnimal(animalId), getCurrentUsuario()]);
                setAnimal(animalData);
                setTutor(tutorData);
                if (userData?.usuario?.id) {
                    const medicoData = await getMedicoById(userData.usuario.id);
                    setMedicoLogado(medicoData);
                }
            } catch (error) { console.error('Erro ao buscar dados para o PDF:', error); }
        };
        fetchDataForPDF();
    }, [animalId]);

  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [consultaId, setConsultaId] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState([]);
  const [agendamentoId, setAgendamentoId] = useState(null);

  const [formData, setFormData] = useState({
    // página 1
    peso: "",
    anamneseHistoricoClinico: "",
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
        nivelConsciencia: "",
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
      plantonistas:"",
      medicosResponsaveis:"",
  });

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
            console.error('Erro ao buscar dados da ficha:', error);
        } finally {
            setLoading(false);
        }
    };
        fetchData();
    }, [fichaId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRoles = JSON.parse(localStorage.getItem("roles"));
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
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!roles.includes("medico") && !roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>
          Acesso negado: Você não tem permissão para acessar esta página.
        </h3>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>
          Acesso negado: Faça login para acessar esta página.
        </h3>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event?.preventDefault(); // Usa encadeamento opcional para evitar erro
    const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss");
    const fichaData = {
      nome: "Ficha clínico médica de retorno",
      conteudo: {
        ...formData
      },
      dataHora: dataFormatada,
      agendamento: { id: Number(agendamentoId) }
    };

    try {
        await updateFicha(fichaData, fichaId);
        setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar ficha:", error);
      if (error.response && error.response.data && error.response.data.code) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erro ao criar ficha");
      }
      setShowErrorAlert(true);
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

  const handleChangeSelect = (e) => {
      setFormData({
        ...formData,
        tipo: {
          ...formData.tipo,
          [e.target.name]: e.target.value
        }
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

  const renderStep = () => {
    switch (step) {
        case 1:
            return (
                <ClinicaMedicaRetornoStep1
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
                <ClinicaMedicaRetornoStep2
                    formData={formData}
                    setFormData={setFormData}
                    handleChange={handleChange}
                    handleCheckboxChange={handleCheckboxChange}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit}
                />
            );
        default:
            return null;
    }
  };

  return (
    <div className={styles.container}>
        {renderStep()}

        <div className={styles.footerControls}>
            {!loading && animal.id && tutor.id && medicoLogado && (
                <DownloadPdfStyledButton ficha={formData} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />
            )}
        </div>

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

        {showAlert && consultaId && (
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

export default FichaMedicaRetorno;