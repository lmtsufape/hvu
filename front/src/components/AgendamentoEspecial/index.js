import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import { FinalizarGreenButton } from "../GreenButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
import VoltarButton from "../VoltarButton";
import AnimalList from "@/hooks/useAnimalList";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import TipoConsultaList from "@/hooks/useTipoConsultaList";
import MedicoList from "@/hooks/useMedicoList";
import { createVagaEspecial } from "../../../services/vagaService";
import { createAgendamento } from "../../../services/agendamentoService";

function AgendamentoEspecial() {
  const router = useRouter();

  const [errors, setErrors] = useState({});

  const [vaga, setVaga] = useState({
    dataHora: "", // Aqui a data e hora serão armazenadas no formato desejado
    status: "",
    especialidade: { id: null },
    tipoConsulta: { id: null },
    agendamento: { id: null },
    medico: { id: null },
  });

  const { animais } = AnimalList();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const handleAnimalSelection = (event) => {
    const selectedId = event.target.value;
    setSelectedAnimal(selectedId);
  };

  const { especialidades } = EspecialidadeList();
  const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
  const handleEspecialidadeSelection = (event) => {
    const selectedId = event.target.value;
    setSelectedEspecialidade(selectedId);
  };

  const { tiposConsulta } = TipoConsultaList();
  const [selectedTiposConsulta, setSelectedTiposConsulta] = useState(null);
  const handleTiposConsultaSelection = (event) => {
    const selectedId = event.target.value;
    setSelectedTiposConsulta(selectedId);
  };

  const { medicos } = MedicoList();
  const [selectedMedico, setSelectedMedico] = useState(null);
  const handleMedicoSelection = (event) => {
    const selectedId = event.target.value;
    setSelectedMedico(selectedId);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVaga({ ...vaga, [name]: value });
  };

  const [escolherData, setEscolherData] = useState(null);
  const [escolherHorario, setEscolherHorario] = useState(null);

  const handleDateChange = (date) => {
    setEscolherData(date);
  };

  const handleHorarioChange = (event) => {
    setEscolherHorario(event.target.value);
  };

  const createNewAgendamento = async () => {
    if (!escolherData || !escolherHorario) {
      console.error("Escolha uma data e horário válidos.");
      return null;
    }
  
    try {
      const dataVaga = new Date(escolherData);
      dataVaga.setHours(parseInt(escolherHorario.split("h")[0] || 0));
      dataVaga.setMinutes(0);
  
      const agendamentoToCreate = {
        dataVaga: dataVaga.toISOString(),
        animal: { id: parseInt(selectedAnimal) },
        tipoEspecial: true,
        status: vaga.status,
      };
  
      const newAgendamento = await createAgendamento(agendamentoToCreate);
      return newAgendamento;
    } catch (error) {
      console.error("Erro ao realizar novo agendamento:", error);
      return null;
    }
  };

  console.log("createNewAgendamento:", createNewAgendamento());

  const handleSubmit = async () => {
    const validationErrors = validateFields(vaga);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newAgendamento = await createNewAgendamento();

    if (!newAgendamento) {
      console.error("Erro ao criar novo agendamento.");
      return;
    }

    const dataHora = new Date(escolherData);
    dataHora.setHours(parseInt(escolherHorario.split("h")[0] || 0));
    dataHora.setMinutes(0);

    const vagaToCreate = {
      dataHora: dataHora.toISOString(),
      status: vaga.status,
      especialidade: { id: parseInt(selectedEspecialidade) },
      tipoConsulta: { id: parseInt(selectedTiposConsulta) },
      agendamento: { id: parseInt(newAgendamento.id) },
    };

    try {
      await createVagaEspecial(vagaToCreate);
      alert("Agendamento criado com sucesso!");
      router.push("/agendamentosDia");
    } catch (error) {
      console.error("Erro ao criar vaga especial:", error);
      alert("Erro ao realizar agendamento. Por favor, tente novamente.");
    }
  };

  const validateFields = (vaga) => {
    const errors = {};
    if (!vaga.dataHora) {
      errors.dataHora = "Campo obrigatório";
    }
    if (!vaga.status) {
      errors.status = "Campo obrigatório";
    }
    if (selectedAnimal === null) {
      errors.selectedAnimal = "Campo obrigatório";
    }
    if (selectedEspecialidade === null) {
      errors.selectedEspecialidade = "Campo obrigatório";
    }
    if (selectedTiposConsulta === null) {
      errors.selectedTiposConsulta = "Campo obrigatório";
    }
    if (selectedMedico === null) {
      errors.selectedMedico = "Campo obrigatório";
    }
    if (escolherHorario === null) {
      errors.escolherHorario = "Campo obrigatório";
    }
    if (escolherData === null) {
      errors.escolherData = "Campo obrigatório";
    }

    return errors;
  };

  return (
    <>
      <div className={styles.voltarButtonHeader}>
        <VoltarButton />
      </div>
      <div>
        <h1 className={styles.titulocadastro}>Novo agendamento</h1>
      </div>

      <div className={`${styles.boxagendarconsulta} ${styles.container}`}>
        <form>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="data" className="form-label">
                Data
              </label>
              <div className={`form-control ${styles.input} ${errors.escolherData ? "is-invalid" : ""}`}>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  className={styles.datepicker}
                  placeholderText="Ex: 13/07/2023"
                  locale={ptBR}
                  selected={escolherData}
                  onChange={handleDateChange}
                />
                {errors.escolherData && <div className="invalid-feedback">{errors.escolherData}</div>}
              </div>
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="escolherHorario" className="form-label">
                Horário
              </label>
              <input
                type="time"
                className={`form-control ${styles.input} ${errors.escolherHorario ? "is-invalid" : ""}`}
                name="dataVaga"
                aria-label="Selecione o horário"
                value={escolherHorario || ""}
                onChange={handleHorarioChange}
              />
              {errors.escolherHorario && <div className="invalid-feedback">{errors.escolherHorario}</div>}
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="medico" className="form-label">
                  Veterinário(a)
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
                {errors.selectedMedico && <div className="invalid-feedback">{errors.selectedMedico}</div>}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="especialidade" className="form-label">
                  Especialidade
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
                {errors.selectedEspecialidade && <div className="invalid-feedback">{errors.selectedEspecialidade}</div>}
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  className={`form-select ${styles.input} ${errors.status ? "is-invalid" : ""}`}
                  name="status"
                  aria-label="Selecione o status"
                  value={vaga.status}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione o status</option>
                  <option value="Agendado">Agendado</option>
                  <option value="Pré criado">Pré criado</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="tipoConsulta" className="form-label">
                  Tipo de Consulta
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
                    <option key={tipoConsulta.id} value={tipoConsulta.id}>
                      {tipoConsulta.tipo}
                    </option>
                  ))}
                </select>
                {errors.selectedTiposConsulta && <div className="invalid-feedback">{errors.selectedTiposConsulta}</div>}
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="animal" className="form-label">
                  Paciente
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
                      {animal.nome}
                    </option>
                  ))}
                </select>
                {errors.selectedAnimal && <div className="invalid-feedback">{errors.selectedAnimal}</div>}
              </div>
              <div className={`col ${styles.col}`}></div>
            </div>
          </div>

          <div className={styles.continuarbotao}>
            <button className={styles.voltarButton}>Cancelar</button>
            <button type="button" className={styles.continuarButton} onClick={handleSubmit}>
              Criar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AgendamentoEspecial;
