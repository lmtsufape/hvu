import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Ortopedica from "./OrtopedicoHistorico";
import Ortopedica2 from "./OrtopedicoMarcha";
import Ortopedica3 from "./OrtopedicoPalpacao"
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { getCurrentUsuario } from '../../../../services/userService';
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";

function OrtopedicaSteps() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [selecionadosGrupoExame, setSelecionadosGrupoExame] = useState([]);
  const [ladosVisiveisGrupoExame, setLadosVisiveisGrupoExame] = useState({});
  const [consultaId, setConsultaId] = useState(null);
  const router = useRouter();
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({

    // página 1
    queixaPrincipal: "",
    ocorrenciaTrauma: "",
    duracaoProblema: "",
    evolucaoQuadro: "",
    ocorrenciaClaudicacao: "",
    toleranciaExercicio: "",
    indiciosDor: "",
    acidentesAnteriores: "",
    tratamentosHistorico: "",
    alimentacao: "",
    vitaminas: "",
    ambiente: "",
    observacao: "",

    // página 2
    condicaoCorporal: "",
    comportamento: "",
    postura: "",
    capacidadePeso: "",
    tumefacao: "",
    assimetriaDesvio: "",
    atrofiaMuscular: "",
    escoriacoesFistulas: "",
    caracteristicas: "",
    claudicacao: "",
    faseApoio: "",
    faseElevacao: "",
    anguloArticulacoes: "",
    segundaObservacao: "",
    marcha: "",

    // página 3
    digitosMetacarpos: {
      flexaoMetacarpos: { Direito: "", Esquerdo: "" },
      extensaoMetacarpos: { Direito: "", Esquerdo: "" }
    },
    carpo: {
      hiperextensao: { Direito: "", Esquerdo: "" },
      flexaoCarpo: { Direito: "", Esquerdo: "" },
      extensaoCarpo: { Direito: "", Esquerdo: "" },
      instabilidadeMedial: { Direito: "", Esquerdo: "" },
      rotacaoCarpo: { Direito: "", Esquerdo: "" }
    },
    radioUlna: {
      olecrano: { Direito: "", Esquerdo: "" },
    },
    musculosTendoes: {
      hipertonia: { Direito: "", Esquerdo: "" },
      hipotonia: { Direito: "", Esquerdo: "" },
      hipertrofia: { Direito: "", Esquerdo: "" },
      atrofia: { Direito: "", Esquerdo: "" },
      contraturaFibrose: { Direito: "", Esquerdo: "" },
      enrijecimento: { Direito: "", Esquerdo: "" },
      restricaoMovArticular: { Direito: "", Esquerdo: "" },
      ampliacaoMovArticular: { Direito: "", Esquerdo: "" },
      dorInchaco: { Direito: "", Esquerdo: "" },
      hematoma: { Direito: "", Esquerdo: "" },
      laceracoesRuptura: { Direito: "", Esquerdo: "" },
      tremoresMioclonias: { Direito: "", Esquerdo: "" },
      caibra: { Direito: "", Esquerdo: "" },
      depressaoMiotonicaPercussao: { Direito: "", Esquerdo: "" },
      higroma: { Direito: "", Esquerdo: "" },
      tumor: { Direito: "", Esquerdo: "" },
      posturaCaranguejo: { Direito: "", Esquerdo: "" },
      outros: { Direito: "", Esquerdo: "" }
    },
    umero: {
      ladoUmero: { Direito: "", Esquerdo: "" }
    },
    ombro: {
      flexaoOmbro: { Direito: "", Esquerdo: "" },
      extensaoOmbro: { Direito: "", Esquerdo: "" },
      rotacaoOmbro: { Direito: "", Esquerdo: "" },
      aducaoAbducao: { Direito: "", Esquerdo: "" },
      palpacaoGlenoideCaudal: { Direito: "", Esquerdo: "" },
      compressaoUmeral: { Direito: "", Esquerdo: "" },
      origemBiceps: { Direito: "", Esquerdo: "" },
      retracaoBiceps: { Direito: "", Esquerdo: "" },
      estiramentoBiceps: { Direito: "", Esquerdo: "" },
      relAcromioTuberculoMaior: { Direito: "", Esquerdo: "" }
    },
    axilarSubescapular: {
      ladoSubescapular: { Direito: "", Esquerdo: "" },
    },
    escapula: {
      corpoEspinha: { Direito: "", Esquerdo: "" },
      colo: { Direito: "", Esquerdo: "" },
      acromio: { Direito: "", Esquerdo: "" },
      luxacaoDorsal: { Direito: "", Esquerdo: "" },
    },
    articulacaoCubital: {
      flexaoCubital: { Direito: "", Esquerdo: "" },
      extensaoCubital: { Direito: "", Esquerdo: "" },
      instabilidadeMedialLateral: { Direito: "", Esquerdo: "" },
      processoAnconeo: { Direito: "", Esquerdo: "" },
      processoCoronoide: { Direito: "", Esquerdo: "" },
      efusaoArticular: { Direito: "", Esquerdo: "" },
      palpacaoTensaoLigColMed: { Direito: "", Esquerdo: "" },
      epicondiloMedial: { Direito: "", Esquerdo: "" },
    },
    digitosMetatarsos: {
      flexaoMetatarsos: { Direito: "", Esquerdo: "" },
      extensaoMetatarsos: { Direito: "", Esquerdo: "" },
    },
    tarso: {
      calcaneoTendao: { Direito: "", Esquerdo: "" },
      flexaoTarso: { Direito: "", Esquerdo: "" },
      extensaoTarso: { Direito: "", Esquerdo: "" },
      instabilidadeMedialLateralTarso: { Direito: "", Esquerdo: "" },
      rotacaoTarso: { Direito: "", Esquerdo: "" },
    },
    tibiaFibula: {
      cristaTibia: { Direito: "", Esquerdo: "" },
    },
    articulacaoJoelho: {
      ligamentoElevacaoPatelar: { Direito: "", Esquerdo: "" },
      luxacaoPatelarMedialLateral: { Direito: "", Esquerdo: "" },
      sentar: { Direito: "", Esquerdo: "" },
      flexaoArticulacaoJoelho: { Direito: "", Esquerdo: "" },
      extensaoArticulacaoJoelho: { Direito: "", Esquerdo: "" },
      posicaoRotacaoCristaTibial: { Direito: "", Esquerdo: "" },
      instabilidadeCraniomedial: { Direito: "", Esquerdo: "" },
      gavetaCranial: { Direito: "", Esquerdo: "" },
      gavetaCaudal: { Direito: "", Esquerdo: "" },
      compressaoTibial: { Direito: "", Esquerdo: "" },
      gavetaMedialLateral: { Direito: "", Esquerdo: "" },
      menisco: { Direito: "", Esquerdo: "" },
      clickMeniscal: { Direito: "", Esquerdo: "" },
      clickTendaoExtensorDigitalLongo: { Direito: "", Esquerdo: "" },
      efusaoArticular: { Direito: "", Esquerdo: "" },
      coximAdiposo: { Direito: "", Esquerdo: "" },
    },
    femur: {
      ladoFemur: { Direito: "", Esquerdo: "" },
    },
    articulacaoCoxal: {
      conformacaoBase: { Direito: "", Esquerdo: "" },
      clunck: { Direito: "", Esquerdo: "" },
      stand: { Direito: "", Esquerdo: "" },
      abducaoRotacaoExterna: { Direito: "", Esquerdo: "" },
      simetriaReacaoExtensao: { Direito: "", Esquerdo: "" },
      testeSubluxacao: { Direito: "", Esquerdo: "" },
      testeIliopsoas: { Direito: "", Esquerdo: "" },
      anguloSubluxacao: { Direito: "", Esquerdo: "" },
      anguloReducao: { Direito: "", Esquerdo: "" },
      sinalOrtolani: { Direito: "", Esquerdo: "" },
      sinalBarlow: { Direito: "", Esquerdo: "" },
      testeBardens: { Direito: "", Esquerdo: "" },
      compressaoTrocanterica: { Direito: "", Esquerdo: "" },
    },
    articulacaoSacroiliaca: {
      ladoSacroiliaca: { Direito: "", Esquerdo: "" },
    },
    pelve: {
      cristaIliaca: { Direito: "", Esquerdo: "" },
      tuberosidadeIsquiatica: { Direito: "", Esquerdo: "" },
      relacaoTrocanterMaior: { Direito: "", Esquerdo: "" },
      exameRetal: { Direito: "", Esquerdo: "" },
    },
    cabecaEsqueletoAxial: {
      cranio: "",
      maxila: "",
      ramosMandibulares: "",
      sinfiseMandibular: "",
      atm: "",
      colunaCervical: "",
    },
    achadosImagem: "",
    outrosExames: "",
    diagnostico: "",
    tratamento: "",
    plantonistas: "",
    medicosResponsaveis:"",
  });

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
              setLoading(false); 
          }
      };
      fetchData();
  }, []);

  useEffect(() => {
    // Não executa se o formData ainda não foi carregado de uma ficha existente
    if (!fichaId || Object.keys(formData).length === 0) {
      return;
    }

    console.log("Sincronizando UI com os dados da ficha carregada...");

    const novosLadosVisiveis = {};
    const novosSelecionados = [];

    const gruposDePalpacao = [
      "digitosMetacarpos", "carpo", "radioUlna", "musculosTendoes", "umero", "ombro", 
      "axilarSubescapular", "escapula", "articulacaoCubital", "digitosMetatarsos", "tarso", 
      "tibiaFibula", "articulacaoJoelho", "femur", "articulacaoCoxal", "articulacaoSacroiliaca", 
      "pelve", "cabecaEsqueletoAxial"
    ];

    gruposDePalpacao.forEach(grupoTitulo => {
      const grupoData = formData[grupoTitulo];
      if (typeof grupoData === 'object' && grupoData !== null) {
        for (const itemKey in grupoData) {
          const itemData = grupoData[itemKey];
          
          // Verifica se o item tem algum dado preenchido
          if (itemData && (itemData.Direito || itemData.Esquerdo)) {
            
            // Adiciona a chave do item (ex: 'flexaoCarpo') aos selecionados
            if (!novosSelecionados.includes(itemKey)) {
              novosSelecionados.push(itemKey);
            }

            // Verifica os lados (Direito/Esquerdo) e se têm valor
            if (typeof itemData === 'object' && itemData !== null) {
              novosLadosVisiveis[itemKey] = {};
              if (itemData.Direito) {
                novosLadosVisiveis[itemKey].Direito = true;
              }
              if (itemData.Esquerdo) {
                novosLadosVisiveis[itemKey].Esquerdo = true;
              }
            }
          }
        }
      }
    });

    // ATUALIZA O ESTADO DA UI
    setSelecionadosGrupoExame(novosSelecionados);
    setLadosVisiveisGrupoExame(novosLadosVisiveis);

  }, [formData, fichaId]);

  if (loading) {
      return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

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

  //função para alternar a seleção de um item e limpar os valores dos lados
  const toggleItem = (titulo, key) => {
    const wasSelected = selecionadosGrupoExame.includes(key);
    
    // Atualiza a lista de selecionados
    setSelecionadosGrupoExame(prev =>
      wasSelected ? prev.filter(i => i !== key) : [...prev, key]
    );
  
    // Se estava selecionado e agora está desmarcando, limpa os valores mas mantém a estrutura
    if (wasSelected) {
      setFormData(prev => {
        const newFormData = { ...prev };
        
        // Limpa os valores mas mantém a estrutura
        if (newFormData[titulo] && newFormData[titulo][key]) {
          newFormData[titulo][key] = {
            Direito: "",
            Esquerdo: ""
          };
        }
        
        return newFormData;
      });
  
      // Limpa os lados visíveis para este item
      setLadosVisiveisGrupoExame(prev => {
        const novo = { ...prev };
        if (novo[key]) delete novo[key];
        return novo;
      });
    }
  };
  //função para alternar a visibilidade dos lados
  const toggleLadoVisivel = (titulo, key, lado) => {
    const wasVisible = ladosVisiveisGrupoExame[key]?.[lado];
    
    // Atualiza a visibilidade dos lados
    setLadosVisiveisGrupoExame(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [lado]: !wasVisible,
      },
    }));
  
    // Se estava visível e agora está desativando, limpa o valor mas mantém a estrutura
    if (wasVisible) {
      setFormData(prev => {
        const newFormData = { ...prev };
        
        if (newFormData[titulo]?.[key]) {
          newFormData[titulo][key] = {
            ...newFormData[titulo][key],
            [lado]: ""
          };
        }
        
        return newFormData;
      });
    }
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioAninhado = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.'); 
    const newFormData = { ...formData };
  
    let temp = newFormData;
    for (let i = 0; i < nameParts.length - 1; i++) {
      temp = temp[nameParts[i]] = temp[nameParts[i]] || {}; 
    }
    temp[nameParts[nameParts.length - 1]] = value; 
  
    setFormData(newFormData);
  };

  const handleSubmit = async (event) => {
    setShowErrorAlert(false);
    const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss"); 
    const fichaData = {
        nome: "Ficha clínica ortopédica",  
        conteudo:{
            queixaPrincipal: formData.queixaPrincipal,
            ocorrenciaTrauma: formData.ocorrenciaTrauma,
            duracaoProblema: formData.duracaoProblema,
            evolucaoQuadro: formData.evolucaoQuadro,
            ocorrenciaClaudicacao: formData.ocorrenciaClaudicacao,
            toleranciaExercicio: formData.toleranciaExercicio,
            indiciosDor: formData.indiciosDor,
            acidentesAnteriores: formData.acidentesAnteriores,
            tratamentosHistorico: formData.tratamentosHistorico,
            alimentacao: formData.alimentacao,
            vitaminas: formData.vitaminas,
            ambiente: formData.ambiente,
            observacao: formData.observacao,

            condicaoCorporal: formData.condicaoCorporal,
            comportamento: formData.comportamento,
            postura: formData.postura,
            capacidadePeso: formData.capacidadePeso,
            tumefacao: formData.tumefacao,
            assimetriaDesvio: formData.assimetriaDesvio,
            atrofiaMuscular: formData.atrofiaMuscular,
            escoriacoesFistulas: formData.escoriacoesFistulas,
            caracteristicas: formData.caracteristicas,
            claudicacao: formData.claudicacao,
            faseApoio: formData.faseApoio,
            faseElevacao: formData.faseElevacao,
            anguloArticulacoes: formData.anguloArticulacoes,
            segundaObservacao: formData.segundaObservacao,
            marcha: formData.marcha,

            achadosImagem: formData.achadosImagem,
            outrosExames: formData.outrosExames,
            diagnostico: formData.diagnostico,
            tratamento: formData.tratamento,
            plantonistas: formData.plantonistas,

            digitosMetacarpos: formData.digitosMetacarpos,
            carpo: formData.carpo,
            radioUlna: formData.radioUlna,
            musculosTendoes: formData.musculosTendoes,
            umero: formData.umero,
            ombro: formData.ombro,
            axilarSubescapular: formData.axilarSubescapular,
            escapula: formData.escapula,
            articulacaoCubital: formData.articulacaoCubital,
            digitosMetatarsos: formData.digitosMetatarsos,
            tarso: formData.tarso,
            tibiaFibula: formData.tibiaFibula,
            articulacaoJoelho: formData.articulacaoJoelho,
            femur: formData.femur,
            articulacaoCoxal: formData.articulacaoCoxal,
            articulacaoSacroiliaca: formData.articulacaoSacroiliaca,
            pelve: formData.pelve,
            cabecaEsqueletoAxial: formData.cabecaEsqueletoAxial,
            medicosResponsaveis: formData.medicosResponsaveis,
        },
        dataHora: dataFormatada 
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
          <Ortopedica 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep}
          />
        );
      case 2:
          return (
              <Ortopedica2
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

          <Ortopedica3
          formData={formData} 
          handleChange={handleChange}
          handleRadioAninhado={handleRadioAninhado} 
          handleSubmit={handleSubmit}
          prevStep={prevStep}
          selecionados={selecionadosGrupoExame}
          ladosVisiveis={ladosVisiveisGrupoExame}
          toggleItem={toggleItem}
          toggleLadoVisivel={toggleLadoVisivel}
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


export default OrtopedicaSteps;