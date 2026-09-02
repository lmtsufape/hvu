import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';

import Dermatologica from "./AnamneseFicha";
import Dermatologica2 from "./FisicoFicha";
import Dermatologica3 from "./DermatologicoFicha";
import DermatologicaPDF from './DermatologicaPDF';

import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";

import { getCurrentUsuario } from '../../../../services/userService';
import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getAnimalById } from "../../../../services/animalService";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getMedicoById } from "../../../../services/medicoService";

// Dynamic import fora do componente
const PDFLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
  <button type="button" className={styles.green_buttonFichas} style={{ width: 'auto', padding: '0 1.5rem' }}>
    <PDFLink 
      document={<DermatologicaPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} 
      fileName={`FichaDermatologica_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`} 
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function UpdateDermatologicaSteps() {
  const router = useRouter();
  const { modo, animalId: queryAnimalId, fichaId: queryFichaId, agendamentoId: queryAgendamentoId, consultaId: queryConsultaId } = router.query;

  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [consultaId, setConsultaId] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [data, setData] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [imagemDesenhada, setImagemDesenhada] = useState(null);
  const [animal, setAnimal] = useState({});
  const [tutor, setTutor] = useState({});
  const [medicoLogado, setMedicoLogado] = useState(null);

  const [showOtherInputConviveComAnimais, setShowOtherInputConviveComAnimais] = useState(false);
  const [otherValueConviveComAnimais, setOtherValueConviveComAnimais] = useState("");
  const [showOtherInputProdutosUtilizados, setShowOtherInputProdutosUtilizados] = useState(false);
  const [otherValueProdutosUtilizados, setOtherValueProdutosUtilizados] = useState("");

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

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
    imagemLesao: {
      imagem: "",
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
    diagnostico: {
      definitivo: "",
      observacoes: "",
      prognostico: "",
    },
    tratamentoDermatologico: [
      { medicacao: "", dose: "", frequencia: "", periodo: "" }
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

  useEffect(() => {
    if (modo === 'visualizar') {
      setIsReadOnly(true);
    }
  }, [modo]);

  useEffect(() => {
    if (router.isReady) {
      if (queryConsultaId) setConsultaId(queryConsultaId);
      if (queryFichaId) setFichaId(queryFichaId);
      if (queryAgendamentoId) setAgendamentoId(queryAgendamentoId);
      if (queryAnimalId) setAnimalId(queryAnimalId);
    }
  }, [router.isReady, queryConsultaId, queryFichaId, queryAgendamentoId, queryAnimalId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedRoles = JSON.parse(localStorage.getItem('roles') || "[]");
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUsuario();
        const medicoId = userData?.usuario?.id;
        if (medicoId) {
          const medicoCompletoData = await getMedicoById(medicoId);
          setMedicoLogado(medicoCompletoData);
        }
      } catch (error) {
        console.error('Erro ao buscar médico:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!animalId) return;

    const fetchDataForPDF = async () => {
      try {
        const [animalData, tutorData] = await Promise.all([
          getAnimalById(animalId),
          getTutorByAnimal(animalId)
        ]);
        setAnimal(animalData || {});
        setTutor(tutorData || {});
      } catch (error) {
        console.error('Erro ao buscar dados para o PDF:', error);
      }
    };
    fetchDataForPDF();
  }, [animalId]);

  useEffect(() => {
    if (modo === "criar") {
      setLoading(false);
      return;
    }

    if (!fichaId) return;

    const fetchFichaData = async () => {
      try {
        const formDataResponse = await getFichaById(fichaId);
        if (formDataResponse?.conteudo) {
          const parsedConteudo = typeof formDataResponse.conteudo === 'string'
            ? JSON.parse(formDataResponse.conteudo)
            : formDataResponse.conteudo;
          setFormData(parsedConteudo);
          if (parsedConteudo?.imagemLesao?.imagem) {
            setImagemDesenhada(parsedConteudo.imagemLesao.imagem);
          }
        }
        setData(formDataResponse?.dataHora);
      } catch (error) {
        console.error('Erro ao buscar dados da ficha:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFichaData();
  }, [fichaId, modo]);

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    );
  }

  if (!roles.includes("medico") && !roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    );
  }

  const handleChangeSelect = (e) => {
    setFormData((prev) => ({
      ...prev,
      tipo: {
        ...prev.tipo,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleLinfonodoChange = (e, linfonodo) => {
    const { checked } = e.target;
    setFormData((prevState) => {
      const updatedLinfonodos = { ...prevState.linfonodos };
      if (checked) {
        updatedLinfonodos[linfonodo] = [];
      } else {
        delete updatedLinfonodos[linfonodo];
      }
      return {
        ...prevState,
        linfonodos: updatedLinfonodos
      };
    });
  };

  const handleCaracteristicaChange = (e, linfonodo) => {
    const { name, checked } = e.target;
    setFormData((prevState) => {
      const currentValues = prevState.linfonodos?.[linfonodo] || [];
      let nextValues = checked
        ? [...currentValues, name]
        : currentValues.filter((item) => item !== name);

      if (name === "reativos" && checked) {
        nextValues = nextValues.filter((item) => item !== "semAlteracao");
      }
      if (name === "semAlteracao" && checked) {
        nextValues = nextValues.filter((item) => item !== "reativos");
      }

      return {
        ...prevState,
        linfonodos: {
          ...prevState.linfonodos,
          [linfonodo]: nextValues
        }
      };
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      if (name.startsWith("tratamentosAtuais.")) {
        const field = name.split(".")[1];
        return {
          ...prev,
          tratamentosAtuais: {
            ...prev.tratamentosAtuais,
            [field]: value
          }
        };
      } else {
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
        ...(prev.tratamentoDermatologico || []),
        { medicacao: "", dose: "", frequencia: "", periodo: "" }
      ]
    }));
  };

  const removerUltimaLinhaTratamento = () => {
    setFormData((prev) => {
      const tratamentos = prev.tratamentoDermatologico;
      if (tratamentos?.length > 1) {
        return {
          ...prev,
          tratamentoDermatologico: tratamentos.slice(0, -1),
        };
      }
      return prev;
    });
  };

  const handleSaveDrawing = (imagemFinal, linhasDesenhadas) => {
    setFormData((prev) => ({
      ...prev,
      imagemLesao: {
        imagem: imagemFinal,
        linhasDesenhadas: linhasDesenhadas
      }
    }));
    setImagemDesenhada(imagemFinal);
  };

  const handleCheckboxChange = (event, field) => {
    const { value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter((item) => item !== value)
    }));
  };

  const handleCheckboxChangeOutros = (event, field, setShowOtherInput, setOtherValue) => {
    const { value, checked } = event.target;

    if (value === "Outros") {
      setShowOtherInput(checked);
      if (!checked) setOtherValue("");
    }
    setFormData((prev) => {
      if (field === "conviveComAnimais" || field === "produtosUtilizados") {
        return {
          ...prev,
          [field]: checked
            ? [...(prev[field] || []), value]
            : (prev[field] || []).filter((item) => item !== value)
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

  const handleSubmit = async () => {
    setShowErrorAlert(false);

    const currentModo = modo || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('modo'));
    const currentFichaId = fichaId || queryFichaId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fichaId'));
    const currentAgendamentoId = agendamentoId || queryAgendamentoId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('agendamentoId'));

    const dataFormatada = moment(data).isValid() 
      ? moment(data).format("YYYY-MM-DDTHH:mm:ss") 
      : moment().format("YYYY-MM-DDTHH:mm:ss");

    let conviveComAnimaisFinal = [...(formData.conviveComAnimais || [])];
    let produtosUtilizadosFinal = [...(formData.produtosUtilizados || [])];

    if (conviveComAnimaisFinal.includes("Outros") && otherValueConviveComAnimais.trim() !== "") {
      conviveComAnimaisFinal = conviveComAnimaisFinal.filter((item) => item !== "Outros");
      conviveComAnimaisFinal.push(otherValueConviveComAnimais.trim());
    }
    if (produtosUtilizadosFinal.includes("Outros") && otherValueProdutosUtilizados.trim() !== "") {
      produtosUtilizadosFinal = produtosUtilizadosFinal.filter((item) => item !== "Outros");
      produtosUtilizadosFinal.push(otherValueProdutosUtilizados.trim());
    }

    const fichaData = {
      nome: "Ficha clínica dermatológica",
      conteudo: {
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
        tipo: formData.tipo,
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
      dataHora: dataFormatada,
      agendamento: { id: Number(currentAgendamentoId) }
    };

    try {
      if (currentModo === "criar" || !currentFichaId || currentFichaId === "null") {
        await createFicha(fichaData);
      } else {
        await updateFicha(fichaData, currentFichaId);
      }
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);
      setErrorMessage(error?.response?.data?.message || (currentModo === "criar" || !currentFichaId ? "Erro ao criar ficha" : "Erro ao editar ficha"));
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
    switch (step) {
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
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {renderStepContent()}

      <div className={styles.footerControls}>
        {!loading && animal?.id && tutor?.id && medicoLogado && (
          <DownloadPdfStyledButton
            ficha={formData}
            animal={animal}
            tutor={tutor}
            medicoLogado={medicoLogado}
          />
        )}
      </div>

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

      {showAlert && (
        <div className={styles.alert}>
          <Alert
            message={modo === "criar" ? "Ficha criada com sucesso!" : "Ficha editada com sucesso!"}
            show={showAlert}
            url={consultaId ? `/createConsulta/${consultaId}` : (animalId ? `/getAllConsultas/${animalId}` : `/getAllConsultas`)}
          />
        </div>
      )}

      {showErrorAlert && (
        <div className={styles.alert}>
          <ErrorAlert
            message={errorMessage || (modo === "criar" ? "Erro ao criar ficha" : "Erro ao editar ficha")}
            show={showErrorAlert}
          />
        </div>
      )}
    </div>
  );
}

export default UpdateDermatologicaSteps;