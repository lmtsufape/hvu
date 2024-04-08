import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { FinalizarGreenButton } from "../GreenButton";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';
import VoltarButton from '../VoltarButton';
import AnimalList from "@/hooks/useAnimalList";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import TipoConsultaList from "@/hooks/useTipoConsultaList";
import { createVagaEspecial } from "../../../services/vagaService";

function AgendamentoEspecial() {
  const router = useRouter();
  
  const [vaga, setVaga] = useState({
    dataHora: "", // Aqui a data e hora serão armazenadas no formato desejado
    status: "",
    especialidade: {id: null},
    proximaConsulta: "",
    animal: {id: null},
    tipoConsulta: {id: null},
  });
  console.log("vaga:", vaga);

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

  function handleInputChange(event) {
    const { name, value } = event.target;
    setVaga({ ...vaga, [name]: value })
  };

  const [escolherData, setEscolherData] = useState(null);
  const [escolherHorario, setEscolherHorario] = useState(null);

  function handleDateChange(date) {
    setEscolherData(date);
  }

  function handleHorarioChange(event) {
    setEscolherHorario(event.target.value);
  }

  console.log("escolherData:", escolherData);
  console.log("escolherHorario:", escolherHorario);
  

  const handleSubmit = async () => {
    // Aqui combinamos a data e hora selecionadas pelo usuário
    const dataHora = new Date(escolherData);
    dataHora.setHours(parseInt(escolherHorario.split('h')[0])); // Obtém apenas a hora e converte para inteiro
    dataHora.setMinutes(0); // Define os minutos como zero, já que não estamos considerando minutos no formulário

    const vagaToCreate = {
      dataHora: dataHora.toISOString(), // Formata a data e hora no formato desejado
      status: vaga.status,
      especialidade: {id: parseInt(selectedEspecialidade)},
      proximaConsulta: vaga.proximaConsulta,
      animal: {id: parseInt(selectedAnimal)},
      tipoConsulta: {id: parseInt(selectedTiposConsulta)},
    }
    console.log("vagaToCreate:", vagaToCreate);

    try {
      await createVagaEspecial(vagaToCreate);
      alert("Agendamento criado com sucesso!");
      router.push("/agendamentosDia");
    } catch (error) {
      console.error("Erro ao realizar agendamento:", error);
      alert("Erro ao realizar agendamento. Por favor, tente novamente.");
    }
  }

  return (
    <>
    <div className={styles.voltarButtonHeader}>
    < VoltarButton />
    </div>
      <div>
        <h1 className={styles.titulocadastro}>Novo agendamento</h1>
      </div>
      <div className={`${styles.boxagendarconsulta} ${styles.container}`}>
        <form>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="data" className="form-label">Data</label>
              <div className={`form-control ${styles.input}`}>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  className={styles.datepicker}
                  placeholderText="Ex: 13/07/2023"
                  locale={ptBR}
                  selected={escolherData}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className={`col ${styles.col}`}>
              <label htmlFor="horario" className="form-label">Horário</label>
              <select 
                className={`form-select ${styles.input}`}
                name="horario"
                aria-label="Selecione o horário"
                value={escolherHorario || ""}
                onChange={handleHorarioChange}
              >
                <option value="">Selecione o horário</option>
                <option value="08h00">08h00min</option>
                <option value="09h00">09h00min</option>
                <option value="10h00">10h00min</option>
                <option value="11h00">11h00min</option>
                <option value="13h00">13h00min</option>
                <option value="14h00">14h00min</option>
                <option value="15h00">15h00min</option>
                <option value="16h00">16h00min</option>
              </select>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="especialidade" className="form-label">Especialidade</label>
                <select 
                  className={`form-select ${styles.input}`}
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
              </div>
              {/* transformar isso aqui em tipo um search */}
              <div className={`col ${styles.col}`}>
                <label htmlFor="animal" className="form-label">Paciente</label>
                <select 
                  className={`form-select ${styles.input}`}
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
              </div>
            </div>
          </div>
          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="status" className="form-label">Status</label>
                <input type="text"
                  className={`form-control ${styles.input}`}
                  name="status"
                  placeholder="Digite o status"
                  value={vaga.status}
                  onChange={handleInputChange}
                >
                </input>
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="tipoConsulta" className="form-label">Tipo de Consulta</label>
                <select 
                  className={`form-select ${styles.input}`}
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
              </div>
            </div>
          </div>


          <div className={styles.continuarbotao}>
            <button className={styles.voltarButton}>Cancelar</button>
            <button type="button" className={styles.continuarButton}  onClick={handleSubmit}>Criar</button>
          </div>
        </form>
      </div>
      </>


      )
}

  export default AgendamentoEspecial;
