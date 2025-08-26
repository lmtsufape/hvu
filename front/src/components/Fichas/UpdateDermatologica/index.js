import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Dermatologica from "./AnamneseFicha";
import Dermatologica2 from "./FisicoFicha";
import Dermatologica3 from "./DermatologicoFicha";
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { getCurrentUsuario } from '../../../../services/userService';
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";

function UpdateDermatologicaSteps() {
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
  const [errorMessage, setErrorMessage] = useState(""); // Added state for error message
  const [consultaId, setConsultaId] = useState(null);
  const router = useRouter();
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState([]);

  const [showOtherInputConviveComAnimais, setShowOtherInputConviveComAnimais] = useState(false);
  const [otherValueConviveComAnimais, setOtherValueConviveComAnimais] = useState("");
  const [showOtherInputProdutosUtilizados, setShowOtherInputProdutosUtilizados] = useState(false);
  const [otherValueProdutosUtilizados, setOtherValueProdutosUtilizados] = useState("");
  const [formData, setFormData] = useState({

    // página 1
    peso: "",
    ambiente: "",
    estiloVida: "",
    contatoComSuperfice: [],
    acessoRua: "",
    conviveComAnimais: [],
    contactantesSintomaticos: [],
    alimentacao: "",
    banhos: "",
    frequenciaBanhos: "",
    produtosUtilizados: [],
    controleEctoparasitas: [],
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
    tipo: {
      postura: "",
      outrosDetalhes: "",
    },
    nivelDeConsciencia: "",
    grauDedesidratacao: "",
    tpc: "",
    turgorCutaneo: "",
    scoreCorporal: "",
    temperatura: "",
    
    alteracoesClinicas: "",

      options: {
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
    


    // página 3
    ectoparasitas: "",
    pelagem: [],
    descamacao: "",
    untuosidade: "",
    condutoAuditivoDireito: [],
    condutoAuditivoEsquerdo: [],
    imagemLesao:{
      imagem:"", // string base64 (PNG)
      linhasDesenhadas: [],
    },
    formacoesSolidas: [],
    alteracoesDeCor: [],
    colecoesLiquidas: [],
    alteracoesEspessura: [],
    perdasTeciduais: "",
    descricaoLesional: "",
    criteriosFavrot: [],
    observacao: "",
    diagnostico:{
        definitivo: "",
        observacoes: "",
        prodnostico: "",
    },
    tratamentoDermatologico: [
      { medicacao: "", dose: "", frequencia: "", periodo: ""}
    ],
    medico: "",
    estagiarios: "",
    SolicitacaoDeExame: {
      hematologiaDiagnostica: [],
      urinalise: [],
      parasitologico: [],
      bioquimicaClinica: [],
      citologiaHistopatologia: [],
      imunologicos: [],
      imaginologia: [],
      cardiologia: [],
    },
  });
  

  // Obtém o ID da ficha da URL
  useEffect(() => {
    if (router.isReady) {
        const id = router.query.consultaId;
        const ficha = router.query.fichaId;
        if (id) {
          setConsultaId(id);
        }
        if(ficha){
          setFichaId(ficha);
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
  if (!roles.includes("medico") && !roles.includes("patologista")) {
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

    const handleChangeSelect = (e) => {
      setFormData({
        ...formData,
        tipo: {
          ...formData.tipo,
          [e.target.name]: e.target.value
        }
      });
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

   const handleCheckboxChangeOutros = (event, field, setShowOtherInput, setOtherValue) => {
        const { value, checked } = event.target;

        if (value === "Outros") {
            setShowOtherInput(checked);
            if (!checked) setOtherValue("");
        }
        setFormData((prev) => {
         if (field === "conviveComAnimais") {
            return {
                ...prev,
                conviveComAnimais: checked
                    ? [...prev.conviveComAnimais, value]
                    : prev.conviveComAnimais.filter((item) => item !== value)
            };
            
          }
          if (field === "produtosUtilizados") {
            return {
                ...prev,
                produtosUtilizados: checked
                    ? [...prev.produtosUtilizados, value]
                    : prev.produtosUtilizados.filter((item) => item !== value)
            };
            
          }
           return prev;
        });
    };


  const handleCheckboxChangeMucosas = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        [name]: checked
      }
    }));
  };
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      mucosas: {
        ...prevState.mucosas,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (event) => {
    setShowErrorAlert(false);
    const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss"); 
    let conviveComAnimaisFinal = [...formData.conviveComAnimais];
    let produtosUtilizadosFinal = [...formData.produtosUtilizados];

     if (conviveComAnimaisFinal.includes("Outros") && otherValueConviveComAnimais.trim() !== "") {
        conviveComAnimaisFinal = conviveComAnimaisFinal.filter(item => item !== "Outros");
        conviveComAnimaisFinal.push(otherValueConviveComAnimais.trim());
    }
    if (produtosUtilizadosFinal.includes("Outros") && otherValueProdutosUtilizados.trim() !== "") {
        produtosUtilizadosFinal = produtosUtilizadosFinal.filter(item => item !== "Outros");
        produtosUtilizadosFinal.push(otherValueProdutosUtilizados.trim());

    }
    const fichaData = {
        nome: "Ficha clínica dermatológica",  
        conteudo:{
            peso: formData.peso,
            ambiente: formData.ambiente,
            estiloVida: formData.estiloVida,
            contatoComSuperfice: formData.contatoComSuperfice,
            acessoRua: formData.acessoRua,
            conviveComAnimais: conviveComAnimaisFinal,
            contactantesSintomaticos: formData.contactantesSintomaticos,
            alimentacao: formData.alimentacao,
            banhos: formData.banhos,
            frequenciaBanhos: formData.frequenciaBanhos,
            produtosUtilizados: produtosUtilizadosFinal,
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

            tipo:formData.tipo,
            nivelDeConsciencia: formData.nivelDeConsciencia,
            grauDedesidratacao: formData.grauDedesidratacao,
            scoreCorporal: formData.scoreCorporal,
            turgorCutaneo: formData.turgorCutaneo,
            tpc: formData.tpc,
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
            medico: formData.medico,
            estagiarios: formData.estagiarios,
            SolicitacaoDeExame: formData.SolicitacaoDeExame

        },
        dataHora: dataFormatada 
        
    };

    try {
        await updateFicha(fichaData, fichaId);
        setShowAlert(true);
    } catch (error) {
        console.error("Erro ao editar ficha:", error);
        setShowErrorAlert(true);
    }
 };

   const renderImagemLesao = () => {
    if (formData.imagemLesao && formData.imagemLesao.imagem) {
        return (
            <img
                src={formData.imagemLesao.imagem}
                alt="Localização das lesões com marcações"
                style={{ maxWidth: '500px', border: '1px solid #ccc' }}
            />
        );
    }
    return (
        <img
            src="/images/localizacao_lesoes.png"
            alt="Localização das lesões"
            style={{ maxWidth: '500px', border: '1px solid #ccc' }}
        />
    );
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
            handleCheckboxChangeOutros={handleCheckboxChangeOutros}
             showOtherInputConviveComAnimais={showOtherInputConviveComAnimais}
            setShowOtherInputConviveComAnimais={setShowOtherInputConviveComAnimais}
            otherValueConviveComAnimais={otherValueConviveComAnimais}
            setOtherValueConviveComAnimais={setOtherValueConviveComAnimais}

            showOtherInputProdutosUtilizados={showOtherInputProdutosUtilizados}
            setShowOtherInputProdutosUtilizados={setShowOtherInputProdutosUtilizados}
            otherValueProdutosUtilizados={otherValueProdutosUtilizados}
            setOtherValueProdutosUtilizados={setOtherValueProdutosUtilizados}
          />
        );
      case 2:
        return (
          <Dermatologica2
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
            prevStep={prevStep}
            handleChangeSelect={handleChangeSelect}
            handleCheckboxChangeMucosas={handleCheckboxChangeMucosas}
            handleLocationChange={handleLocationChange}
            handleLinfonodoChange={handleLinfonodoChange}
            handleCaracteristicaChange={handleCaracteristicaChange}
          />
        );
      case 3:
      return (
        <>
        {showAlert && consultaId &&
        <div className={styles.alert}>
          <Alert message="Ficha editada com sucesso!" 
          show={showAlert} url={`/createConsulta/${consultaId}`} />
        </div>}
        {showErrorAlert && 
        <div className={styles.alert}>
          <ErrorAlert message={"Erro ao editar ficha"} 
          show={showErrorAlert} />
        </div>}

          <Dermatologica3
          setFormData={setFormData}
          formData={formData} 
          handleChange={handleChange} 
          prevStep={prevStep}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmit}
          handleSaveDrawing={handleSaveDrawing}
          imagemDesenhada={imagemDesenhada} 
          handleChangeTratamentos={handleChangeTratamentos}
          tratamentos={formData.tratamentoDermatologico}
          adicionarLinhaTratamento={adicionarLinhaTratamento}
          removerUltimaLinhaTratamento={removerUltimaLinhaTratamento}
          renderImagemLesao={renderImagemLesao}

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

export default UpdateDermatologicaSteps;