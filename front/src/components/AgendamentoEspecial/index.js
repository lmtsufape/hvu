import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
import VoltarButton from "../VoltarButton";
import AnimalList from "@/hooks/useAnimalList";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import TipoConsultaList from "@/hooks/useTipoConsultaList";
import MedicoList from "@/hooks/useMedicoList";
import { createAgendamentoEspecial } from "../../../services/agendamentoService";
import { getMedicoByEspecialidade } from "../../../services/medicoService";
import { getAnimalComRetorno, getAnimalSemRetorno } from "../../../services/animalService";
import { format } from "date-fns";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";
import Select from 'react-select';
import { getTutorByAnimal } from "../../../services/tutorService";

function AgendamentoEspecial() {
  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errors, setErrors] = useState({});
  const [agendamento, setAgendamento] = useState({
    animal: { id: null },
    tipoEspecial: true,
    horario: "",
    especialidade: { id: null },
    tipoConsulta: { id: null },
    medico: { id: null }
  });
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedTiposConsulta, setSelectedTiposConsulta] = useState(null);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState();
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [escolherData, setEscolherData] = useState(null);
  const [escolherHorario, setEscolherHorario] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [tutores, setTutores] = useState({});

  const { animais } = AnimalList();
  const { tiposConsulta } = TipoConsultaList();
  const { especialidades } = EspecialidadeList();
  const { medicos } = MedicoList();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        const storedRoles = JSON.parse(localStorage.getItem('roles'));
        setToken(storedToken || "");
        setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    const fetchTutores = async () => {
      const tutoresTemp = {};
      for (const animal of animais) {
        try {
          const tutor = await getTutorByAnimal(animal.id, token);
          tutoresTemp[animal.id] = { nome: tutor.nome, cpf: tutor.cpf };
        } catch (error) {
          console.error(`Erro ao buscar tutor para o animal ${animal.id}:`, error);
        }
      }
      setTutores(tutoresTemp);
    };

    if (animais.length > 0) {
      fetchTutores();
    }
  }, [animais, token]);

  // Verifica se o usuário tem permissão
  if (!roles.includes("secretario")) {
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

  const handleAnimalSelection = (event) => {
    const selectAnimalId = event.target.value; 
    setSelectedAnimal(selectAnimalId); 
  };

  const handleTiposConsultaSelection = (event) => {
    const selectedTipo = JSON.parse(event.target.value);
    setSelectedTiposConsulta(selectedTipo);
    console.log("selectedTipo:", selectedTipo);
  };
  
  const handleEspecialidadeSelection = (event) => {
    const selectedId = event.target.value;
    setSelectedEspecialidade(selectedId);
  };
  
  const handleMedicoSelection = (event) => {
    const selectedId = event.target.value;
    setSelectedMedico(selectedId);
  };

  function handleTipoEspecialChange(event) {
    const { name, value } = event.target;
    setAgendamento({ ...agendamento, [name]: value === "true" });
  }

  const handleDateChange = (date) => {
    setEscolherData(date);
  };

  const handleHorarioChange = (event) => {
    setEscolherHorario(event.target.value);
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields(agendamento);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedDate = format(escolherData, "yyyy-MM-dd");
    const formattedTime = escolherHorario + ":00";
    const formattedDateTime = formattedDate + "T" + formattedTime;

    const agendamentoToCreate = {
      animal: { id: selectedAnimal },
      tipoEspecial: agendamento.tipoEspecial,
      horario: formattedDateTime,
      especialidade: { id: selectedEspecialidade },
      tipoConsulta: { id: selectedTiposConsulta },
      medico: { id: selectedMedico }
    };

    console.log("agendamentoToCreate:", agendamentoToCreate);

    try {
      await createAgendamentoEspecial(agendamentoToCreate);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar agendamento especial:", error);
      setShowErrorAlert(true);
    }
  };

  const validateFields = (agendamento) => {
    const errors = {};
    if (!selectedAnimal) {
      errors.selectedAnimal = "Campo obrigatório";
    }
    if (!selectedEspecialidade) {
      errors.selectedEspecialidade = "Campo obrigatório";
    }
    if (!selectedTiposConsulta) {
      errors.selectedTiposConsulta = "Campo obrigatório";
    }
    if (!selectedMedico) {
      errors.selectedMedico = "Campo obrigatório";
    }
    if (!escolherHorario) {
      errors.escolherHorario = "Campo obrigatório";
    }
    if (!escolherData) {
      errors.escolherData = "Campo obrigatório";
    }
    return errors;
  };

  const maskCPF = (cpf) => {
    if(!cpf) return "";

    return `***.${cpf.slice(4,11)}-**`;
  };

  return (
    <>
      <div className={styles.voltarButtonHeader}>
        <VoltarButton />
      </div>
      <div>
        <h1 className={styles.titulocadastro}>Criar agendamento</h1>
      </div>

      <div className={`${styles.boxagendarconsulta} ${styles.container}`}>
        <form>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="data" className="form-label">
                Data <span className={styles.obrigatorio}>*</span>
              </label>
              <div
                className={`form-control ${styles.input} ${errors.escolherData ? "is-invalid" : ""}`}
              >
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  className={styles.datepicker}
                  placeholderText="Ex: 13/07/2023"
                  locale={ptBR}
                  selected={escolherData}
                  onChange={handleDateChange}
                />
              </div>
              {errors.escolherData && (<div className={`invalid-feedback ${styles.error_message}`}> {errors.escolherData}</div> )}
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="escolherHorario" className="form-label">
                Horário <span className={styles.obrigatorio}>*</span>
              </label>
              <select
                className={`form-select ${styles.input} ${errors.escolherHorario ? "is-invalid" : ""}`}
                name="horario"
                aria-label="Selecione o horário"
                value={escolherHorario || ""}
                onChange={handleHorarioChange}
              >
                <option value="">Selecione o horário</option>
                <option value="07:30">07:30</option>
                <option value="08:30">08:30</option>
                <option value="09:30">09:30</option>
                <option value="10:30">10:30</option>
                <option value="12:30">12:30</option>
                <option value="13:30">13:30</option>
                <option value="14:30">14:30</option>
                <option value="15:30">15:30</option>
                <option value="16:30">16:30</option>
                <option value="17:30">17:30</option>
              </select>
              {errors.escolherHorario && (<div className={`invalid-feedback ${styles.error_message}`}>{errors.escolherHorario}</div>)}
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="especialidade" className="form-label">
                  Especialidade <span className={styles.obrigatorio}>*</span>
                </label>
                <select
                  className={`form-select ${styles.input} ${errors.selectedEspecialidade ? "is-invalid" : ""}`}
                  name="especialidade"
                  aria-label="Selecione a especialidade"
                  value={selectedEspecialidade || ""}
                  onChange={handleEspecialidadeSelection}
                >
                  <option value="">Selecione a especialidade</option>
                  {especialidades.map((especialidade) => (
                    <option key={especialidade.id} value={especialidade.id}>
                      {especialidade.nome}
                    </option>
                  ))}
                </select>
                {errors.selectedEspecialidade && (<div className={`invalid-feedback ${styles.error_message}`}>{errors.selectedEspecialidade}</div>)}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="medico" className="form-label">
                  Veterinário(a) <span className={styles.obrigatorio}>*</span>
                </label>
                <select
                  className={`form-select ${styles.input} ${errors.selectedMedico ? "is-invalid" : ""}`}
                  name="medico"
                  aria-label="Selecione o(a) veterinário(a)"
                  value={selectedMedico || ""}
                  onChange={handleMedicoSelection}
                >
                  <option value="">Selecione o(a) Veterinário(a)</option>
                  {medicos.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                      {medico.nome}
                    </option>
                  ))}
                </select>
                {errors.selectedMedico && (<div className={`invalid-feedback ${styles.error_message}`}>{errors.selectedMedico}</div>)}
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="tipoConsulta" className="form-label">
                  Tipo de Consulta <span className={styles.obrigatorio}>*</span>
                </label>
                <select
                  className={`form-select ${styles.input} ${errors.selectedTiposConsulta ? "is-invalid" : ""}`}
                  name="tipoConsulta"
                  aria-label="Selecione o tipo de consulta"
                  value={selectedTiposConsulta || ""}
                  onChange={handleTiposConsultaSelection}
                >
                  <option value="">Selecione o tipo de consulta</option>
                  {tiposConsulta.map((tipoConsulta) => (
                    <option key={tipoConsulta.tipo} value={tipoConsulta.id}>
                      {tipoConsulta.tipo}
                    </option>
                  ))}
                </select>
                {errors.selectedTiposConsulta && (<div className={`invalid-feedback ${styles.error_message}`}>{errors.selectedTiposConsulta}</div>)}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="animal" className="form-label">
                  Paciente <span className={styles.obrigatorio}>*</span>
                </label>
                <select
                  className={`form-select ${styles.input} ${errors.selectedAnimal ? "is-invalid" : ""}`}
                  name="animal"
                  aria-label="Selecione o paciente"
                  value={selectedAnimal || ""}
                  onChange={handleAnimalSelection}
                >
                  <option value="">Selecione o paciente</option>
                  {animais.map((animal) => (
                    <option key={animal.id} value={animal.id}>
                      {animal.nome} - {tutores[animal.id]?.nome} - {maskCPF(tutores[animal.id]?.cpf)}
                    </option>
                  ))}
                </select>
                {errors.selectedAnimal && (<div className={`invalid-feedback ${styles.error_message}`}>{errors.selectedAnimal}</div>)}
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col_radio}`}>
                <label htmlFor="tipoEspecial" className="form-label">
                  É tipo especial?
                </label>
                <div>
                  <input
                    type="radio"
                    className={`form-check-input ${styles.checkbox}`}
                    id="sim"
                    name="tipoEspecial"
                    value="true"
                    checked={agendamento.tipoEspecial === true}
                    onChange={handleTipoEspecialChange}
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
                    name="tipoEspecial"
                    value="false"
                    checked={agendamento.tipoEspecial === false}
                    onChange={handleTipoEspecialChange}
                  />
                  <label htmlFor="nao" className={styles.input}>
                    Não
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.continuarbotao}>
            <button className={styles.voltarButton}>Cancelar</button>
            <button type="button" className={styles.continuarButton} onClick={handleSubmit}>
              Criar
            </button>
          </div>
        </form>
        {<Alert message="Agendamento criado com sucesso!" show={showAlert} url='/agendamentosDia' />}
        {showErrorAlert && <ErrorAlert message="Erro ao realizar agendamento, tente novamente." show={showErrorAlert} />}
      </div>
    </>
  );
}

export default AgendamentoEspecial;
