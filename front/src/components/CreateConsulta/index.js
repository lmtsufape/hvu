import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import "react-datepicker/dist/react-datepicker.css";
import VoltarButton from "../VoltarButton";
import EspecialidadeList from "@/hooks/useEspecialidadeList"
import { CancelarWhiteButton } from "../WhiteButton";
import { getVagaById } from "../../../services/vagaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";
import FinalizarFichaModal from "../Fichas/FinalizarFichaModal";
import SolicitacaoDeExameAninhar from "../Fichas/SolicitacaoDeExameAninhar";
import FichaClinicaMedicaAninhar from "../Fichas/FichaClinicaMedicaAninhar";
import moment from "moment";
import { createFicha } from "../../../services/fichaService";


function CreateConsulta() {
  const router = useRouter();
  const { id } = router.query;

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});
   const [errorMessage, setErrorMessage] = useState("")

  const [animalId, setAnimalId] = useState(null);
  const [mostrarExames, setMostrarExames] = useState(false);
  const [mostrarFichaClinica, setMostrarFichaClinica] = useState(false);
  const [medicoId, setMedicoId] = useState(null);


  const [consulta, setConsulta] = useState({
    pesoAtual: null,
    idadeAtual: null,
    queixaPrincipal: "",
    alteracoesClinicasDiversas: "",
    suspeitasClinicas: "",
    alimentacao: "",
    medico: { id: null },
    parecer: null,
    proximaConsulta: false,
    encaminhamento: null,
    animal: { id: null },
    dataVaga: "",
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
    FichaClinicaMedica: {
    queixaPrincipal: "",
    HistoricoMedico: { progresso: "" },
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
    vermifugacaoDetalhes: { vermifugacao: "", produto: "", data: "" },
    ectoparasitosDetalhes: { ectoparasitos: "", produto: "", data: "" },
    tpc: "",
    turgorCutaneo: "",
    freqCardiaca: "",
    freqRespiratoria: "",
    ExameFisico: {
      alimentacao: "",
      postura: "",
      temperatura: "",
      score: "",
      hidratacao: "",
    },
    option: {
      roseas: false,
      roseasPalidas: false,
      porcelanicas: false,
      hiperemicas: false,
      cianoticas: false,
      ictaricas: false,
      naoAvaliado: false,
    },
    mucosas: {
      roseas: "",
      roseasPalidas: "",
      porcelanicas: "",
      hiperemicas: "",
      cianoticas: "",
      ictaricas: "",
      naoAvaliado: "",
    },
    linfonodos: {},
    fisicogeral: {},
    diagnostico: {},
    medicacoes: [{ medicacao: "", dose: "", frequencia: "", periodo: "" }],
    plantonistas: "",
    medicosResponsaveis: "",
  },
  });
   {mostrarFichaClinica && (
  <FichaClinicaMedicaAninhar
    formData={consulta.FichaClinicaMedica}
    setFormData={setConsulta}
  />
)}

  const [vagaData, setVagaData] = useState({});

  const { especialidades, error: especialidadesError } = EspecialidadeList();
  const [especialidade, setEspecialidade] = useState(null);
  const handleEspecialidadeSelection = (event) => {
    const selectedEspecialidadeId = event.target.value;
    setEspecialidade(selectedEspecialidadeId);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        const storedRoles = JSON.parse(localStorage.getItem('roles'));
        setToken(storedToken || "");
        setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const vagaJson = await getVagaById(id);
          setVagaData(vagaJson);
          setAnimalId(vagaJson.agendamento.animal.id);
          setMedicoId(vagaJson.medico.id);
        } catch (error) {
          console.error('Erro ao buscar vaga:', error);
        } finally {
          setLoading(false); // Marcar como carregado após buscar os dados
        }
      };
      fetchData();
    }
  }, [id]);

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

  const handleConsultaChange = (event) => {
    const { name, value } = event.target;
    setConsulta({ ...consulta, [name]: value });
  };

  function handleProximaConsultaChange(event) {
    const { value } = event.target;
    setConsulta({ ...consulta, proximaConsulta: value === "true" });
  }

  const validateFields = (consulta) => {
    const errors = {};
    if (!consulta.pesoAtual) {
      errors.pesoAtual = "Campo obrigatório";
    }
    if (!consulta.idadeAtual) {
      errors.idadeAtual = "Campo obrigatório";
    }
    if (consulta.queixaPrincipal == "") {
      errors.queixaPrincipal = "Campo obrigatório";
    }
    if (consulta.alteracoesClinicasDiversas == "") {
      errors.alteracoesClinicasDiversas = "Campo obrigatório";
    }
    if (consulta.suspeitasClinicas == "") {
      errors.suspeitasClinicas = "Campo obrigatório";
    }
    if (consulta.alimentacao == "") {
      errors.alimentacao = "Campo obrigatório";
    }
    
    return errors;
  };    

     const handleFinalizar = async () => {
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
        const fichaData = {
          nome: "Criar consulta",
          conteudo: {
            pesoAtual: consulta.pesoAtual,
            idadeAtual: consulta.idadeAtual,
            queixaPrincipal: consulta.queixaPrincipal,
            alteracoesClinicasDiversas: consulta.alteracoesClinicasDiversas,
            suspeitasClinicas: consulta.suspeitasClinicas,
            alimentacao: consulta.alimentacao,
            proximaConsulta: consulta.proximaConsulta,
            encaminhamento: especialidade,
            animal: { id: animalId },
            medico: { id: medicoId },
            parecer: consulta.parecer,
            dataVaga: vagaData.dataVaga,
            SolicitacaoDeExame: consulta.SolicitacaoDeExame,
            FichaClinicaMedica: consulta.FichaClinicaMedica,
          },
          dataHora: dataFormatada,
        };
    
        try {
          console.log(fichaData);
          await createFicha(fichaData);
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
    const toggleMostrarExames = () => {
      setMostrarExames((prev) => !prev);
    };
    const toggleMostrarFichaClinica = () => {
      setMostrarFichaClinica((prev) => !prev);
    };

  return (
    <>
      <VoltarButton />
      <div>
        <h1 className={styles.titulocadastro}>Criar consulta</h1>
      </div>

      <div className={`${styles.boxagendarconsulta} ${styles.container}`}>
        <form>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="animal" className="form-label">Paciente<span className={styles.obrigatorio}>*</span></label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={vagaData.agendamento && vagaData.agendamento.animal && vagaData.agendamento.animal.nome || "Carregando..."}
                disabled
              />
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;<span className={styles.obrigatorio}>*</span></label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={vagaData.medico && vagaData.medico.nome || "Carregando..."}
                disabled
              />
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="pesoAtual" className="form-label">Peso atual<span className={styles.obrigatorio}>*</span></label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.pesoAtual ? "is-invalid" : ""}`}
                  name="pesoAtual"
                  placeholder="Digite o peso do animal"
                  value={consulta.pesoAtual || ""}
                  onChange={handleConsultaChange}
                />
                {errors.pesoAtual && <div className={`invalid-feedback ${styles.error_message}`}>{errors.pesoAtual}</div>}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="idadeAtual" className="form-label">Idade atual<span className={styles.obrigatorio}>*</span></label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.idadeAtual ? "is-invalid" : ""}`}
                  name="idadeAtual"
                  placeholder="Digite a idade do animal"
                  value={consulta.idadeAtual || ""}
                  onChange={handleConsultaChange}
                />
                {errors.idadeAtual && <div className={`invalid-feedback ${styles.error_message}`}>{errors.idadeAtual}</div>}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="medico" className="form-label">Especialidade</label>
                <select 
                  className={`form-select ${styles.input}`}
                  name="encaminhamento"
                  aria-label="Selecione uma especialidade"
                  value={especialidade || ""}
                  onChange={handleEspecialidadeSelection}
                >
                  <option value="">Selecione uma especialidade</option>
                  {especialidades.map((especialidade) => (
                    <option key={especialidade.id} value={especialidade.id}>
                      {especialidade.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="queixaPrincipal" className="form-label">Queixa principal</label>
                <textarea
                  className={`form-control ${styles.input} ${errors.queixaPrincipal ? "is-invalid" : ""}`}
                  name="queixaPrincipal"
                  placeholder="Digite a queixa principal"
                  value={consulta.queixaPrincipal || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="alteracoesClinicasDiversas" className="form-label">Alterações clínicas diversas</label>
                <textarea
                  className={`form-control ${styles.input} ${errors.alteracoesClinicasDiversas ? "is-invalid" : ""}`}
                  name="alteracoesClinicasDiversas"
                  placeholder="Digite as alterações clínicas diversas"
                  value={consulta.alteracoesClinicasDiversas || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="suspeitasClinicas" className="form-label">Suspeitas clínicas</label>
                <textarea
                  className={`form-control ${styles.input} ${errors.suspeitasClinicas ? "is-invalid" : ""}`}
                  name="suspeitasClinicas"
                  placeholder="Digite as suspeitas clínicas"
                  value={consulta.suspeitasClinicas || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="alimentacao" className="form-label">Alimentação</label>
                <textarea
                  className={`form-control ${styles.input} ${errors.alimentacao ? "is-invalid" : ""}`}
                  name="alimentacao"
                  placeholder="Digite a alimentação"
                  value={consulta.alimentacao || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50" 
                />
                </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col_radio}`}>
                <label htmlFor="tipoEspecial" className="form-label">
                  Retorno?
                </label>
                <div>
                  <input
                    type="radio"
                    className={`form-check-input ${styles.checkbox}`}
                    id="sim"
                    name="proximaConsulta"
                    value="true"
                    checked={consulta.proximaConsulta === true}
                    onChange={handleProximaConsultaChange}
                  />
                  <label htmlFor="sim" className={styles.input}>
                    Sim
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    className={`form-check-input ${styles.checkbox}`}
                    id="nao"
                    name="proximaConsulta"
                    value="false"
                    checked={consulta.proximaConsulta === false}
                    onChange={handleProximaConsultaChange}
                  />
                  <label htmlFor="nao" className={styles.input}>
                    Não
                  </label>
                </div>
              </div>
            </div>
          </div>

           <button
            type="button"
            onClick={toggleMostrarExames}
            className={`${styles.toggleButton} ${
              mostrarExames ? styles.minimize : styles.expand
            }`}
          >
            {mostrarExames ? "Ocultar Exames" : "Solicitar Exame"}
          </button>
          {mostrarExames && (
            <SolicitacaoDeExameAninhar
              formData={consulta.SolicitacaoDeExame}
              setFormData={setConsulta}
            />
          )}
          <button
            type="button"
            onClick={toggleMostrarFichaClinica}
            className={`${styles.toggleButton} ${mostrarFichaClinica ? styles.minimize : styles.expand}`}
          >
            {mostrarFichaClinica ? "Ocultar Ficha Clínica" : "Preencher Ficha Clínica"}
          </button>
          {mostrarFichaClinica && (
            <FichaClinicaMedicaAninhar
              formData={consulta.FichaClinicaMedica}
              setFormData={setConsulta}
            />
          )}


         <div className={styles.button_box}>
            <CancelarWhiteButton />
            <FinalizarFichaModal onConfirm={handleFinalizar} />
          </div>
        </form>
        
        {showAlert && <Alert message="Consulta criada com sucesso!" show={showAlert} url={`/getAllConsultas/${vagaData.agendamento.animal.id}`} />}
        {vagaData.consulta === null ? (
          showErrorAlert && <ErrorAlert message="Erro ao criar consulta, tente novamente." show={showErrorAlert} />
        ) : (
          showErrorAlert && <ErrorAlert message="Consulta já foi criada, tente editá-la." show={showErrorAlert} />
        )}
        
      </div>
    </>
  );
}


export default CreateConsulta;