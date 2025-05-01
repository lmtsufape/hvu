import { useState, useEffect } from 'react';
import Cardiologica from "./AtendimentoCardiologico";
import Cardiologica2 from "./CardiologicoComplementar";
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

  const [formData, setFormData] = useState({

    // página 1
    anamnese: [],
    exameFisico: {
        nivelConsciencia: "",
        atitudePostura: "",
        acp: "",
        pulsoArterial: "",
        distensaoPulsoJugular: "",
        fc: "",
        fr: "",
        respiracao: "",
        mucosas: "",
        tpc: "",
        hidratacao: "",
        narinasTraqueiaTireoide: "",
        abdome: ""
    },
    antecedentesHistorico:"",

    // página 2
    afericaoPressao: {
        metodoUtilizado: [],
        tamanhoManguito: "",
        numeroAfericoes: "",
        comportamentoPaciente: "",
        classificacaoPressao: [],
        conclusoes: ""
    },
    eletrocardiograma: {
        ritmo: "",
        fc: "",
        eixoOndaP: "",
        eixoQRS: "",
        duracaoP: "",
        amplitudeP: "",
        intervaloPR: "",
        duracaoQRS: "",
        amplitudeR: "",
        intervaloQT: "",
        desnivelST: "",
        amplitudeT: "",
        conclusoes: ""
    },
    ecocardiograma:{
        aeAo: "",
        divEdn: "",
        divEs: "",
        fs: "",
        fe: "",
        mapse: "",
        eSepto: "",
        tapse: "",
        fluxoTransmitral: "",
        eTriv: "",
        aortico: "",
        pulmonar: "",
        velELateral: "",
        velALateral: "",
        velESeptal: "",
        velASeptal: "",
        eeLinha: "",
        tricuspide: "",
        gpvd: "",
        indiceDistensibilidadeRdpa: ""
    },
    conclusoes: "",
    examesAnteriores: "",
    diagnosticoPrognostico: "",
    tratamentoInstituido: "",
    plantonistasDiscentes:""
  });

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
    const { name, value } = event.target;
    const path = name.split(".");
  
    setFormData((prev) => {
      const updated = structuredClone(prev); 
      let current = updated;
  
      for (let i = 0; i < path.length - 1; i++) {
        if (!(path[i] in current)) current[path[i]] = {};
        current = current[path[i]];
      }
  
      current[path[path.length - 1]] = value;
  
      return updated;
    });
  };
  

  const handleCheckboxChange = (e, path) => {
    const { value, checked } = e.target;
  
    setFormData((prev) => {
      const updated = structuredClone(prev); // cópia profunda segura
      const keys = path.split(".");
      const lastKey = keys.pop();
  
      // Navega até o último objeto antes da propriedade
      const target = keys.reduce((acc, key) => acc[key], updated);
  
      const array = target[lastKey] || [];
  
      target[lastKey] = checked
        ? [...array, value]
        : array.filter((item) => item !== value);
  
      return updated;
    });
  };
  

  const handleSubmit = async (event) => {
    setShowErrorAlert(false);
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); 
    const fichaData = {
        nome: "Ficha clínica cardiológica",  
        conteudo:{
            antecedentes: formData.antecedentesHistorico,
            exameFisico: formData.exameFisico,
            anamnese: formData.anamnese,

            afericaoPressao: formData.afericaoPressao,
            eletrocardiograma: formData.eletrocardiograma,
            ecocardiograma: formData.ecocardiograma,
            conclusoes: formData.conclusoes,
            examesAnteriores: formData.examesAnteriores,
            diagnosticoPrognostico: formData.diagnosticoPrognostico,
            tratamentoInstituido: formData.tratamentoInstituido,
            plantonistasDiscentes: formData.plantonistasDiscentes
        },
        dataHora: dataFormatada 
    };

    try {
        console.log("Formulário válido. Dados prontos para envio:", formData);
        await createFicha(fichaData);
        setShowAlert(true);
    } catch (error) {
        console.error("Erro ao criar ficha:", error);
        setShowErrorAlert(true);
    }
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
          />
        );
      case 2:
      return (
        <>
        {showAlert && 
        <div className={styles.alert}>
          <Alert message="Ficha criada com sucesso!" 
          show={showAlert} url={`/fichaCardiologica`} />
        </div>}
        {showErrorAlert && 
        <div className={styles.alert}>
          <ErrorAlert message={errorMessage || "Erro ao criar ficha"} 
          show={showErrorAlert} />
        </div>}

          <Cardiologica2
          formData={formData} 
          handleChange={handleChange} 
          prevStep={prevStep}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmit}
          />
        </>
      );
    }
  }
  return (
    <div className={styles.container}>
      {renderStepContent()}

      <div className={styles.pagination}>
        {[1, 2].map((page) => (
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