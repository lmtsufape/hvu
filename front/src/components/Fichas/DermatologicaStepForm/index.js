import { useState, useEffect } from 'react';
import Dermatologica from "./AnamneseFicha";
import Dermatologica2 from "./FisicoFicha";
import Dermatologica3 from "./DermatologicoFicha";
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { createFicha } from '../../../../services/fichaService';
import { getCurrentUsuario } from '../../../../services/userService';

function DermatologicaSteps() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [imagemDesenhada, setImagemDesenhada] = useState(null);

  const [formData, setFormData] = useState({

    // página 1
    ambiente: "",
    estiloVida: "",
    contatoSuperficie: "",
    acessoRua: "",
    conviveComAnimais: "",
    contactantesSintomaticos: "",
    alimentacao: "",
    banhos: "",
    frequenciaBanhos: "",
    produtoUtilizado: "",
    controleEctoparasitas: "",
    ultimaAdministracao: "",
    apresentaEctoparasitas: "",
    quandoVistoUltimaVez: "",
    queixaPrincipal: "",
    tratamento: "",
    tratamentosAtuais: {
        confirmacao: "",
        tipoTratamento: "",
        responsividade: ""
    },
    prurido: "",
    local: [],
    intensidade: "",
    lambedura: "",

    // página 2
    comportamento: "",
    scoreCorporal: "",
    temperatura: "",
    mucosas: "",
    linfonodos: "",
    alteracoesClinicas: "",

    // página 3
    ectoparasitas: "",
    pelagem: "",
    descamacao: "",
    untuosidade: "",
    condutoAuditivoDireito: "",
    condutoAuditivoEsquerdo: "",
    imagemLesao:{
      imagem:"", // string base64 (PNG)
      linhasDesenhadas: [],
    },
    formacoesSolidas: "",
    alteracoesDeCor: "",
    colecoesLiquidas: "",
    alteracoesEspessura: "",
    perdasTeciduais: "",
    descricaoLesional: "",
    criteriosFavrot: [],
    observacao: "",
    diagnostico:{
        presuntivo: "",
        definitivo: ""
    },
    tratamentoDermatologico: [
      { medicacao: "", dose: "", frequencia: "", periodo: ""}
    ],
    medico: ""
  });

  const { tratamentoDermatologico } = formData;

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

    setFormData((prev) => {
        // Verifica se o campo pertence a "tratamentosAtuais"
        if (name.startsWith("tratamentosAtuais.")) {
            const field = name.split(".")[1]; // Extrai "confirmacao", "tipoTratamento" ou "responsividade"
            return {
                ...prev,
                tratamentosAtuais: {
                    ...prev.tratamentosAtuais,
                    [field]: value
                }
            };
        }
        else{    
          const path = name.split(".");
          const updated = structuredClone(prev); 
          let current = updated;
      
          for (let i = 0; i < path.length - 1; i++) {
            if (!(path[i] in current)) current[path[i]] = {};
            current = current[path[i]];
          }
      
          current[path[path.length - 1]] = value;
      
          return updated;
        }
        // Para outros campos, mantém o comportamento padrão
        //return { ...prev, [name]: value };
    });
  };

  const handleChangeTratamentos = (index, campo, valor) => {
    setFormData((prev) => {
      const novosTratamentos = [...prev.tratamentoDermatologico];
      novosTratamentos[index][campo] = valor;
  
      return {
        ...prev,
        tratamentoDermatologico: novosTratamentos
      };
    });
  }; 
  
  const adicionarLinhaTratamento = () => {
    setFormData((prev) => ({
      ...prev,
      tratamentoDermatologico: [
        ...prev.tratamentoDermatologico,
        { medicacao: "", dose: "", frequencia: "", periodo: "" }
      ]
    }));
  };

  const removerUltimaLinhaTratamento = () => {
    setFormData((prev) => {
      const tratamentos = prev.tratamentoDermatologico;
      if (tratamentos.length > 1) {
        return {
          ...prev,
          tratamentoDermatologico: tratamentos.slice(0, -1),
        };
      }
      return prev;
    });
  };  

  const handleSaveDrawing = (imagemFinal, linhasDesenhadas) => {
    setFormData(prev => ({
      ...prev,
      imagemLesao: {
        imagem: imagemFinal,                // string base64 (PNG)
        linhasDesenhadas: linhasDesenhadas // array com dados dos traços
      }
    }));
    setImagemDesenhada(imagemFinal); // Atualiza o estado da imagem desenhada
  };  

  const handleCheckboxChange = (event, field) => {
    const { value, checked } = event.target;
    setFormData((prev) => ({
        ...prev,
        [field]: checked
            ? [...prev[field], value]
            : prev[field].filter((item) => item !== value)
    }));
  };

  const handleSubmit = async (event) => {
    setShowErrorAlert(false);
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); 
    const fichaData = {
        nome: "Ficha clínica dermatológica",  
        conteudo:{
            ambiente: formData.ambiente,
            estiloVida: formData.estiloVida,
            contatoSuperficie: formData.contatoSuperficie,
            acessoRua: formData.acessoRua,
            conviveComAnimais: formData.conviveComAnimais,
            contactantesSintomaticos: formData.contactantesSintomaticos,
            alimentacao: formData.alimentacao,
            banhos: formData.banhos,
            frequenciaBanhos: formData.frequenciaBanhos,
            produtoUtilizado: formData.produtoUtilizado,
            controleEctoparasitas: formData.controleEctoparasitas,
            ultimaAdministracao: formData.ultimaAdministracao,
            apresentaEctoparasitas: formData.apresentaEctoparasitas,
            quandoVistoUltimaVez: formData.quandoVistoUltimaVez,
            queixaPrincipal: formData.queixaPrincipal,
            tratamento: formData.tratamento,
            tratamentosAtuais: formData.tratamentosAtuais,
            prurido: formData.prurido,
            local: formData.local,
            intensidade: formData.intensidade,
            lambedura: formData.lambedura,

            comportamento: formData.comportamento,
            scoreCorporal: formData.scoreCorporal,
            temperatura: formData.temperatura,
            mucosas: formData.mucosas,
            linfonodos: formData.linfonodos,
            alteracoesClinicas: formData.alteracoesClinicas,

            ectoparasitas: formData.ectoparasitas,
            pelagem: formData.pelagem,
            descamacao: formData.descamacao,
            untuosidade: formData.untuosidade,
            condutoAuditivoDireito: formData.condutoAuditivoDireito,
            condutoAuditivoEsquerdo: formData.condutoAuditivoEsquerdo,
            imagemLesao: formData.imagemLesao,
            formacoesSolidas: formData.formacoesSolidas,
            alteracoesDeCor: formData.alteracoesDeCor,
            colecoesLiquidas: formData.colecoesLiquidas,
            alteracoesEspessura: formData.alteracoesEspessura,
            perdasTeciduais: formData.perdasTeciduais,
            descricaoLesional: formData.descricaoLesional,
            criteriosFavrot: formData.criteriosFavrot,
            observacao: formData.observacao,
            diagnostico: formData.diagnostico,
            tratamentoDermatologico: formData.tratamentoDermatologico,
            medico: formData.medico

        },
        dataHora: dataFormatada 
    };

    try {
        console.log("Formulário válido. Dados prontos para envio:", formData);
        await createFicha(fichaData);
        localStorage.removeItem('canvasKonva'); 
        setShowAlert(true);
    } catch (error) {
        console.error("Erro ao criar ficha:", error);
        setShowErrorAlert(true);
    }
 };

  const renderStepContent = () => {
    switch(step) {
      default:
        return <Dermatologica 
          formData={formData} 
          handleChange={handleChange} 
          nextStep={nextStep}
          handleCheckboxChange={handleCheckboxChange}
          setFormData={setFormData}
        />;
      case 1:
        return (
          <Dermatologica 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
            handleCheckboxChange={handleCheckboxChange}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <Dermatologica2
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
      return (
        <>
        {showAlert && 
        <div className={styles.alert}>
          <Alert message="Ficha criada com sucesso!" 
          show={showAlert} url={`/fichaDermatologica`} />
        </div>}
        {showErrorAlert && 
        <div className={styles.alert}>
          <ErrorAlert message={"Erro ao criar ficha"} 
          show={showErrorAlert} />
        </div>}

          <Dermatologica3
          formData={formData} 
          handleChange={handleChange} 
          prevStep={prevStep}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmit}
          handleSaveDrawing={handleSaveDrawing}
          imagemDesenhada={imagemDesenhada} 
          handleChangeTratamentos={handleChangeTratamentos}
          tratamentos={tratamentoDermatologico}
          adicionarLinhaTratamento={adicionarLinhaTratamento}
          removerUltimaLinhaTratamento={removerUltimaLinhaTratamento}
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

export default DermatologicaSteps;