import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Reabilitacao from "./ReabilitacaoIntegrativaUm";
import Reabilitacao2 from "./ReabilitacaoIntegrativaDois";
import Reabilitacao3 from "./ReabilitacaoIntegrativaTres";
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { getCurrentUsuario } from '../../../../services/userService';
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";

function ReabilitacaoIntegrativaSteps() {
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
  const [agendamentoId, setAgendamentoId] = useState(null);

  const [formData, setFormData] = useState({

    // página 1
    numeroProntuario: "",
    peso: "",
    queixaPrincipal: "",

    historicoClinico :{

      ortopedico: "",
      neurologico: "",
      oncologico: "",
      outros: "",
    },

    exameClinicoEspecialOrtpedico:{
      palpacaoMembrosArticulacao: "",
      palpacaoColuna: "",
      testeOrtolani: "",
      testeDeGaveta: "",
      testeDeCompressaoTibial: "",
      instabilidadeMedialDeOmbro: "",
      palpacaoDoTendaoBicipital: "",
      avaliacaoDeMassaMuscular: "",
      avaliacaoDaCapacidadeDeMovimento: "",
    },

    exameClinicoEspecialNeurologico:{
      estadoMental: "",
      postura: "",
      locomocao: "",
      nervosCranianos: "",
      reacoesPosturais: "",
      reflexoesSegmentares: "",
      avaliacaoSensitiva: "",
    },
    exameClinicoEspecialOutros:{
      observacoes: "",
    },

    queixaPrincipal2:{
      sinaisClinicos: "",
      primeiraOcorrencia: "",
      evolucao: "",
    },
    
    medicacaoAdministrada: "",

    //pate 2
    sistemaDigestorio:{
      alimentacao: "",
      apetiteDeglutinacao: "",
      tipo: "", // Êmese/Regurgitação/Refluxo/etc.
      denticao: "",
      fezes: "",
      obesidade: "",
      ConsumoDeAgua: "",
    },

    sistemaCardiorespiratorio:{
      respiracao: "",
      tosseEspirros: "",
      secrecao: "",
      intoleranciaExercicio: "",
      cardiopatia: "",
      aumentoDeVolume: "",
    },

    sistemaGeniturinario:{
      miccao: "",
      castradoInteiro: "",
      tipo1: "", // cruzamentos/cios/etc.
      tipo2: "", // infecções/secreções/etc.
    },

    sistemaNervoso:{
      convulsoesDesequilibrios: "",
      alteracoesComportamentais: "",
      nistagmoMioclonias: "",
      dorDeCabeca: "",
      sinaisNeurologicos: "",
    },

    sistemaOsteoarticularLocomotor:{
      posturaMarcha: "",
      claudinacao: "",
      tipo3: "", // paralisia/paresia/ataxia
      tipo4: "", // atonia/hipotonia/hipertonia
    },

    sistemaTegumentarAnexos:{
      tipo5: "", // pruridos/lambedura
      tipo6: "", // descamações/lesões
      odoresSecrecoes: "",
      qualidade: "",
      acusia: "",
      unhas: "",
    },

    sistemaVisual:{
      opacificacaoDeCristalino: "",
      perdaDaVisao: "",
      secrecao2: "", // Renomeei para evitar conflito com `secrecao` do cardiorrespiratório
    },

    manejosGerais:{
      vacinacao: "",
      desverminizacao: "",
      ambiente: "",
      banhos: "",
      contactantes: "",
    },

    sensibilidadePontosMu:"",
    sensibilidadePontosShu:"",
    sensibilidadeDorCorporal:"",
    pulso:"",
    lingua:"",

    perguntasAdicionaisMTC:{
      historicoAncestral:"",
      comportamento:"",
      latidoMiado: "",
      sono: "",
      descricao: "",
    },

    diagnosticoMTC:{
      orgaosSubstacias: "",
      wuXing:"",
      zangFu:"",
    },

    responsavel:"",
    estagiario:"",
    cpf:"",

    principios: [],
    constituicaoCorporal: [],
    preferencias: [],


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
  
    // Verifica se o campo é aninhado (ex.: historicoClinico.ortopedico)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Para campos não aninhados
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

      const handlePreferenciasChange = (event) => {
        const { value, checked } = event.target;

        // cria uma cópia do array atual de preferências ou um array vazio se undefined
        let updatedPreferencias = formData.preferencias ? [...formData.preferencias] : [];

        if (checked) {
            // adiciona se não existe ainda
            if (!updatedPreferencias.includes(value)) {
                updatedPreferencias.push(value);
            }
          } else {
            // remove o valor
            updatedPreferencias = updatedPreferencias.filter(item => item !== value);
    }
    
    // atualiza o formData chamando handleChange com o array novo
    handleChange({
        target: {
            name: "preferencias",
            value: updatedPreferencias,
        },
    });
};
const handlePrincipiosChange = (event) => {
  const { value, checked } = event.target;

  // cria uma cópia do array atual de preferências ou um array vazio se undefined
  let updatedPrincipios = formData.principios ? [...formData.principios] : [];

  if (checked) {
      // adiciona se não existe ainda
      if (!updatedPrincipios.includes(value)) {
          updatedPrincipios.push(value);
      }
  } else {
      // remove o valor
      updatedPrincipios = updatedPrincipios.filter(item => item !== value);
  }
  
  
  // atualiza o formData chamando handleChange com o array novo
  handleChange({
      target: {
        name: "principios",
        value: updatedPrincipios,

      },
  });
};

const handleSelectChange = (e, index) => {
  const value = e.target.value;
  setFormData((prevData) => {
    const updatedArray = [...(prevData.constituicaoCorporal || [])];
    updatedArray[index] = value;
    return {
      ...prevData,
      constituicaoCorporal: updatedArray
    };
  });
}
  

  const handleRadioAninhado = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.'); // Divida o nome para obter o caminho
    const newFormData = { ...formData };
  
    let temp = newFormData;
    for (let i = 0; i < nameParts.length - 1; i++) {
      temp = temp[nameParts[i]] = temp[nameParts[i]] || {}; // Navega na estrutura
    }
    temp[nameParts[nameParts.length - 1]] = value; // Atualiza o valor no caminho final
  
    setFormData(newFormData);
  };

  const handleSubmit = async (event) => {
    setShowErrorAlert(false);
    const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss"); 
    const fichaData = {
        nome: "Ficha de Reabilitação Integrativa",  
        conteudo:{
            numeroProntuario: formData.numeroProntuario,
            peso: formData.peso,
            queixaPrincipal: formData.queixaPrincipal,

            historicoClinico: formData.historicoClinico,
            exameClinicoEspecialOrtpedico:formData.exameClinicoEspecialOrtpedico,
            exameClinicoEspecialNeurologico:formData.exameClinicoEspecialNeurologico,

            exameClinicoEspecialOutros:formData.exameClinicoEspecialOutros,

            queixaPrincipal2: formData.queixaPrincipal2,
            medicacaoAdministrada: formData.medicacaoAdministrada,
           
           //part2
            sistemaDigestorio:formData.sistemaDigestorio,
            sistemaCardiorespiratorio:formData.sistemaCardiorespiratorio,
            sistemaGeniturinario:formData.sistemaGeniturinario,
            sistemaNervoso:formData.sistemaNervoso,
            sistemaOsteoarticularLocomotor: formData.sistemaOsteoarticularLocomotor,
            sistemaTegumentarAnexos:formData.sistemaTegumentarAnexos,
            sistemaVisual: formData.sistemaVisual,
            manejosGerais:formData.manejosGerais,
            


            //part3
            sensibilidadePontosMu:formData.sensibilidadePontosMu,
            sensibilidadePontosShu:formData.sensibilidadePontosShu,
            sensibilidadeDorCorporal:formData.sensibilidadeDorCorporal,
            pulso:formData.pulso,
            lingua:formData.lingua,
            perguntasAdicionaisMTC:formData.perguntasAdicionaisMTC,
            diagnosticoMTC:formData.diagnosticoMTC,


          responsavel:formData.responsavel,
          estagiario:formData.estagiario,
          cpf:formData.cpf,

        principios:formData.principios,
        constituicaoCorporal:formData.constituicaoCorporal,
        preferencias:formData.preferencias,
            
        },
        dataHora: dataFormatada,
        agendamento: { id: Number(agendamentoId) }
    };

    try {
        await updateFicha(fichaData, fichaId);
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
          <Reabilitacao 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
          />
        );
      case 2:
          return (
              <Reabilitacao2
              formData={formData} 
              handleChange={handleChange} 
              nextStep={nextStep}
              prevStep={prevStep}
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
          <ErrorAlert message={"Erro ao criar ficha"} 
          show={showErrorAlert} />
        </div>}

          <Reabilitacao3
          formData={formData} 
          handlePreferenciasChange={handlePreferenciasChange}
          handlePrincipiosChange={handlePrincipiosChange}
          handleChange={handleChange}
          handleRadioAninhado={handleRadioAninhado} 
          handleSubmit={handleSubmit}
          prevStep={prevStep}
          handleSelectChange={handleSelectChange}
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


export default ReabilitacaoIntegrativaSteps;