import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Reabilitacao from "./ReabilitacaoIntegrativaUm";
import Reabilitacao2 from "./ReabilitacaoIntegrativaDois";
import Reabilitacao3 from "./ReabilitacaoIntegrativaTres";
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { createFicha } from '../../../../services/fichaService';
import { getCurrentUsuario } from '../../../../services/userService';

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
  const router = useRouter();

  const [formData, setFormData] = useState({

    // página 1
    numeroProntuario: "",
    peso: "",
    queixaPrincipal: "",

    historicoClinico: {

      ortopedico: "",
      neurologico: "",
      oncologico: "",
      outros: "",
    },

    exameClinicoEspecialOrtpedico: {
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

    exameClinicoEspecialNeurologico: {
      estadoMental: "",
      postura: "",
      locomocao: "",
      nervosCranianos: "",
      reacoesPosturais: "",
      reflexoesSegmentares: "",
      avaliacaoSensitiva: "",
    },
    exameClinicoEspecialOutros: {
      observacoes: "",
    },

    queixaPrincipal2: {
      sinaisClinicos: "",
      primeiraOcorrencia: "",
      evolucao: "",
    },

    medicacaoAdministrada: "",

    //pate 2
    sistemaDigestorio: {
      alimentacao: "",
      apetiteDeglutinacao: "",
      tipo: "", // Êmese/Regurgitação/Refluxo/etc.
      denticao: "",
      fezes: "",
      obesidade: "",
      ConsumoDeAgua: "",
    },

    sistemaCardiorespiratorio: {
      respiracao: "",
      tosseEspirros: "",
      secrecao: "",
      intoleranciaExercicio: "",
      cardiopatia: "",
      aumentoDeVolume: "",
    },

    sistemaGeniturinario: {
      miccao: "",
      castradoInteiro: "",
      tipo1: "", // cruzamentos/cios/etc.
      tipo2: "", // infecções/secreções/etc.
    },

    sistemaNervoso: {
      convulsoesDesequilibrios: "",
      alteracoesComportamentais: "",
      nistagmoMioclonias: "",
      dorDeCabeca: "",
      sinaisNeurologicos: "",
    },

    sistemaOsteoarticularLocomotor: {
      posturaMarcha: "",
      claudinacao: "",
      tipo3: "", // paralisia/paresia/ataxia
      tipo4: "", // atonia/hipotonia/hipertonia
    },

    sistemaTegumentarAnexos: {
      tipo5: "", // pruridos/lambedura
      tipo6: "", // descamações/lesões
      odoresSecrecoes: "",
      qualidade: "",
      acusia: "",
      unhas: "",
    },

    sistemaVisual: {
      opacificacaoDeCristalino: "",
      perdaDaVisao: "",
      secrecao2: "", // Renomeei para evitar conflito com `secrecao` do cardiorrespiratório
    },

    manejosGerais: {
      vacinacao: "",
      desverminizacao: "",
      ambiente: "",
      banhos: "",
      contactantes: "",
    },

    sensibilidadePontosMu: "",
    sensibilidadePontosShu: "",
    sensibilidadeDorCorporal: "",
    pulso: "",
    lingua: "",

    perguntasAdicionaisMTC: {
      historicoAncestral: "",
      comportamento: "",
      latidoMiado: "",
      sono: "",
      descricao: "",
    },

    diagnosticoMTC: {
      orgaosSubstacias: "",
      wuXing: "",
      zangFu: "",
    },
    responsavel: "",
    estagiario: "",
    cpf: "",
    principios: [],
    constituicaoCorporal: [],
    preferencias: [],


  });

  // Carrega os dados do formulário do localStorage 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFormData = localStorage.getItem("fichaReabilitacaoFormData");
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    }
  }, []);

  // Salva os dados do formulário no localStorage 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("fichaReabilitacaoFormData", JSON.stringify(formData));
    }
  }, [formData]);

  // Obtém o ID da ficha da URL
  useEffect(() => {
    if (router.isReady) {
      const id = router.query.consultaId;
      if (id) {
        setConsultaId(id);
        console.log("ID da ficha:", id);
      }
    }
  }, [router.isReady, router.query.consultaId]);

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
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
    const fichaData = {
      nome: "Ficha de Reabilitação Integrativa",
      conteudo: {
        "Número do Prontuário": formData.numeroProntuario,
        "Peso": formData.peso,
        "Queixa Principal": formData.queixaPrincipal,

        "Histórico Clínico": {
          "Ortopédico": formData.historicoClinico.ortopedico,
          "Neurológico": formData.historicoClinico.neurologico,
          "Oncológico": formData.historicoClinico.oncologico,
          "Outros": formData.historicoClinico.outros,
        },

        "Exame Clínico Especial Ortopédico": {
          "Palpação de Membros/Articulações": formData.exameClinicoEspecialOrtpedico.palpacaoMembrosArticulacao,
          "Palpação da Coluna": formData.exameClinicoEspecialOrtpedico.palpacaoColuna,
          "Teste de Ortolani": formData.exameClinicoEspecialOrtpedico.testeOrtolani,
          "Teste de Gaveta": formData.exameClinicoEspecialOrtpedico.testeDeGaveta,
          "Teste de Compressão Tibial": formData.exameClinicoEspecialOrtpedico.testeDeCompressaoTibial,
          "Instabilidade Medial do Ombro": formData.exameClinicoEspecialOrtpedico.instabilidadeMedialDeOmbro,
          "Palpação do Tendão Bicipital": formData.exameClinicoEspecialOrtpedico.palpacaoDoTendaoBicipital,
          "Avaliação da Massa Muscular": formData.exameClinicoEspecialOrtpedico.avaliacaoDeMassaMuscular,
          "Avaliação da Capacidade de Movimento": formData.exameClinicoEspecialOrtpedico.avaliacaoDaCapacidadeDeMovimento,
        },

        "Exame Clínico Especial Neurológico": {
          "Estado Mental": formData.exameClinicoEspecialNeurologico.estadoMental,
          "Postura": formData.exameClinicoEspecialNeurologico.postura,
          "Locomoção": formData.exameClinicoEspecialNeurologico.locomocao,
          "Nervos Cranianos": formData.exameClinicoEspecialNeurologico.nervosCranianos,
          "Reações Posturais": formData.exameClinicoEspecialNeurologico.reacoesPosturais,
          "Reflexos Segmentares": formData.exameClinicoEspecialNeurologico.reflexoesSegmentares,
          "Avaliação Sensitiva": formData.exameClinicoEspecialNeurologico.avaliacaoSensitiva,
        },

        "Exame Clínico Especial - Outros": {
          "Observações": formData.exameClinicoEspecialOutros.observacoes,
        },

        "Queixa Principal (Detalhada)": {
          "Sinais Clínicos": formData.queixaPrincipal2.sinaisClinicos,
          "Primeira Ocorrência": formData.queixaPrincipal2.primeiraOcorrencia,
          "Evolução": formData.queixaPrincipal2.evolucao,
        },

        "Medicação Administrada": formData.medicacaoAdministrada,

        "Sistema Digestório": {
          "Alimentação": formData.sistemaDigestorio.alimentacao,
          "Apetite / Deglutição": formData.sistemaDigestorio.apetiteDeglutinacao,
          "Tipo": formData.sistemaDigestorio.tipo,
          "Dentição": formData.sistemaDigestorio.denticao,
          "Fezes": formData.sistemaDigestorio.fezes,
          "Obesidade": formData.sistemaDigestorio.obesidade,
          "Consumo de Água": formData.sistemaDigestorio.ConsumoDeAgua,
        },

        "Sistema Cardiorrespiratório": {
          "Respiração": formData.sistemaCardiorespiratorio.respiracao,
          "Tosse / Espirros": formData.sistemaCardiorespiratorio.tosseEspirros,
          "Secreção": formData.sistemaCardiorespiratorio.secrecao,
          "Intolerância ao Exercício": formData.sistemaCardiorespiratorio.intoleranciaExercicio,
          "Cardiopatia": formData.sistemaCardiorespiratorio.cardiopatia,
          "Aumento de Volume": formData.sistemaCardiorespiratorio.aumentoDeVolume,
        },

        "Sistema Geniturinário": {
          "Micção": formData.sistemaGeniturinario.miccao,
          "Castrado / Inteiro": formData.sistemaGeniturinario.castradoInteiro,
          "Reprodução (Cios, etc.)": formData.sistemaGeniturinario.tipo1,
          "Infecções / Secreções": formData.sistemaGeniturinario.tipo2,
        },

        "Sistema Nervoso": {
          "Convulsões / Desequilíbrios": formData.sistemaNervoso.convulsoesDesequilibrios,
          "Alterações Comportamentais": formData.sistemaNervoso.alteracoesComportamentais,
          "Nistagmo / Mioclonias": formData.sistemaNervoso.nistagmoMioclonias,
          "Dor de Cabeça": formData.sistemaNervoso.dorDeCabeca,
          "Sinais Neurológicos": formData.sistemaNervoso.sinaisNeurologicos,
        },

        "Sistema Osteoarticular / Locomotor": {
          "Postura / Marcha": formData.sistemaOsteoarticularLocomotor.posturaMarcha,
          "Claudicação": formData.sistemaOsteoarticularLocomotor.claudinacao,
          "Tipo (Paralisia, Paresia, Ataxia)": formData.sistemaOsteoarticularLocomotor.tipo3,
          "Tipo (Atonia, Hipotonia, Hipertonia)": formData.sistemaOsteoarticularLocomotor.tipo4,
        },

        "Sistema Tegumentar / Anexos": {
          "Pruridos / Lambedura": formData.sistemaTegumentarAnexos.tipo5,
          "Descamações / Lesões": formData.sistemaTegumentarAnexos.tipo6,
          "Odores / Secreções": formData.sistemaTegumentarAnexos.odoresSecrecoes,
          "Qualidade da Pelagem": formData.sistemaTegumentarAnexos.qualidade,
          "Acusia": formData.sistemaTegumentarAnexos.acusia,
          "Unhas": formData.sistemaTegumentarAnexos.unhas,
        },

        "Sistema Visual": {
          "Opacificação do Cristalino": formData.sistemaVisual.opacificacaoDeCristalino,
          "Perda da Visão": formData.sistemaVisual.perdaDaVisao,
          "Secreção Ocular": formData.sistemaVisual.secrecao2,
        },

        "Manejos Gerais": {
          "Vacinação": formData.manejosGerais.vacinacao,
          "Desverminização": formData.manejosGerais.desverminizacao,
          "Ambiente": formData.manejosGerais.ambiente,
          "Banhos": formData.manejosGerais.banhos,
          "Contactantes": formData.manejosGerais.contactantes,
        },

        "Sensibilidade - Pontos Mu": formData.sensibilidadePontosMu,
        "Sensibilidade - Pontos Shu": formData.sensibilidadePontosShu,
        "Sensibilidade Corporal à Dor": formData.sensibilidadeDorCorporal,
        "Pulso": formData.pulso,
        "Língua": formData.lingua,

        "Perguntas Adicionais (MTC)": {
          "Histórico Ancestral": formData.perguntasAdicionaisMTC.historicoAncestral,
          "Comportamento": formData.perguntasAdicionaisMTC.comportamento,
          "Latido / Miado": formData.perguntasAdicionaisMTC.latidoMiado,
          "Sono": formData.perguntasAdicionaisMTC.sono,
          "Descrição": formData.perguntasAdicionaisMTC.descricao,
        },

        "Diagnóstico MTC": {
          "Órgãos e Substâncias": formData.diagnosticoMTC.orgaosSubstacias,
          "Wu Xing (Cinco Elementos)": formData.diagnosticoMTC.wuXing,
          "Zang Fu": formData.diagnosticoMTC.zangFu,
        },

        "Responsável pelo Atendimento": formData.responsavel,
        "Estagiário": formData.estagiario,
        "CPF do Responsável": formData.cpf,
        "Princípios da Conduta": formData.principios,
        "Constituição Corporal": formData.constituicaoCorporal,
        "Preferências do Animal": formData.preferencias

      },
      dataHora: dataFormatada
    };

    try {
      const resultado = await createFicha(fichaData);
      localStorage.setItem('fichaId', resultado.id.toString());
      localStorage.removeItem("fichaReabilitacaoFormData");
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar ficha:", error);
      setShowErrorAlert(true);
    }
  };

  const cleanLocalStorage = () => {
    localStorage.removeItem("fichaReabilitacaoFormData");
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Reabilitacao
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            cleanLocalStorage={cleanLocalStorage}
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
                <Alert message="Ficha criada com sucesso!"
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